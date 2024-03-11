import express from 'express';
import { logOut, signIn, signUp } from '../controllers/signController.js';

const userRoute = express.Router();

userRoute.post('/login', signIn);
userRoute.post('/register', signUp);
userRoute.post('/logout', logOut);

export default userRoute;
