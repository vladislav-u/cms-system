import jwt from 'jsonwebtoken';
import Bot from '../models/botModel.js';
import commandStatus from '../models/commandStatusModel.js';

// Submit a bot token and write a new bot to database
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

        // Make commandStatus Model for this bot
        const bot = await Bot.findOne({ botToken });
        const newCommandStatus = {
            // eslint-disable-next-line no-underscore-dangle
            botId: bot._id,
        };
        await commandStatus.create(newCommandStatus);

        return res.status(201).json({ message: 'Bot added successfully.' });
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error.' });
    }
};

// Get all bots from database
export const getBots = async (req, res) => {
    try {
        const allBots = await Bot.find();

        return res.status(200).json(allBots);
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error.' });
    }
};

// Delete bot and info about its commands from database
export const deleteBot = async (req, res) => {
    try {
        const botId = req.params.id;

        const botIdFromCookies = req.cookies.botId;
        if (botId === botIdFromCookies) {
            res.clearCookie('botId');
        }

        await Bot.findByIdAndDelete(botId);
        await commandStatus.deleteMany({ botId });
        const allBots = await Bot.find();

        return res.status(200).json(allBots);
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error.' });
    }
};

// Save bot ID to cookies
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

// Get info about selected bot
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

// Get info about commands for selected bot
export const getCommandsData = async (req, res) => {
    try {
        const botId = req.params.id;

        const commandsData = await commandStatus.find({ botId });

        if (commandsData) {
            return res.status(200).json({ commandsData });
        }

        return res
            .status(404)
            .json({ error: 'No commands data found for the botId.' });
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error.' });
    }
};
