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
				// const results = await Promise.all([
				// 	this.replyModel.find(json).sort(sort).skip(skip).limit(pagination.pageSize).populate('from_uid').populate('to_uid').lean(),
				// 	this.replyModel.countDocuments(json).lean(),
				// ]);
				// const topicIds = [];
				// let items = _.map(results[0], item => {
				// 	topicIds.push(item._id);
				// 	item.from_author = _.pick(item.from_uid, this.pickedUserParams);
				// 	item.to_author = _.pick(item.to_uid, this.pickedUserParams);
				// 	delete item.from_uid;
				// 	delete item.to_uid;
				// 	return item;
				// })
				// const topis = this.replyModel.find({ parent_reply_id: { $in : topicIds }, reply_level: 2, isDeleted: false, topic_id: json.topic_id}).sort({_id: -1}).skip(skip).limit(10).populate('from_uid').populate('to_uid').lean();
				const comments = this.replyModel.aggregate([
					{
						$match: json,
					},
					{
						$skip: skip,
					},
					{
						$limit: pagination.pageSize
					}, {
						$sort: sort
					}, {
						$project: {
							_id: 1,
							content: 1,
							from_uid: 1,
							to_uid: 1,
							put_top: 1,
							like_num: 1,
							dislike_num: 1,
							createTime: 1,
						  }
					}, {
						$lookup: {
							from: 'reply',
							localField: '_id',
							foreignField: 'parent_reply_id',
							as: 'children'
						}
					}
				])
				return [
					[],
					10
				];
			} catch (error) {
				this.logger.error(error);
				return [[], 0];
			}
		}
}
