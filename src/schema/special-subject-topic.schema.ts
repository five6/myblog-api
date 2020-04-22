import * as mongoose from 'mongoose';
import { TopicTypeEnum } from '../config/enum/TopicTypeEnum';
import { TopicLevelEnum } from '../config/enum/TopicLevelEnum';


/**
 * 专题的文章
 */
const d = new Date();
export const SpecailSubjectTopicSchema = new mongoose.Schema({
    special_subject_id: {
        type: mongoose.Types.ObjectId,
        ref: 'SpecialSubject',
        required: true
    },
    sub_special_subject_id: {
        type: mongoose.Types.ObjectId,
        ref: 'SubSpecialSubject',
        required: true
    },
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
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
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
