import * as mongoose from 'mongoose';
const { Schema } = mongoose;
import * as crypto from 'crypto';
import { UserTypeEnum } from '../config/enum/UserTypeEnum';

const d = new Date();
const _UserSchema = new mongoose.Schema({
  __v: { type: Number, select: false },
  nickName: { type: String, default: '昵称未设置，去设置一个喜欢的网名吧' },
  gender: { type: String, default: 'male',enum: ['male', 'female']},
  username: {type: String, required: true, unique:true, minlength: 6, maxlength: 20},
  password: { type: String, required: true, minlength: 6},
  email: { type: String, required: true},
  mobile: { type: Number},
  avatarUrl: { type: String },
  registerTime: { type: Number, default: d.getTime() },
  salt: { type: String },
  /** TODO 后期加入组织 */
  user_type: {type: UserTypeEnum, default: UserTypeEnum.people},
  // 组织id
  organization_id: {type: String},
  following: {
    type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    select: false,
  },
  followingTopics: {
    type: [{ type: Schema.Types.ObjectId, ref: 'Topic' }],
    select: false,
  },
  likingAnswers: {
    type: [{ type: Schema.Types.ObjectId, ref: 'Reply' }],
    select: false,
  },
  dislikingAnswers: {
    type: [{ type: Schema.Types.ObjectId, ref: 'Reply' }],
    select: false,
  },
  collectingAnswers: {
    type: [{ type: Schema.Types.ObjectId, ref: 'Reply' }],
    select: false,
  },
  forbidden: {
    type: Boolean,
    required: true,
    default: false
}
});

_UserSchema.methods = {
  authenticate(password) {
    return this.encryptPassword(password) === this.password;
  },
  makeSalt() {
    return Date.now();
  },
  encryptPassword(password) {
    if (!password) return '';
    try {
      return crypto
        .createHmac('sha1', this.salt)
        .update(password)
        .digest('hex');
    } catch (err) {
      return '';
    }
  },
};

export const UserSchema = _UserSchema;