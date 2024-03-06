import { Telegraf } from 'telegraf';

const connectToBot = (botToken) => new Telegraf(botToken);
export default connectToBot;
