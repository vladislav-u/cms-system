import express from 'express';
import {
    connect,
    deleteBot,
    getBotData,
    getBots,
    saveToCookies,
    submitToken,
    testMethod,
} from '../controllers/botController.js';

const botApiRoute = express.Router();

botApiRoute.get('/connect', connect);
botApiRoute.get('/test', testMethod);
botApiRoute.get('/getBots', getBots);
botApiRoute.post('/submitToken', submitToken);
botApiRoute.get('/getBotData/:id', getBotData);
botApiRoute.post('/saveToCookies', saveToCookies);
botApiRoute.delete('/deleteBot/:id', deleteBot);

export default botApiRoute;
