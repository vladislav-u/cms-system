import connectToBot from '../services/botService.js';

let bot;

export const connect = async (req, res) => {
    try {
        bot = connectToBot(process.env.BOT_TOKEN);
        bot.launch();
        res.status(200).json({ message: 'Success' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error.' });
    }
};

export const testMethod = async (req, res) => {
    try {
        bot.start((ctx) => ctx.reply('Welcome'));
        res.status(200).json({ message: 'Success' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error.' });
    }
};
