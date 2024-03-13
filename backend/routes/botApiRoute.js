import express from 'express';
import {
    connect,
    submitToken,
    testMethod,
} from '../controllers/botController.js';

const botApiRoute = express.Router();

botApiRoute.get('/connect', connect);
botApiRoute.get('/test', testMethod);
botApiRoute.post('/submitToken', submitToken);

export default botApiRoute;
