import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {SwaggerModule, DocumentBuilder} from '@nestjs/swagger';
import {ValidationPipe} from "@nestjs/common";
import {TransformInterceptor} from './core/interceptor/transform.interceptor';
import {HttpExceptionFilter} from './core/filter/http-exception.filter';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    //设置全局前缀
    app.setGlobalPrefix('api');
    // 设置swagger文档
    const config = new DocumentBuilder()
        .setTitle('管理后台')
        .setDescription('管理后台接口文档')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);

    //全局使用校验
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true
        })
    );
    // 注册全局错误的过滤器
    app.useGlobalFilters(new HttpExceptionFilter());
    // 全局注册统一返回格式拦截器
    app.useGlobalInterceptors(new TransformInterceptor());

    await app.listen(3000);
}

bootstrap();
