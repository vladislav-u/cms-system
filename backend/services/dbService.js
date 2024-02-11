import mongoose from 'mongoose';

const connectToDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        console.info(`Connected to database on Worker process: ${process.pid}`);
    } catch (error) {
        console.error(
            `Connection error: ${error.stack} on Worker process: ${process.pid}`,
        );
    }
};
export default connectToDatabase;
