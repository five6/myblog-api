import { Injectable, Logger } from '@nestjs/common';
import * as svgCaptcha from 'svg-captcha';
import * as crypto from 'crypto';
import  { CryptoRandomStringType } from '../../config/enum/CryptoRandomStringType';
import * as cryptoRandomString from 'crypto-random-string';
import * as _ from 'lodash';
import * as nodemailer from 'nodemailer';
import { Config } from '../../config/config';

@Injectable()
export class ToolsService {
    logger = new Logger();
    transporter = null;
    constructor() {
        this.transporter = nodemailer.createTransport({
            service:'qq',
            port: 465, // SMTP 端口
            ssl: false, // 使用 SSL
            auth: {
                user: Config.mail_conf.user,
                pass: Config.mail_conf.pass
            }
        });
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
    getRandomUrlString() {
        return cryptoRandomString({length: 64, type: CryptoRandomStringType.urlSsafe});
    }
    async sendEmail(mail: string, title: any, body: any) {
        let info = await this.transporter.sendMail({
            from: Config.mail_conf.user, // sender address
            to: mail, // list of receivers
            subject: title, // Subject line
            html: body // html body
        });
        return new Promise((resolve,reject) => {
            this.transporter.sendMail(info,(err,info) => {
                if(err){
                    reject(err);
                }
                resolve(info);
            })
        })
    }
    async sendEmailToUser(mail: string, username: string, password: string, url: string) {
        let tplTitle = _.template('用户注册结果')
        let tplBody = `<p>恭喜您注册成功!<br /> 用户名是${username}、密码是${password},请点击下面链接完成验证，链接有效期24小时<br /> ${url}</p>`;
        let dataTitle = {platform : tplTitle}
        const result = await this.sendEmail(mail, tplTitle(dataTitle), tplBody).catch(err => {
            this.logger.error(err);
        });
        if(result)
            this.logger.log("Email send success! (" + mail + ")")
    }
   

}
