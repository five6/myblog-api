import * as mongoose from 'mongoose';
import { TopicTypeEnum } from 'src/config/enum/TopicTypeEnum';

const d = new Date();
export const TopicSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    topic_type: {
        type: String,
        default: TopicTypeEnum.NORMAL,
    },
    content: {
        type: String,
    },
    put_top: {
        type: Boolean,
        default: 0,
    },
    from_uid: {
        type: String,
    },
});
