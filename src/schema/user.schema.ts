import * as mongoose from 'mongoose';
const { Schema } = mongoose;
import * as crypto from 'crypto';
import { UserTypeEnum } from '../config/enum/UserTypeEnum';

const d = new Date();
const _UserSchema = new mongoose.Schema({
  __v: { type: Number, select: false },
  nickName: { type: String, default: '未设置昵称' },
  gender: { type: String, default: 'male',enum: ['male', 'female']},
  username: {type: String, required: true, unique:true, minlength: 6, maxlength: 20},
  password: { type: String, required: true, minlength: 6},
  email: { type: String, required: true, unique: true},
  // mobile: { type: Number, unique: true},
  avatarUrl: { type: String },
  useDefaultAvatarUrl: { type: Boolean, default: true },
  registerTime: { type: Number, default: d.getTime() },
  unValidateEmail: { type: Boolean, default: true },
  unValidateEmailToken: { type: String, },
  salt: { type: String },
  /** TODO: 后期加入组织 */
  user_type: {type: UserTypeEnum, default: UserTypeEnum.people},
  // TODO: 组织表后面创建
  organization_id: {type: String},
  following: {
    type: [{ type: mongoose.Types.ObjectId, ref: 'User'}],
    select: false,
  },
  followingTopics: {
    type: [{ type: mongoose.Types.ObjectId, ref: 'Topic'}],
    select: false,
  },
  likingAnswers: {
    type: [{ type: mongoose.Types.ObjectId, ref: 'Reply'}],
    select: false,
  },
  dislikingAnswers: {
    type: [{ type: mongoose.Types.ObjectId, ref: 'Reply'}],
    select: false,
  },
  collectingAnswers: {
    type: [{ type: mongoose.Types.ObjectId, ref: 'Reply'}],
    select: false,
  },
  locked: {
    type: Boolean,
    required: true,
    default: false,
    select: false
  }
});

_UserSchema.index({ username: -1, email: -1, mobile: 1 });


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