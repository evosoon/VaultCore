import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { FormatResponseInterceptor } from './interceptor/format-response.interceptor';
import { InvokeRecordInterceptor } from './interceptor/invoke-record.interceptor';
import { UnloginFilter } from './filters/unlogin.filter';
import { CustomExceptionFilter } from './filters/custom-exception.filter';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Log4jsLogger } from '@nestx-log4js/core';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    //swagger 文档
    const config = new DocumentBuilder()
    .setTitle('Test example')
    .setDescription('The API description')
    .setVersion('1.0')
    .addTag('test')
    .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('swagger-ui', app, document);

  app.enableCors()
    
    // 全局启用 ValidationPipe
    app.useGlobalPipes(new ValidationPipe())
    // 全局启用 响应拦截器
    app.useGlobalInterceptors(new FormatResponseInterceptor())
    // 全局启用 接口跟踪记录
    app.useGlobalInterceptors(new InvokeRecordInterceptor())
    // 全局启用 身份认证错误拦截
    app.useGlobalFilters(new UnloginFilter())
    // 全局启用 请求错误拦截
    app.useGlobalFilters(new CustomExceptionFilter())
    // 添加 uploads 为静态资源
    app.useStaticAssets('uploads', {
        prefix: '/uploads'
    });
    // configService
    const configService = app.get(ConfigService)
    // log4js
    app.useLogger(app.get(Log4jsLogger))
    // listen
    await app.listen(configService.get('nest_server_port'));
    Logger.log(`listen to localhost:${configService.get('nest_server_port')}/swagger-ui`)
}
bootstrap();
