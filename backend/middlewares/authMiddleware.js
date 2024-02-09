import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    //GET TOKEN
    const token = req.cookies.token;
    // If token does not exist
    if (!token) {
        return res
            .status(403)
            .send({ message: 'Token required for authentication.' });
    }
    //If token exist
    try {
        req.user = jwt.verify(token, process.env.TOKEN_KEY);
    } catch (e) {
        return res.status(401).send({ message: 'Invalid token.' });
    }

    return next();
};
