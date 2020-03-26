import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ResultPagination } from '../../config/result-beans/ResultPagination';
import {Topic} from '../../interface/topic.interface';
import { Pagination } from '../../config/result-beans/Pagination';
import { TopicDto } from 'src/dto/topic.dto';
@Injectable()
export class TopicService {
    logger = new Logger();
    constructor(@InjectModel('Topic') private readonly topicModel) {}

    async find(json: Topic = {}, fields: string = '', pagination: Pagination) {
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
}
