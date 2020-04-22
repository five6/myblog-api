import * as mongoose from 'mongoose';

/**
 * 专题
 */
const d = new Date();
export const SpecailSubjectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        maxlength:50,
    },
    title_image: {
        type: String,
        required: false
    },
    content: {
        type: String,
        required: true
    },
    from_uid: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createTime: { type: Number, default: d.getTime() },
    isDeleted: {
        type: Boolean,
        required: true,
        default: false,
        select: false
    }
});
