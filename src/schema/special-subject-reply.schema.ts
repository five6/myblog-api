import * as mongoose from 'mongoose';

const d = new Date();
export const specialSubjectReplySchema = new mongoose.Schema({
    special_subject_topic_id: {
        type: mongoose.Types.ObjectId, 
        ref: 'SpecialSubjectTopic',
        required: true
    },
    content: String,
    from_uid: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    to_uid: {
        type: mongoose.Types.ObjectId, 
        ref: 'User',
        required: true
    },
    parent_reply_id: {
        type: mongoose.Types.ObjectId
    },
    reply_level: {
        type: Number,
        required: true,
        default: 1, //  回复文章作为1级评论，其余都是2级评论
    },
    like_num: {
        type: Number,
        default: 0
    },
    dislike_num: {
        type: Number,
        default: 0
    },
    put_top: {
        type: Boolean,
        default: false
    }, // 是否置顶
    createTime: { type: Number, default: d.getTime() },
    isDeleted: {
        type: Boolean,
        required: true,
        default: false,
        select: false
    },
});
