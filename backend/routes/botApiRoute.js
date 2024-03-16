import express from 'express';
import {
    deleteBot,
    getBotData,
    getBots,
    saveToCookies,
    submitToken,
} from '../controllers/botController.js';

const botApiRoute = express.Router();

botApiRoute.get('/getBots', getBots);
botApiRoute.post('/submitToken', submitToken);
botApiRoute.get('/getBotData/:id', getBotData);
botApiRoute.post('/saveToCookies', saveToCookies);
botApiRoute.delete('/deleteBot/:id', deleteBot);

export default botApiRoute;
