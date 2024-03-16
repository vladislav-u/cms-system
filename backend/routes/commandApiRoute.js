import express from 'express';
import { launchBot, stopBot } from '../controllers/commandController.js';

const commandApiRoute = express.Router();

commandApiRoute.post('/launchBot', launchBot);
commandApiRoute.post('/stopBot', stopBot);

export default commandApiRoute;
