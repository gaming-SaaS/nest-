import { NestFactory } from "@nestjs/core";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { existsSync, mkdirSync } from "fs";
import { PATH } from "./constants";
import { LoggingInterceptor } from "./interceptors/logging";

export { AuthModule } from './auth/auth.module';
export { AuthService } from './auth/auth.service';
export { JwtAuthGuard } from './auth/jwt/jwt-auth.guard';
export { LocalAuthGuard } from './auth/local/local-auth.guard';

export async function bootstrap(name, version, appModule) {
  PATH.LOG = './log/' + name;

  initialize();

  const app = await NestFactory.create<NestFastifyApplication>(
    appModule,
    new FastifyAdapter()
  );
  app.setGlobalPrefix(`api/v${version}`);
  app.useGlobalInterceptors(new LoggingInterceptor());
  await app.listen(3000);
}

function initialize() {
  mkdirSync(PATH.LOG, { recursive: true })
}