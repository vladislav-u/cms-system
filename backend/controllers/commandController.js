import { Telegraf } from 'telegraf';
import commandStatus from '../models/commandStatusModel.js';

let bot = null;

export const launchBot = async (req, res) => {
    try {
        // If bot is launched, stop it
        if (bot) {
            bot.stop();
        }

        // Launch bot
        const { botToken } = req.body;
        bot = new Telegraf(botToken);
        bot.start((ctx) => ctx.reply('Welcome'));
        bot.launch();

        return res.status(200).json({ message: 'Bot Launched.' });
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error.' });
    }
};

export const stopBot = async (req, res) => {
    try {
        // If bot is launched, stop it
        if (bot) {
            bot.stop();
        }

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

        bot.use((ctx, next) => {
            if (
                isFilterEnabled &&
                ctx.updateType === 'message' &&
                ctx.message.text
            ) {
                const message = ctx.message.text.toLowerCase();
                if (prohibitedPattern.test(message)) {
                    const userId = ctx.from.id;
                    const fullName =
                        `${ctx.from.first_name || ''} ${ctx.from.last_name || ''}`.trim();
                    bot.telegram.restrictChatMember(ctx.chat.id, userId, {
                        until_date: Math.floor(Date.now() / 1000) + 10, // Mute for 10 seconds
                        can_send_messages: false,
                    });
                    bot.telegram.sendMessage(
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
