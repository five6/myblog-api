import { Controller, Get, Response, Request, Post, Query } from '@nestjs/common';

import { ToolsService } from '../../../service/tools/tools.service';

@Controller('admin/users')
export class UserController {
    constructor(private toolService: ToolsService) {}


    @Get('captcha')
    index(@Request() req, @Response() res) {
        const captcha = this.toolService.getCaptcha();
        req.session.code = captcha.text;
        res.type('image/+xml');
        res.send(captcha.data);
    }

    @Get('test')
    doTest(@Query() query) {
        return {
            code: 0,
            msg: 'test '
        }
    }

}
