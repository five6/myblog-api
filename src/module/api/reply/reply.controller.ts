import { Controller, Post, Body, Req, Delete, Param, Get, Query, UseGuards, BadRequestException } from '@nestjs/common';
import { ReplyDto } from '../../../dto/reply.dto';
import { ReplyService } from '../../../service/reply/reply.service';
import { Result } from '../../../config/result-beans/Result';
import { ResultPagination } from '../../../config/result-beans/ResultPagination';
import { Pagination } from '../../../config/result-beans/Pagination';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('frontend/comments')
export class ReplyController {

    constructor(private replyService: ReplyService) {}

    @Post()
    async create(@Body() reply: ReplyDto, @Req() req): Promise<Result> {
        reply.from_uid = req.user.id;
        const t =  await this.replyService.create(reply);
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

    @Delete(':id')
    async delete(@Param('id') id: string,  @Req() req) {
        // 逻辑删除 isDeleted: true 即可, 并级连操作回复此回复的话题
        const ret = await this.replyService.delete(id, req.user);
        if(ret)
        return {
          datas: ret,
          code: 0,
          msg: '删除成功',
        }
    }

    @Get()
    async query(@Query() query: any, @Query('pageSzie') pageSize?: number, @Query('currentPage') currentPage?: number): Promise<ResultPagination> {
        const {topic_id, sort_time} = query;
        if(!topic_id)  throw new BadRequestException('文章id丢失');
        const cond = {
            isDeleted: false,
            reply_level: 1,
            topic_id,
        };
        let sort = {};
        if(sort_time === 'true') {
            sort = {
            _id: -1,
            createTime: -1
           }
        } else {
            sort = {
                like_num: -1,
                put_top: -1,
                dislike_num : 1
            }
        }
        const reply = await this.replyService.find(cond, sort, new Pagination({currentPage, pageSize}));
        return {
            // items: reply[0],
            // totalCount: reply[1],
            items: [],
            totalCount: 0,
            code: 0,
            msg: '获取回复列表成功',
        }
    }

}
