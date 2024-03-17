import express from 'express';
import {
    launchBot,
    messageFilter,
    stopBot,
} from '../controllers/commandController.js';

const commandApiRoute = express.Router();

commandApiRoute.post('/launchBot', launchBot);
commandApiRoute.post('/stopBot', stopBot);
commandApiRoute.post('/messageFilter', messageFilter);

export default commandApiRoute;
