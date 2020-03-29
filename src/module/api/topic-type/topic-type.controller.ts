import { Controller, Get, UseGuards } from '@nestjs/common';
import { Result } from '../../../config/result-beans/Result';
import { TopicTypeEnum } from '../../../config/enum/TopicTypeEnum';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('frontend/topic-type')
export class TopicTypeController {
    
    @Get()
    async index(): Promise<Result> {
        return {
            datas: TopicTypeEnum,
            code: 0,
            msg: '获取主题类型成功'
        }
    }
}
