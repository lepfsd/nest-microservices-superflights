import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionFIlter } from './common/filters/http-exception.filter';
import { TimeOutInterceptor } from './common/interceptors/timeout.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new AllExceptionFIlter());
  app.useGlobalInterceptors(new TimeOutInterceptor());
  const options = new DocumentBuilder()
    .setTitle('SuperFly API')
    .setDescription('Scheduled flight apps')
    .setVersion('2.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/api/docs', app, document, {
    swaggerOptions: {
      filter: true,
    },
  });
  await app.listen(process.env.PORT || 4000);
}
bootstrap();
