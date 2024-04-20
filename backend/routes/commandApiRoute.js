import express from 'express';
import {
    kickUser,
    launchBot,
    messageFilter,
    muteUser,
    notifyAll,
    stopBot,
} from '../controllers/commandController.js';

const commandApiRoute = express.Router();

commandApiRoute.post('/launchBot', launchBot);
commandApiRoute.post('/stopBot', stopBot);
commandApiRoute.post('/messageFilter', messageFilter);
commandApiRoute.post('/kickUser', kickUser);
commandApiRoute.post('/muteUser', muteUser);
commandApiRoute.post('/notifyAll', notifyAll);

export default commandApiRoute;
