import mongoose from 'mongoose';

const commandStatusSchema = new mongoose.Schema({
    botId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bot',
        required: true,
    },
    isMessageFilterEnabled: {
        type: Boolean,
        required: true,
        default: false,
    },
    isKickUserEnabled: {
        type: Boolean,
        required: true,
        default: false,
    },
    isMuteUserEnabled: {
        type: Boolean,
        required: true,
        default: false,
    },
    isNotifyAllEnabled: {
        type: Boolean,
        required: true,
        default: false,
    },
});

const commandStatus = mongoose.model('commandStatus', commandStatusSchema);
export default commandStatus;
