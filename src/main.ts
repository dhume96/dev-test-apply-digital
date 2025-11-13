import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'

const PORT = process.env.PORT || 4000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({ origin: '*' })
  app.useGlobalPipes(new ValidationPipe({}))

  await app.listen(PORT, () => {
    console.log(`Application running on ${PORT}`)
  });
}
bootstrap();
