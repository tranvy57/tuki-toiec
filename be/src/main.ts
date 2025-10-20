process.env.TZ = 'Asia/Ho_Chi_Minh';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { ResponseWrapperInterceptor } from './common/interceptor.ts/response-swapper.interceptor';
import { InformationServerLog } from './common/utils/information-server.util';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const port = process.env.PORT ?? 3000;
  const host = '0.0.0.0';

  app.use(bodyParser.json({ limit: '10mb' }));

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: '*',
    credentials: true,
  });
  app.useGlobalInterceptors(new ResponseWrapperInterceptor());

  const config = new DocumentBuilder()
    .setTitle('Toiec Smart Learner API')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('cats')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory, {
    jsonDocumentUrl: 'swagger/json',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: false, // loại bỏ các property không có trong DTO
      transform: true, // tự động map payload sang class DTO
      forbidNonWhitelisted: false, // báo lỗi nếu có property không có trong DTO
    }),
  );

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0', () => {
    InformationServerLog(port as number, host);
  });
}
bootstrap();
