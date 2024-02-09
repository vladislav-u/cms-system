import jwt from 'jsonwebtoken';

export const generateToken = (_id) => {
    return jwt.sign({ user_id: _id }, process.env.TOKEN_KEY, {
        expiresIn: '24h',
    });
};
