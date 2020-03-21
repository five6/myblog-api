import * as mongoose from 'mongoose';

const d = new Date();
export const UserSchema = new mongoose.Schema({
  nickName: {
    type: String,
  },
  gender: {
    type: Number,
    default: 1,
  },
  language: {
    type: String,
  },
  city: {
    type: String,
  },
  province: {
    type: String,
  },
  country: {
    type: String,
  },
  mobile: {
    type: Number,
  },
  avatarUrl: {
    type: String,
  },
  ctime: {
    type: Number,
    default: d.getTime(),
  },
});
