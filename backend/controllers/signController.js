import bcrypt from 'bcrypt';
import cookie from 'cookie';
import { User } from '../models/userModel.js';
import { generateToken } from '../services/authService.js';

export const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (user && (await bcrypt.compareSync(password, user.password))) {
            user.token = generateToken(user._id);
            res.cookie('token', user.token, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000,
            });

            res.status(200).json({
                message: 'Signed in successfully.',
            });
        } else {
            res.status(400).json({
                error: 'Email or password is incorrect.',
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

export const signUp = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = {
            name,
            email,
            password: hashedPassword,
        };

        const user = await User.create(newUser);
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
