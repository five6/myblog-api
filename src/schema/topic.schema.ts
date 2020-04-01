import * as mongoose from 'mongoose';
import { TopicTypeEnum } from '../config/enum/TopicTypeEnum';
import { TopicLevelEnum } from '../config/enum/TopicLevelEnum';


const d = new Date();
export const TopicSchema = new mongoose.Schema({
    __v: { type: Number, select: false },
    title: {
        type: String,
        required: true,
        maxlength:50,
    },
    title_image: {
        type: String,
        required: false
    },
    type: {
        type: TopicTypeEnum,
        default: TopicTypeEnum.share,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    level: {
        type: TopicLevelEnum,
        default: TopicLevelEnum.public,
        required: true
    },
    put_top: {
        type: Boolean,
        default: false,
    },
    from_uid: {
        type: [{ type: mongoose.Types.ObjectId, ref: 'User'}],
        required: true
    },
    like_num: {
        type: Number,
        default: 0
    }, 
    createTime: { type: Number, default: d.getTime() },
    lastUpdateTime: { type: Number, default: d.getTime() },
    isDeleted: {
        type: Boolean,
        required: true,
        default: false,
        select: false
    }
});
