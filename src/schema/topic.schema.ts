import * as mongoose from 'mongoose';
import { TopicTypeEnum } from '../config/enum/TopicTypeEnum';

const d = new Date();
export const TopicSchema = new mongoose.Schema({
    __v: { type: Number, select: false },
    title: {
        type: String,
        required: true
    },
    topic_type: {
        type: String,
        default: TopicTypeEnum.NORMAL,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    put_top: {
        type: Boolean,
        default: false,
    },
    from_uid: {
        type: String,
        required: true
    },
    isDeleted: {
        type: Boolean,
        required: true,
        default: false
    }
});
