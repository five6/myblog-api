import * as mongoose from 'mongoose';
const { Schema } = mongoose;
import * as crypto from 'crypto';

const d = new Date();
const _UserSchema = new mongoose.Schema({
  __v: { type: Number, select: false },
  nickName: { type: String },
  gender: { type: String, default: 'male',enum: ['male', 'female']},
  username: {type: String},
  password: { type: String },
  email: { type: String },
  mobile: { type: Number },
  avatarUrl: { type: String },
  registerTime: { type: Number, default: d.getTime() },
  salt: { type: String },
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