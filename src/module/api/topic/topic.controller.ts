import { Controller, Get, UseGuards, Query, Post, Body, Put, BadRequestException } from '@nestjs/common';
import { ResultPagination } from '../../../config/result-beans/ResultPagination';
import { AuthGuard } from '@nestjs/passport';
import { TopicService } from '../../../service/topic/topic.service';
import { Pagination } from '../../../config/result-beans/Pagination';
import { TopicDto } from '../../../dto/topic.dto';
import { Result } from 'src/config/result-beans/Result';
import { Topic } from '../../../interface/topic.interface';

@Controller('frontend/topics')
@UseGuards(AuthGuard('jwt'))
export class TopicController {

    constructor(private topicService: TopicService) {

    }

    @Get('recommend')
    async recommend(@Query() query: any, @Query('pageSzie') pageSize?: number, @Query('currentPage') currentPage?: number): Promise<ResultPagination> {
       const cond = {};
       if(query.topic_type) {
           cond['topic_type']= query.topic_type;
       }
       if(query.from_uid) {
           cond['from_uid'] = query.from_uid;
       }
       if(query.put_top) {
            cond['put_top'] = query.put_top;
       }
        const topic = await this.topicService.find(cond, '', new Pagination({currentPage, pageSize}));
        return {
            items: topic[0],
            totalCount: topic[1],
            code: 0,
            msg: '获取主题列表成功',
        }
    }

    @Get('recommend')
    async hot(@Query() query: any, @Query('pageSzie') pageSize?: number, @Query('currentPage') currentPage?: number): Promise<ResultPagination> {
       const cond = {};
       if(query.topic_type) {
           cond['topic_type']= query.topic_type;
       }
       if(query.from_uid) {
           cond['from_uid'] = query.from_uid;
       }
       if(query.put_top) {
            cond['put_top'] = query.put_top;
       }
        const topic = await this.topicService.find(cond, '', new Pagination({currentPage, pageSize}));
        return {
            items: topic[0],
            totalCount: topic[1],
            code: 0,
            msg: '获取主题列表成功',
        }
    }

    @Get('following')
    async fetchFollowings(@Query() query: any, @Query('pageSzie') pageSize?: number, @Query('currentPage') currentPage?: number): Promise<ResultPagination> {
       const cond = {};
       if(query.topic_type) {
           cond['topic_type']= query.topic_type;
       }
       if(query.from_uid) {
           cond['from_uid'] = query.from_uid;
       }
       if(query.put_top) {
            cond['put_top'] = query.put_top;
       }
        const topic = await this.topicService.find(cond, '', new Pagination({currentPage, pageSize}));
        return {
            items: topic[0],
            totalCount: topic[1],
            code: 0,
            msg: '获取主题列表成功',
        }
    }

    @Post()
    async create(@Body() topic: TopicDto): Promise<Result> {
        const t =  await this.topicService.create(topic);
        if(t)
          return {
            datas: t,
            code: 0,
            msg: '创建成功',
          }
        return {
            datas: null,
            code: -1,
            msg: '创建失败', 
        };
    }

    async delete() {

    }

    @Put()
    async update(@Body() topic: TopicDto): Promise<Result> {
        const result =  await this.topicService.update(topic);
        if(result && result.nModified)
          return {
            datas: null,
            code: 0,
            msg: '修改成功',
          }
        return {
            datas: null,
            code: -1,
            msg: '修改失败', 
        };
    }


    @Get('/user')
    async getUserTopic(@Query() topic: Topic, @Query('pageSzie') pageSize?: number, @Query('currentPage') currentPage?: number): Promise<ResultPagination> {
        if(! topic.from_uid) 
            throw new BadRequestException('查询条件用户ID必须');
        const cond = {
            from_uid:topic.from_uid
        };
        if(topic.topic_type) {
            cond['topic_type']= topic.topic_type;
        }
        if(topic.from_uid) {
            cond['from_uid'] = topic.from_uid;
        }
        if(topic.put_top) {
             cond['put_top'] = topic.put_top;
        }
         const t = await this.topicService.findUserTopic(cond, '', new Pagination({currentPage, pageSize}));
         return {
             items: t[0],
             totalCount: t[1],
             code: 0,
             msg: '获取主题列表成功',
         }
    }
}
