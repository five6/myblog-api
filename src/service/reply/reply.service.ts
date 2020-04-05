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
	QUERY_LIMIT = 10;
	pickedUserParams = ['_id','nickName', 'username', 'avatarUrl', 'registerTime', 'useDefaultAvatarUrl'];
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

		async find(json: Reply,  sort: any,  pagination: Pagination) {
			try {
				const skip = (pagination.currentPage - 1) * pagination.pageSize;
				const results = await Promise.all([
					this.replyModel.find(json).sort(sort).skip(skip).limit(pagination.pageSize).populate('from_uid', this.pickedUserParams).populate('to_uid', this.pickedUserParams).lean(),
					this.replyModel.countDocuments(json).lean(),
				]);
				let comments = results[0];
				const topicIds = _.map(comments, item => {
					return item._id;
				});
				const replies = await this.replyModel.find({ parent_reply_id: { $in : topicIds }, reply_level: 2, isDeleted: false, topic_id: json.topic_id}).sort({_id: -1}).skip(0).limit(this.QUERY_LIMIT).populate('from_uid',this.pickedUserParams).populate('to_uid', this.pickedUserParams).lean();
				const grouped =_.groupBy(replies, 'parent_reply_id');
				comments = _.each(comments, item => {
					item.children = grouped[item._id.toString()] || [];
					return item;
				})
				return [
					comments,
					results[1]
				];
			} catch (error) {
				this.logger.error(error);
				return [[], 0];
			}
		}

		async findMoreReplyComments(current_id: mongoose.Types.ObjectId, topic_id: mongoose.Types.ObjectId, parent_reply_id: mongoose.Types.ObjectId, backward: number) {
			try {
				return await this.replyModel.find({ parent_reply_id, reply_level: 2, isDeleted: false, topic_id: topic_id, _id: {$lt: current_id}}).sort({_id: backward === 1 ? 1: -1}).limit(this.QUERY_LIMIT).populate('from_uid',this.pickedUserParams).populate('to_uid', this.pickedUserParams).lean();
			} catch (error) {
				this.logger.error(error);
				return [];
			}
		}
}
