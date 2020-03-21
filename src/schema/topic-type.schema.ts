import * as mongoose from 'mongoose';
import { TopicTypeEnum } from 'src/config/enum/TopicTypeEnum';

const d = new Date();
export const TopicTypeSchema = new mongoose.Schema({

  name: {
    type: TopicTypeEnum,
  },
});
