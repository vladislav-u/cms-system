import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import * as dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import userRoute from './routes/userRoute.js';

dotenv.config();
const app = express();
const port = 8080;

// For CORS
app.all('/*', function (req, res, next) {
    res.header('access-control-allow-origin', '*');
    res.header(
        'access-control-allow-headers',
        'x-requested-with, content-type',
    );
    res.header('access-control-allow-methods', 'get, post', 'put');
    next();
});
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
    cors({
        credentials: true,
        origin: [
            'http://localhost:3000/register',
            'http://localhost:3000/login',
        ],
    }),
);

// Database Connection
try {
    await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
} catch (e) {
    console.log('Connection to MongoDB failed', e);
}
const db = mongoose.connection;
app.use(express.json());

app.use('/', userRoute);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
