import jwt from 'jsonwebtoken';
import { Telegraf } from 'telegraf';
import Bot from '../models/botModel.js';
import commandStatus from '../models/commandStatusModel.js';

const bots = {};

const prohibitedWords = ['word1', 'word2', 'word3'];
const prohibitedPattern = new RegExp(prohibitedWords.join('|'), 'i');

const startBot = async (botId, botToken) => {
    // If bot is launched, stop it
    if (bots[botId]) {
        bots[botId].stop();
    }

    // Launch bot
    bots[botId] = new Telegraf(botToken);
    bots[botId].start((ctx) => ctx.reply('Welcome'));
    bots[botId].launch();

    // Gets all invites for bot, and adds chat Id if it is a new chat
    bots[botId].on('new_chat_members', async (ctx) => {
        const chatId = ctx.chat.id;
        const chatType = ctx.chat.type;

        const botUsername = ctx.botInfo.username;
        const newMembers = ctx.message.new_chat_members;
        const isBotNewMember = newMembers.some(
            (member) => member.username === botUsername,
        );

        if (isBotNewMember) {
            try {
                // Find the bot document by botId
                const botDocument = await Bot.findById(botId);
                // If the bot document does not exist, return
                if (!botDocument) {
                    console.log(`Bot with botId ${botId} not found.`);
                    return;
                }

                const botChats = botDocument.botChats || [];

                // Check if the chatId already exists in botChats
                const chatExists = botChats.some(
                    (chat) => chat.chatId === chatId,
                );

                if (!chatExists) {
                    const newChat = {
                        chatId,
                        chatType,
                    };

                    botChats.push(newChat);

                    await Bot.findByIdAndUpdate(botId, { botChats });

                    console.log(`Chat ${chatId} added to bot ${botId}.`);
                } else {
                    console.log(
                        `Chat ${chatId} already exists in bot ${botId}.`,
                    );
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }
    });

    // MessageFilter functionality
    bots[botId].use(async (ctx, next) => {
        const commandData = await commandStatus.findOne({ botId });
        const filterStatus = commandData.isMessageFilterEnabled;

        if (filterStatus && ctx.updateType === 'message' && ctx.message.text) {
            const message = ctx.message.text.toLowerCase();
            if (prohibitedPattern.test(message)) {
                const userId = ctx.from.id;
                const fullName =
                    `${ctx.from.first_name || ''} ${ctx.from.last_name || ''}`.trim();
                bots[botId].telegram.restrictChatMember(ctx.chat.id, userId, {
                    until_date: Math.floor(Date.now() / 1000) + 300, // Mute for 5 mins seconds
                    can_send_messages: false,
                });
                bots[botId].telegram.sendMessage(
                    ctx.chat.id,
                    `${fullName}, you have been muted for using inappropriate language.`,
                );
            }
        }

        next();
    });

    // Kick User functionality
    bots[botId].command('kick', async (ctx) => {
        const commandData = await commandStatus.findOne({ botId });
        const kickStatus = commandData.isKickUserEnabled;
        // If command is off
        if (!kickStatus) {
            return ctx.reply('The kick feature is currently turned off.');
        }

        // Check if the command has a mentioned user
        if (
            !ctx.message.reply_to_message ||
            !ctx.message.reply_to_message.from
        ) {
            return ctx.reply(
                'Please reply to a message from the user you want to kick.',
            );
        }
        // Check if the user issuing the command is an administrator
        const isAdmin = await ctx.telegram
            .getChatMember(ctx.chat.id, ctx.from.id)
            .then(
                (member) =>
                    member.status === 'administrator' ||
                    member.status === 'creator',
            )
            .catch((error) => {
                console.error('Error checking admin status:', error);
                return false;
            });

        if (!isAdmin) {
            return ctx.reply(
                'You must be an administrator to use this command.',
            );
        }
        // Extract the user ID from the replied message
        const userId = ctx.message.reply_to_message.from.id;

        try {
            // Kick the user from the chat
            await ctx.telegram.kickChatMember(ctx.chat.id, userId);
            return ctx.reply(`User ${userId} has been kicked from the chat.`);
        } catch (error) {
            console.log(error);
            return ctx.reply('Failed to kick the user.');
        }
    });

    // Mute User command
    bots[botId].command('mute', async (ctx) => {
        const commandData = await commandStatus.findOne({ botId });
        const muteStatus = commandData.isMuteUserEnabled;

        // If command is off
        if (!muteStatus) {
            return ctx.reply('The mute feature is currently turned off.');
        }

        // Check if the command has a mentioned user
        if (
            !ctx.message.reply_to_message ||
            !ctx.message.reply_to_message.from
        ) {
            return ctx.reply(
                'Please reply to a message from the user you want to mute.',
            );
        }

        // Check if the user issuing the command is an administrator
        const isAdmin = await ctx.telegram
            .getChatMember(ctx.chat.id, ctx.from.id)
            .then(
                (member) =>
                    member.status === 'administrator' ||
                    member.status === 'creator',
            )
            .catch((error) => {
                console.error('Error checking admin status:', error);
                return false;
            });

        if (!isAdmin) {
            return ctx.reply(
                'You must be an administrator to use this command.',
            );
        }

        // Extract user ID from the replied message
        const userId = ctx.message.reply_to_message.from.id;

        // Check if the command has the correct format
        const args = ctx.message.text.split(' ');
        if (args.length !== 2) {
            return ctx.reply('Usage: /mute AMOUNT_OF_TIME');
        }

        // Extract duration from command arguments
        const durationInSeconds = parseInt(args[1], 10);

        // Validate user ID and duration
        if (Number.isNaN(durationInSeconds) || durationInSeconds <= 0) {
            return ctx.reply('Invalid duration.');
        }

        try {
            // Mute the user
            bots[botId].telegram.restrictChatMember(ctx.chat.id, userId, {
                until_date: Math.floor(Date.now() / 1000) + durationInSeconds, // Mute for set time
                can_send_messages: false,
                can_send_media_messages: false,
                can_send_other_messages: false,
                can_add_web_page_previews: false,
            });
            return ctx.reply(
                `User ${userId} muted for ${durationInSeconds} seconds.`,
            );
        } catch (error) {
            console.error('Error muting user:', error);
            return ctx.reply('Failed to mute user. Please try again later.');
        }
    });

    // Unmute User command
    bots[botId].command('unmute', async (ctx) => {
        const commandData = await commandStatus.findOne({ botId });
        const muteStatus = commandData.isMuteUserEnabled;

        // If command is off
        if (!muteStatus) {
            return ctx.reply('The mute feature is currently turned off.');
        }

        // Check if the user issuing the command is an administrator
        const isAdmin = await ctx.telegram
            .getChatMember(ctx.chat.id, ctx.from.id)
            .then(
                (member) =>
                    member.status === 'administrator' ||
                    member.status === 'creator',
            )
            .catch((error) => {
                console.error('Error checking admin status:', error);
                return false;
            });

        if (!isAdmin) {
            return ctx.reply(
                'You must be an administrator to use this command.',
            );
        }

        // Check if the command has a mentioned user
        if (
            !ctx.message.reply_to_message ||
            !ctx.message.reply_to_message.from
        ) {
            return ctx.reply(
                'Please reply to a message from the user you want to unmute.',
            );
        }

        // Extract user ID from the replied message
        const userId = ctx.message.reply_to_message.from.id;

        try {
            // Unmute the user
            bots[botId].telegram.restrictChatMember(ctx.chat.id, userId, {
                until_date: 0, // Unmute the user
                can_send_messages: true,
                can_send_media_messages: true,
                can_send_other_messages: true,
                can_add_web_page_previews: true,
            });
            return ctx.reply(`User ${userId} unmuted.`);
        } catch (error) {
            console.error('Error unmuting user:', error);
            return ctx.reply('Failed to unmute user. Please try again later.');
        }
    });

    // Send message to All groups command
    bots[botId].command('broadcast', async (ctx) => {
        const commandData = await commandStatus.findOne({ botId });
        const notifyAllStatus = commandData.isNotifyAllEnabled;

        if (!notifyAllStatus) {
            return ctx.reply('The Notify All feature is currently turned off.');
        }

        const message = ctx.message.text.split(' ').slice(1).join(' '); // Extract message from command
        if (!message) {
            return ctx.reply('Please provide a message to broadcast.');
        }

        // Find chats that bot is a member of
        const botDocument = await Bot.findById(botId);
        if (!botDocument) {
            console.log(`Bot with botId ${botId} not found.`);
        }
        const botChats = botDocument.botChats || [];

        // eslint-disable-next-line no-restricted-syntax
        for (const chat of botChats) {
            try {
                // Send message to each chat where the bot is a member
                // eslint-disable-next-line no-await-in-loop
                await bots[botId].telegram.sendMessage(chat.chatId, message);
            } catch (error) {
                // If 403 error, remove the chat from botChats array
                if (error.code === 403) {
                    console.error(
                        `Chat ${chat.chatId} denied access to bot ${botId}. Removing from botChats.`,
                    );
                    // eslint-disable-next-line no-await-in-loop
                    await Bot.findByIdAndUpdate(botId, {
                        $pull: { botChats: { chatId: chat.chatId } },
                    });
                } else {
                    console.error(
                        `Error sending message to chat ${chat.chatId}:`,
                        error.message,
                    );
                }
            }
        }

        return ctx.reply('Message broadcasted to all chats.');
    });

    await Bot.findByIdAndUpdate(botId, { botStatus: true });
};

export const launchBot = async (req, res) => {
    try {
        const { botId } = req.cookies;
        const { botToken } = req.body;

        startBot(botId, botToken);

        return res.status(200).json({ message: 'Bot Launched.' });
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error.' });
    }
};

export const initializeBots = async (token) => {
    try {
        const decodedToken = jwt.verify(token, process.env.TOKEN_KEY);

        // Extract user_id from the decoded token
        const ownerId = decodedToken.user_id;

        // Find all bots owned by the user
        const userBots = await Bot.find({ ownerId });

        // eslint-disable-next-line no-restricted-syntax
        for (const bot of userBots) {
            if (bot.botStatus) {
                // eslint-disable-next-line no-await-in-loop, no-underscore-dangle
                console.log(await startBot(bot._id, bot.botToken));
            }
        }

        return { message: 'Bots started successfully.' };
    } catch (error) {
        return { error: 'Internal server error.' };
    }
};

export const stopBot = async (req, res) => {
    try {
        const { botId } = req.cookies;

        // If bot is launched, stop it
        if (bots[botId]) {
            bots[botId].stop();
        }

        await Bot.findByIdAndUpdate(botId, { botStatus: false });

        return res.status(200).json({ message: 'Bot Stopped.' });
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error.' });
    }
};

export const messageFilter = async (req, res) => {
    try {
        const { isFilterEnabled } = req.body;
        const { botId } = req.cookies;

        // Update State of a command in database
        await commandStatus.findOneAndUpdate(
            { botId },
            { isMessageFilterEnabled: isFilterEnabled },
        );

        return res
            .status(200)
            .json({ message: `Filter is ${isFilterEnabled ? 'on' : 'off'}.` });
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error.' });
    }
};

export const kickUser = async (req, res) => {
    try {
        const { isKickUserEnabled } = req.body;
        const { botId } = req.cookies;

        // Update State of a command in database
        await commandStatus.findOneAndUpdate({ botId }, { isKickUserEnabled });

        return res.status(200).json({
            message: `Kick Command is ${isKickUserEnabled ? 'on' : 'off'}.`,
        });
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error.' });
    }
};

export const muteUser = async (req, res) => {
    try {
        const { isMuteUserEnabled } = req.body;
        const { botId } = req.cookies;

        // Update State of a command in database
        await commandStatus.findOneAndUpdate({ botId }, { isMuteUserEnabled });

        return res.status(200).json({
            message: `Mute Command is ${isMuteUserEnabled ? 'on' : 'off'}.`,
        });
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error.' });
    }
};

export const notifyAll = async (req, res) => {
    try {
        const { isNotifyAllEnabled } = req.body;
        const { botId } = req.cookies;

        // Update State of a command in database
        await commandStatus.findOneAndUpdate({ botId }, { isNotifyAllEnabled });

        return res.status(200).json({
            message: `Notify All Command is ${isNotifyAllEnabled ? 'on' : 'off'}.`,
        });
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error.' });
    }
};
