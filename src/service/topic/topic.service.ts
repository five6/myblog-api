import { Injectable, Logger, Req, ForbiddenException, NotFoundException, NotAcceptableException } from '@nestjs/common';
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
      // 统一populate的字段
      pickedUserParams = ['nickName', 'username', 'avatarUrl', 'registerTime', 'useDefaultAvatarUrl'];

    async find(json: Topic, fields: string = '', pagination: Pagination) {
        try {
            const skip = (pagination.currentPage - 1) * pagination.pageSize;
            const topicArray = await Promise.all([
              this.topicModel.find(json, fields).skip(skip).limit(pagination.pageSize).populate('from_uid', this.pickedUserParams).lean(),
              this.topicModel.countDocuments(json).lean(),
            ]);
            return [topicArray[0], topicArray[1]];
          } catch (error) {
            this.logger.error(error);
            return [[], 0];
          }
    }

    async findOne(id: String) {
      try {
        let topicData = await this.topicModel.findById(id).populate('from_uid', this.pickedUserParams).lean();
        if(!topicData) {
          throw new NotFoundException('该文章不存在！');
        }
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

    /**
     * 添加喜欢
     */
    async putUpvoteCount(id: string, type: string, user) {
      const topic = await this.topicModel.findById(id).lean();
      if(! topic || topic.isDeleted) {
        throw new NotFoundException('当前删除的文章不存在');
      } else if(topic.from_uid === user.id) {
        throw new NotAcceptableException('无法对自己的文章投票');
      } else {
        let incBody = {};
        if(type = 'up') {
          incBody = {
           upvoteCount: 1
          }
         } else {
           incBody = {
             upvoteCount: -1
           }
         }
         return await this.topicModel.updateOne({ _id: id }, { $inc: incBody });
      }
    
    }
}
