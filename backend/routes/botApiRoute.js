import express from 'express';
import {
    connect,
    deleteBot,
    getBots,
    submitToken,
    testMethod,
} from '../controllers/botController.js';

const botApiRoute = express.Router();

botApiRoute.get('/connect', connect);
botApiRoute.get('/test', testMethod);
botApiRoute.get('/getBots', getBots);
botApiRoute.post('/submitToken', submitToken);
botApiRoute.delete('/deleteBot/:id', deleteBot);

export default botApiRoute;
