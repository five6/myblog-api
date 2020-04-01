import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SysCommonTypEnum } from '../../config/enum/SysCommonTypenum';
import { SysCommonDto } from '../../dto/sys-common.dto';

@Injectable()
export class SysCommonService {

    logger = new Logger();
    constructor(@InjectModel('SysCommon') private readonly sysCommonModel) {}


    async findBanner() {
      return await this.sysCommonModel.findOne({type: SysCommonTypEnum.BANNER}).lean();
    }

    async create(sysCommonDto: SysCommonDto) {
        sysCommonDto.createTime = new Date().getTime();
        const model = this.sysCommonModel(sysCommonDto);
        return await model.save();
    }

    async update(sysCommonDto: SysCommonDto) {
        return await this.sysCommonModel.updateOne({ _id: sysCommonDto._id }, { $set: sysCommonDto });
      }

}