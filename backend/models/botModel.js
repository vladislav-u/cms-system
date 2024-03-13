import mongoose from 'mongoose';

const botSchema = new mongoose.Schema({
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    botToken: {
        type: String,
        required: true,
    },
});

const Bot = mongoose.model('Bot', botSchema);
export default Bot;
