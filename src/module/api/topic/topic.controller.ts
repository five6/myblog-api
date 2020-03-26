import { Controller, Get, UseGuards, Query, Post, Body, Put } from '@nestjs/common';
import { ResultPagination } from '../../../config/result-beans/ResultPagination';
import { AuthGuard } from '@nestjs/passport';
import { TopicService } from '../../../service/topic/topic.service';
import { Pagination } from '../../../config/result-beans/Pagination';
import { TopicDto } from '../../../dto/topic.dto';
import { Result } from 'src/config/result-beans/Result';

@Controller('frontend/topics')
@UseGuards(AuthGuard('jwt'))
export class TopicController {

    constructor(private topicService: TopicService) {

    }

    @Get()
    async index(@Query() query: any, @Query('pageSzie') pageSize?: number, @Query('currentPage') currentPage?: number): Promise<ResultPagination> {
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

}
