import mongoose from 'mongoose';

const botSchema = new mongoose.Schema({
    botName: {
        type: String,
        required: true,
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    botToken: {
        type: String,
        required: true,
    },
    botStatus: {
        type: Boolean,
        required: true,
        default: false,
    },
    botChats: [
        {
            chatId: {
                type: String,
                required: true,
            },
            chatType: {
                type: String,
                enum: ['private', 'group', 'supergroup', 'channel'],
                required: true,
            },
        },
    ],
});

const Bot = mongoose.model('Bot', botSchema);
export default Bot;
