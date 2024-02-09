import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import * as dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import userRoute from './routes/userRoute.js';

dotenv.config();
const app = express();

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
    cors({
        credentials: true,
        origin: 'http://localhost:3000',
    }),
);
// Database Connection
try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
} catch (e) {
    console.log('Connection to MongoDB failed', e);
}
const db = mongoose.connection;
app.use(express.json());

app.use('/', userRoute);

app.listen(process.env.PORT, () => {
    console.log(`Server is running at http://localhost:${process.env.PORT}`);
});
