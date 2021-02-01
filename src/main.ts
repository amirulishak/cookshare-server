import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
// import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as config from 'config';
import { createDocument } from './config/swagger/swagger';
// import { join } from 'path';
// import { connect } from 'ngrok';

(async function () {
  const serverConfig = config.get('server');
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule);
  // const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // app.useStaticAssets(join(__dirname, '..', 'public'));

  if (process.env.NODE_ENV === 'development') app.enableCors();

  app.setGlobalPrefix('api/v1');
  SwaggerModule.setup('api', app, createDocument(app));

  const port = process.env.PORT || serverConfig.port;
  // const host = process.env.APIHOST || serverConfig.host;
  await app.listen(port);
  logger.log(`Application listening on port ${port}`);

  // const url = await connect(port);
  // logger.log(`Local server is publicly-acessible at ${url}`);
})();
