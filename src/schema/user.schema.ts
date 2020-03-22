import * as mongoose from 'mongoose';
import * as crypto from 'crypto';

const d = new Date();
const _UserSchema = new mongoose.Schema({
  nickName: {
    type: String,
  },
  gender: {
    type: String,
    default: 'male',
    enum: ['male', 'female']
  },
  username: {
    type: String,
  },
  password: {
    type: String,
    select: false // 查询的时候，不显示此字段
  },
  email: {
    type: String,
  },
  mobile: {
    type: Number,
  },
  avatarUrl: {
    type: String,
  },
  registerTime: {
    type: Number,
    default: d.getTime(),
  },
  salt: {
    type: String,
    select: false // 查询的时候，不显示此字段
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