import * as mongoose from 'mongoose';

/**
 * 子专题
 */
const d = new Date();
export const SubeSpecailSubjectSchema = new mongoose.Schema({
    special_subject_id: {
        type: mongoose.Types.ObjectId,
        ref: 'SpecialSubject',
        required: true
    },
    title: {
        type: String,
        required: true,
        maxlength:50,
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
