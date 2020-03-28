import { Controller, Get, UseGuards, Logger, Post, Body } from '@nestjs/common';
import { Result } from '../../../config/result-beans/Result';
import { AuthGuard } from '@nestjs/passport';
import { SysCommonService } from '../../../service/sys-common/sys-common.service';
import { SysCommonDto } from '../../../dto/sys-common.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('frontend/sys-common')
export class SysCommonController {
    
    logger = new Logger();
    constructor(private sysCommonService: SysCommonService) { }
  
    @Get('banner')
    async findBanner(): Promise<Result> {
        const banner = await this.sysCommonService.findBanner();
        return {
            datas: banner,
            code: 0,
            msg: '获取主版广告成功'
        }
    }

    @Post()
    async create(@Body() sysCommonDto: SysCommonDto): Promise<Result> {
        const t =  await this.sysCommonService.create(sysCommonDto);
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
}
