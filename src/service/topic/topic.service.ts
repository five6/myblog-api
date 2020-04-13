import { Injectable, Logger, Req, ForbiddenException, NotFoundException, NotAcceptableException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ResultPagination } from '../../config/result-beans/ResultPagination';
import {Topic} from '../../interface/topic.interface';
import { Pagination } from '../../config/result-beans/Pagination';
import { TopicDto } from 'src/dto/topic.dto';
import { UpvoteDto } from '../../dto/upvote.dto';
import * as _ from 'lodash';
import * as mongoose from 'mongoose';

@Injectable()
export class TopicService {
    logger = new Logger();
    constructor(
      @InjectModel('Topic') private readonly topicModel,
      @InjectModel('Reply') private readonly replyModel,
      @InjectModel('User') private readonly userModel,
      @InjectModel('Upvote') private readonly upvoteModel,
      ) {}
      // 统一populate的字段
      pickedUserParams = ['nickName', 'username', 'avatarUrl', 'registerTime', 'useDefaultAvatarUrl'];

    async find(json: Topic, fields: string = '', pagination: Pagination, user) {
        try {
            const skip = (pagination.currentPage - 1) * pagination.pageSize;
            const topicArray = await Promise.all([
              this.topicModel.find(json, fields).skip(skip).limit(pagination.pageSize).populate('from_uid', this.pickedUserParams).lean(),
              this.topicModel.countDocuments(json).lean(),
            ]);
            const propmise1 = [], propmise2 = [], propmise3 = [];
            _.map(topicArray[0], item => {
              propmise1.push(this.replyModel.countDocuments({topic_id: item._id, reply_level: 1, isDeleted: false}).lean());
              propmise2.push(
                this.upvoteModel.countDocuments({
                  topic_id: item._id,
                  status: 1
                }).lean()
              );
              // 当用户登录
              if(user)
              propmise3.push(
                this.upvoteModel.findOne({
                  from_uid: user.id,
                  topic_id: item._id,
                  status: 1
                }).lean()
              )
            });
            const commentCount = await Promise.all(propmise1);
            const upvoteCount = await Promise.all(propmise2);
            
            let userUpvoteCount;
            if(user)
              userUpvoteCount = await Promise.all(propmise3);

            return [_.map(topicArray[0], (item, index) => {
              item.commentCount = commentCount[index];
              item.upvoteCount = upvoteCount[index];
              item.hasUpvotedCount = userUpvoteCount ? (userUpvoteCount[index] ? true : false) : false
              return item;
            }), topicArray[1]];
          } catch (error) {
            this.logger.error(error);
            return [[], 0];
          }
    }

    async findOne(id: String, user) {
      try {
        let topicData = await this.topicModel.findById(id).populate('from_uid', this.pickedUserParams).lean();
      
        if(!topicData) {
          throw new NotFoundException('该文章不存在！');
        }
        const promises = [
          this.upvoteModel.countDocuments({
            topic_id: topicData._id,
            status: 1
          }).lean()
        ];
        if(user) {
          promises.push(
            this.upvoteModel.findOne({
              from_uid: user.id,
              topic_id: topicData._id,
              status: 1
            }).lean()
          )
        }
        const countResult = await Promise.all(promises);
        topicData.upvoteCount = countResult[0];
        topicData.hasUpvotedCount = countResult[1] ? true : false
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
      const results = await Promise.all([
        this.topicModel.findById(id).lean(),
        this.upvoteModel.findOne({
          from_uid: user.id, //mongoose.Types.ObjectId(user.id),
          topic_id: id,
        }).lean()
      ])
      if(! results[0] || results[0].isDeleted) {
        throw new NotFoundException('当前删除的文章不存在');
      } else if(results[0].from_uid === user.id) {
        throw new NotAcceptableException('无法对自己的文章投票');
      } else {
        const upvote = results[1];
        if(! upvote) {
          const model = this.upvoteModel({
            from_uid: user.id,
            topic_id: id
          })
          return await model.save();
        } else {
          return await this.upvoteModel.updateOne({ _id: results[1]._id }, { $set: {status: type === 'up' ? 1: 0} });
        }
      }
    }
}
