import { Injectable } from '@nestjs/common';
import * as svgCaptcha from 'svg-captcha';
import * as crypto from 'crypto';


@Injectable()
export class ToolsService {
    constructor() {

    }


    getCaptcha() {
        var captcha = svgCaptcha.create({
            size: 4,
            fontSize: 50,
            width: 100,
            height: 40,
            background: '#d8c0ff'
        });
        return captcha;
    }
    getMd5(str:string) {
        return crypto.createHash('md5').update(str).digest('hex');
    }
    sendEmail() {


    }
   

}
