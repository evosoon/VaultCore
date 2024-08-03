import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport, Transporter} from 'nodemailer';

@Injectable()
export class EmailService {

    transporter:Transporter

    constructor(private readonly configService:ConfigService){
        this.transporter = createTransport({
            host:this.configService.get("nodemailer_server_host"),
            post:this.configService.get("nodemailer_server_port"),
            secure:false,
            auth:{
                user:this.configService.get("nodemailer_server_auth_user"),
                pass:this.configService.get("nodemailer_server_auth_pass")
            }
        })
    }
    // 发送邮件
    async send({ to, subject, html }){
        await this.transporter.sendMail({
            from: {
                name:"Vault 平台",
                address:this.configService.get("nodemailer_server_auth_user")
            },
            to,
            subject,
            html
        })
    }
}