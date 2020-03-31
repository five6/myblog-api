import { Controller, Get, UseGuards, Query, Post, Body, Put, BadRequestException, Req, ForbiddenException } from '@nestjs/common';
import { ResultPagination } from '../../../config/result-beans/ResultPagination';
import { AuthGuard } from '@nestjs/passport';
import { TopicService } from '../../../service/topic/topic.service';
import { Pagination } from '../../../config/result-beans/Pagination';
import { TopicDto } from '../../../dto/topic.dto';
import { Result } from 'src/config/result-beans/Result';
import { Topic } from '../../../interface/topic.interface';
import { TopicLevelEnum } from '../../../config/enum/TopicLevelEnum';

@Controller('frontend/topics')
@UseGuards(AuthGuard('jwt'))
export class TopicController {

    constructor(private topicService: TopicService) {

    }

    @Get()
    async topics(@Query() query: any, @Query('pageSzie') pageSize?: number, @Query('currentPage') currentPage?: number): Promise<ResultPagination> {
        const cond = {
            isDeleted: false,
            level: TopicLevelEnum.public
        };
        if(query.type) {
            cond['type']= query.type;
        }
        if(query.from_uid) {
            cond['from_uid'] = query.from_uid;
        }
        if(query.put_top) {
                cond['put_top'] = query.put_top;
        }
        if(query.title) {
            cond['title'] = new RegExp(query.title)
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
    async create(@Body() topic: TopicDto, @Req() req): Promise<Result> {
        topic.from_uid = req.user.id;
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
        // 逻辑删除 isDeleted: true 即可
    }

    @Put()
    async update(@Body() topic: TopicDto, @Req() req): Promise<Result> {
        if(req.user.id !== topic.from_uid) throw new ForbiddenException('您无权修改此话题！'); 
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
            level: TopicLevelEnum.public,
            from_uid:topic.from_uid
        };
        if(topic.type) {
            cond['type']= topic.type;
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
    @Get('/owner')
    async getSelfTopic(@Req() req, @Query() topic: Topic, @Query('pageSzie') pageSize?: number, @Query('currentPage') currentPage?: number): Promise<ResultPagination> {
        const cond = {
            level: TopicLevelEnum.public,
            from_uid: req.user.id
        };
        if(topic.type) {
            cond['type']= topic.type;
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
