import * as mongoose from 'mongoose';

const d = new Date();
/**
 * topic推荐schema
 */
export const SpecialSubjectTopicUpvoteSchema = new mongoose.Schema({
  topic_id: {
    type: mongoose.Types.ObjectId, 
    ref: 'Topic'
  },
  from_uid: {
    type: mongoose.Types.ObjectId, 
    ref: 'User'
  },
  status: {
    // 1 推荐， 0 取消推荐
    type: Number,
    default: 1, 
  },
  createTime: { type: Number, default: d.getTime() },
});
