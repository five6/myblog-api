import { Controller, Get, UseGuards, Query, Post, Body, Put, BadRequestException, Req, ForbiddenException, Delete, Param } from '@nestjs/common';
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
    async topics(@Req() req, @Query() query: any, @Query('pageSzie') pageSize?: number, @Query('currentPage') currentPage?: number): Promise<ResultPagination> {
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
        const topic = await this.topicService.find(cond, '', new Pagination({currentPage, pageSize}), req.user);
        return {
            items: topic[0],
            totalCount: topic[1],
            code: 0,
            msg: '获取文章列表成功',
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

    @Get('/detail')
    async detail(@Query() query , @Req() req): Promise<Result> {
        const t =  await this.topicService.findOne(query.id, req.user);
        if(!t) {
            return {
                datas: null,
                code: -1,
                msg: '文章不存在', 
            };
        }
        if(req.user.id != t.from_uid && t.level !== TopicLevelEnum.public) {
            throw new ForbiddenException('您无权查询此文章！'); 
        }
        if(t)
          return {
            datas: t,
            code: 0,
            msg: '文章获取成功',
          }
      
    }

    @Delete(':id')
    async delete(@Param('id') id: string,  @Req() req) {
        // 逻辑删除 isDeleted: true 即可， 此文章的回复可以不去修改。前端的回复只有根据文章id获取。如果要删除可以考虑在后台管理网站删除处理。
        const ret = await this.topicService.delete(id, req.user);
        if(ret)
        return {
          datas: ret,
          code: 0,
          msg: '删除成功',
        }
    }

    @Put()
    async update(@Body() topic: TopicDto, @Req() req): Promise<Result> {
        if(req.user.id !== topic.from_uid) throw new ForbiddenException('您无权修改此文章！'); 
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
            from_uid:topic.from_uid,
            isDeleted: false
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
            from_uid: req.user.id,
            isDeleted: false
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

    @Put('/upvoteCount')
    async putUpvoteCount(@Query() query, @Req() req) {
        const result =  await this.topicService.putUpvoteCount(query.id, query.type, req.user);
        if(result)
        return {
            datas: null,
            code: 0,
            msg: '赞同成功',
        }
        return {
            datas: null,
            code: -1,
            msg: '赞同失败', 
        };
    }
}
