import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import * as dotenv from 'dotenv';
import express from 'express';
import verifyToken from './middlewares/authMiddleware.js';
import botApiRoute from './routes/botApiRoute.js';
import commandApiRoute from './routes/commandApiRoute.js';
import userRoute from './routes/userRoute.js';
import connectToDatabase from './services/dbService.js';

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
connectToDatabase();

app.use(express.json());

app.use('/', userRoute);
app.use('/api', botApiRoute);
app.use('/api/command', commandApiRoute);

app.get('/api/verify-token', verifyToken, (req, res) => {
    res.status(200).json({
        message: 'Token verified successfully.',
        user: req.user,
    });
});

app.listen(process.env.PORT, () => {
    console.log(`Server is running at http://localhost:${process.env.PORT}`);
});
