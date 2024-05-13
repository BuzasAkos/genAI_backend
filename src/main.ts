import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {cors: true});
  const config= new DocumentBuilder()
    .setTitle('OpenAI backend API')
    .setDescription('sample documentation')
    .setVersion('1.0')
    .addTag('barchoba')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
  const PORT = process.env.PORT || 3000;
  await app.listen(PORT);
}
bootstrap();
