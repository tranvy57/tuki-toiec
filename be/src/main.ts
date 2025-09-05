import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { ResponseWrapperInterceptor } from './common/interceptor.ts/response-swapper.interceptor';
import { InformationServerLog } from './common/utils/information-server.util';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const port = process.env.PORT ?? 3000;
  const host = 'localhost';

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

  await app.listen(process.env.PORT ?? 3000, 'localhost', () => {
    InformationServerLog(port as number, host);
  });
}
bootstrap();
