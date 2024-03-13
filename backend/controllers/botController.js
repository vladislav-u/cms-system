import jwt from 'jsonwebtoken';
import Bot from '../models/botModel.js';
import connectToBot from '../services/botService.js';

export const submitToken = async (req, res) => {
    try {
        const { token } = req.body;

        const botExists = await Bot.findOne({ botToken: token });
        if (botExists) {
            return res.status(400).json({ error: 'Bot already exists' });
        }

        const jwtToken = req.cookies.token;
        const decodedToken = jwt.verify(jwtToken, process.env.TOKEN_KEY);
        const userId = decodedToken.user_id;

        const newBot = {
            ownerId: userId,
            botToken: token,
        };

        await Bot.create(newBot);
        return res.status(201).json({ message: 'Bot added successfully.' });
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error.' });
    }
};

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
