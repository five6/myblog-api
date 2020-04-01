import { Injectable, Logger, NotAcceptableException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReplyDto } from '../../dto/reply.dto';
import * as mongoose from 'mongoose';
import { Reply } from '../../interface/reply.interface';
import { Pagination } from '../../config/result-beans/Pagination';
import * as _ from 'lodash';
@Injectable()
export class ReplyService {
    logger = new Logger();
    constructor(
      @InjectModel('Topic') private readonly topicModel,
      @InjectModel('Reply') private readonly replyModel,
      @InjectModel('User') private readonly userModel
      ) {}
		

		async create(reply: ReplyDto) {
			const topic = await this.topicModel.findById(reply.topic_id).lean();
			if(! topic || topic.isdeleted) {
				throw new NotAcceptableException('您的回复操作无效！');
			}
			const model = this.replyModel(reply)
			return await model.save();
		}

		async delete(id: string, user) {
			const reply = await this.replyModel.findById(id).lean();
      if(! reply || reply.isDeleted ) {
        throw new NotFoundException('当前删除的回复不存在');
      } else if(reply.from_uid !== user.id) {
        throw new ForbiddenException('您无权执行删除操作');
			} 
			const cond = {};
			cond['$in'] = [{
				parent_reply_id: id,
				_id:  mongoose.Types.ObjectId(id)
			}]
			return await this.replyModel.updateMany(cond, { $set: { isDeleted: true } }).where;
		}

		async find(json: Reply, fields: string = '', pagination: Pagination) {
			try {
				const skip = (pagination.currentPage - 1) * pagination.pageSize;
				const results = await Promise.all([
					this.replyModel.find(json).skip(skip).limit(pagination.pageSize).lean(),
					this.replyModel.countDocuments(json).lean(),
				]);
				// const userIds =  _.map(results[0], item => {
				// 	return item.from_uid;
				// });
				return results;
			} catch (error) {
				this.logger.error(error);
				return [[], 0];
			}
		}
}
