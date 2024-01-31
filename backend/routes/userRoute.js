import express from 'express';
import { signIn, signUp } from '../controllers/signController.js';

const userRoute = express.Router();

userRoute.post('/login', signIn);
userRoute.post('/register', signUp);

export default userRoute;
