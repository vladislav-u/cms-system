import jwt from 'jsonwebtoken';

const generateToken = (_id) =>
    jwt.sign({ user_id: _id }, process.env.TOKEN_KEY, {
        expiresIn: '24h',
    });

export default generateToken;
