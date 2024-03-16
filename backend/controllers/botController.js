import jwt from 'jsonwebtoken';
import Bot from '../models/botModel.js';
import connectToBot from '../services/botService.js';

export const submitToken = async (req, res) => {
    try {
        const { botToken, botName } = req.body;

        const botExists = await Bot.findOne({ botToken });
        if (botExists) {
            return res.status(400).json({ error: 'Bot already exists' });
        }

        const jwtToken = req.cookies.token;
        const decodedToken = jwt.verify(jwtToken, process.env.TOKEN_KEY);
        const userId = decodedToken.user_id;

        const newBot = {
            botName,
            ownerId: userId,
            botToken,
        };

        await Bot.create(newBot);
        return res.status(201).json({ message: 'Bot added successfully.' });
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error.' });
    }
};

export const getBots = async (req, res) => {
    try {
        const allBots = await Bot.find();

        return res.status(200).json(allBots);
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error.' });
    }
};

export const deleteBot = async (req, res) => {
    try {
        const botId = req.params.id;

        const botIdFromCookies = req.cookies.botId;
        if (botId === botIdFromCookies) {
            res.clearCookie('botId');
        }

        await Bot.findByIdAndDelete(botId);
        const allBots = await Bot.find();

        return res.status(200).json(allBots);
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error.' });
    }
};

export const saveToCookies = async (req, res) => {
    try {
        const { botId } = req.body;

        res.cookie('botId', botId, {
            httpOnly: false,
            maxAge: 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({ message: 'Bot Id saved successfully.' });
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error.' });
    }
};

export const getBotData = async (req, res) => {
    try {
        const { id } = req.params;
        const bot = await Bot.findById(id);
        if (!bot) {
            return res.status(404).json({ error: 'Bot not found' });
        }

        return res.status(200).json(bot);
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
