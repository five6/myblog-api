import { Injectable, Logger, Req, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ResultPagination } from '../../config/result-beans/ResultPagination';
import {Topic} from '../../interface/topic.interface';
import { Pagination } from '../../config/result-beans/Pagination';
import { TopicDto } from 'src/dto/topic.dto';
import * as _ from 'lodash';
import * as mongoose from 'mongoose';

@Injectable()
export class TopicService {
    logger = new Logger();
    constructor(
      @InjectModel('Topic') private readonly topicModel,
      @InjectModel('Reply') private readonly replyModel,
      @InjectModel('User') private readonly userModel
      ) {}

    async find(json: Topic, fields: string = '', pagination: Pagination) {
        try {
            const skip = (pagination.currentPage - 1) * pagination.pageSize;
            return await Promise.all([
              this.topicModel.find(json).skip(skip).limit(pagination.pageSize).exec(),
              this.topicModel.countDocuments(json).exec(),
            ]);
          } catch (error) {
            this.logger.error(error);
            return [[], 0];
          }
    }

    async findOne(id: String) {
      let results = await Promise.all([
        this.topicModel.findById(id).exec(),
        this.replyModel.find({reply_id: id }, '_id,').skip(0).limit(50).exec(),
      ]);
      if(! results[0]) {
        return null;
      }
      let topicData = results[0].toJSON();
      const user = await this.userModel.findById(topicData.from_uid).exec();
      topicData.author = _.pick(user.toJSON(), ['nickName', 'username', 'avatarUrl', 'registerTime', 'useDefaultAvatarUrl']);
      topicData.replies = !results[1] || results.length  ?  []: results[1].toJSON();
      return topicData;
    }

    async findUserTopic(json: Topic, fields: string = '', pagination: Pagination) {
      try {
          const skip = (pagination.currentPage - 1) * pagination.pageSize;
          return await Promise.all([
            this.topicModel.find(json).skip(skip).limit(pagination.pageSize).exec(),
            this.topicModel.countDocuments(json).exec(),
          ]);
        } catch (error) {
          this.logger.error(error);
          return [[], 0];
        }
    }
    /**
     * 创建主题
     * @param topicDto 
     */
    async create(topicDto: TopicDto) {
        const model = this.topicModel(topicDto)
        return await model.save();
    }

    async update(topicDto: TopicDto) {
      return await this.topicModel.updateOne({ _id: topicDto._id }, { $set: topicDto });
    
    
    }

    async delete(id: string, user) {
      const topic = await this.topicModel.findById(id).exec();
      if(! topic || topic.isDeleted) {
        throw new NotFoundException('当前删除的文章不存在');
      } else if(topic.from_uid !== user.id) {
        throw new ForbiddenException('您无权执行删除操作');
      } else
      return await this.topicModel.updateOne({ _id: id }, { $set: { isDeleted: true } });
    }
}
