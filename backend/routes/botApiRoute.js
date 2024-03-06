import express from 'express';
import { connect, testMethod } from '../controllers/botController.js';

const botApiRoute = express.Router();

botApiRoute.get('/api/connect', connect);
botApiRoute.get('/api/test', testMethod);

export default botApiRoute;
