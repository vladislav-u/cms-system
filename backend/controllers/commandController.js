import { Telegraf } from 'telegraf';

let bot = null;

export const launchBot = async (req, res) => {
    try {
        if (bot) {
            bot.stop();
        }

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
        if (bot) {
            bot.stop();
        }

        return res.status(200).json({ message: 'Bot Stopped.' });
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error.' });
    }
};
