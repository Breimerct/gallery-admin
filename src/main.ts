import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from '@/app/app.module';
import { NestFactory } from '@nestjs/core';

async function bootstrap() {
  const PORT = process.env.PORT || 3000;
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });
  app.setGlobalPrefix('api/v1');

  const config = new DocumentBuilder()
    .setTitle('Gallery Admin')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/doc', app, document);

  await app
    .listen(PORT)
    .then(() => {
      console.log(`Server is running on http://localhost:${PORT}`);
    })
    .catch(error => {
      console.error(`Error starting server: ${error.message}`);
    });
}

bootstrap();
