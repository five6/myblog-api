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
            const topicArray = await Promise.all([
              this.topicModel.find(json).skip(skip).limit(pagination.pageSize).populate('from_uid').lean(),
              this.topicModel.countDocuments(json).lean(),
            ]);
            const topicItems = _.map(topicArray[0], topicItem => {
              topicItem.author = {};
              if(topicItem.from_uid && topicItem.from_uid.length) {
                topicItem.author = _.pick(topicItem.from_uid[0], ['username', 'nickName', 'gender', 'avatarUrl', 'useDefaultAvatarUrl', 'registerTime'])
              }
              delete topicItem.from_uid;
              return topicItem;
            })
            return [topicItems, topicArray[1]];
          } catch (error) {
            this.logger.error(error);
            return [[], 0];
          }
    }

    async findOne(id: String) {
      try {
        let results = await Promise.all([
          this.topicModel.findById(id).lean(),
          this.replyModel.find({reply_id: id }, '_id,').skip(0).limit(50).lean(),
        ]);
        let topicData = results[0];
        if(!topicData) {
          throw new NotFoundException('该文章不存在！');
        }
        const user = await this.userModel.findById(topicData.from_uid).lean();
        topicData.author = _.pick(user, ['nickName', 'username', 'avatarUrl', 'registerTime', 'useDefaultAvatarUrl']);
        topicData.replies = !results[1];
        return topicData;
      } catch(error) {
        this.logger.error(error);
        return null;
      }
    }

    async findUserTopic(json: Topic, fields: string = '', pagination: Pagination) {
      try {
          const skip = (pagination.currentPage - 1) * pagination.pageSize;
          return await Promise.all([
            this.topicModel.find(json).skip(skip).limit(pagination.pageSize).lean(),
            this.topicModel.countDocuments(json).lean(),
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
      const topic = await this.topicModel.findById(id).lean();
      if(! topic || topic.isDeleted) {
        throw new NotFoundException('当前删除的文章不存在');
      } else if(topic.from_uid !== user.id) {
        throw new ForbiddenException('您无权执行删除操作');
      } else
      return await this.topicModel.updateOne({ _id: id }, { $set: { isDeleted: true } });
    }
}
