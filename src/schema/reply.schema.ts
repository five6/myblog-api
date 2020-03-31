import * as mongoose from 'mongoose';

export const ReplySchema = new mongoose.Schema({
    reply_id: String,
    reply_type: String,
    content: String,
    from_uid: String,
    to_uid: String,
    parent_reply_id: String,
    reply_level: {
        type: Number,
        required: true,
        default: 1, //  回复文章作为一级评论，其余都是🎧评论
    },
    like_num: Number, // 点赞数量
    put_top: Boolean, // 是否置顶
    isDeleted: {
        type: Boolean,
        required: true,
        default: false
    },
});
