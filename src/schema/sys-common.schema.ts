import * as mongoose from 'mongoose';
import { SysCommonTypEnum } from '../config/enum/SysCommonTypEnum';

const d = new Date();
export const SysCommonSchema = new mongoose.Schema({
  type: { type: String },
  title: { type: String },
  images: { type: Array },
  content: { type: String },
  externalLinkAddress: { type: String },
  createTime: { type: Number, default: d.getTime() },
  updateTime: { type: Number }
});
