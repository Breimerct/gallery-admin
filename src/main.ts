import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const PORT = process.env.PORT || 8081;
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');

  const config = new DocumentBuilder()
  .setTitle('Gallery Admin')
  .setVersion('1.0')
  .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/doc', app, document);

  await app.listen(PORT)
    .then(() => {
      console.log(`Server is running on http://localhost:${PORT}`);
    })
    .catch((error) => {
      console.error(`Error starting server: ${error.message}`);
    });
}

bootstrap();
