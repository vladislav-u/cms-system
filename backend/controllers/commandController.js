import { Telegraf } from 'telegraf';
import bot from '../models/botModel.js';
import commandStatus from '../models/commandStatusModel.js';

const bots = {};

export const launchBot = async (req, res) => {
    try {
        const { botId } = req.cookies;

        // If bot is launched, stop it
        if (bots[botId]) {
            bots[botId].stop();
        }

        // Launch bot
        const { botToken } = req.body;
        bots[botId] = new Telegraf(botToken);
        bots[botId].start((ctx) => ctx.reply('Welcome'));
        bots[botId].launch();

        await bot.findByIdAndUpdate(botId, { botStatus: true });

        return res.status(200).json({ message: 'Bot Launched.' });
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error.' });
    }
};

export const stopBot = async (req, res) => {
    try {
        const { botId } = req.cookies;

        // If bot is launched, stop it
        if (bots[botId]) {
            bots[botId].stop();
        }

        await bot.findByIdAndUpdate(botId, { botStatus: false });

        return res.status(200).json({ message: 'Bot Stopped.' });
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error.' });
    }
};

const prohibitedWords = ['word1', 'word2', 'word3'];
const prohibitedPattern = new RegExp(prohibitedWords.join('|'), 'i');

export const messageFilter = async (req, res) => {
    try {
        const { isFilterEnabled } = req.body;
        const { botId } = req.cookies;

        // Update State of a command in database
        await commandStatus.findOneAndUpdate(
            { botId },
            { isMessageFilterEnabled: isFilterEnabled },
        );

        bots[botId].use(async (ctx, next) => {
            const commandData = await commandStatus.findOne({ botId });
            const filterStatus = commandData.isMessageFilterEnabled;

            if (
                filterStatus &&
                ctx.updateType === 'message' &&
                ctx.message.text
            ) {
                const message = ctx.message.text.toLowerCase();
                if (prohibitedPattern.test(message)) {
                    const userId = ctx.from.id;
                    const fullName =
                        `${ctx.from.first_name || ''} ${ctx.from.last_name || ''}`.trim();
                    bots[botId].telegram.restrictChatMember(
                        ctx.chat.id,
                        userId,
                        {
                            until_date: Math.floor(Date.now() / 1000) + 300, // Mute for 5 mins seconds
                            can_send_messages: false,
                        },
                    );
                    bots[botId].telegram.sendMessage(
                        ctx.chat.id,
                        `${fullName}, you have been muted for using inappropriate language.`,
                    );
                }
            }

            next();
        });

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
                .then((member) => member.status === 'administrator')
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
                return ctx.reply(
                    `User ${userId} has been kicked from the chat.`,
                );
            } catch (error) {
                return ctx.reply('Failed to kick the user.');
            }
        });

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
                    until_date:
                        Math.floor(Date.now() / 1000) + durationInSeconds, // Mute for set time
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
                return ctx.reply(
                    'Failed to mute user. Please try again later.',
                );
            }
        });

        // Command to unmute a user
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
                return ctx.reply(
                    'Failed to unmute user. Please try again later.',
                );
            }
        });

        return res.status(200).json({
            message: `Mute Command is ${isMuteUserEnabled ? 'on' : 'off'}.`,
        });
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error.' });
    }
};
