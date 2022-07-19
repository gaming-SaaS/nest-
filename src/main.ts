import { NestFactory } from "@nestjs/core";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";

export { AuthModule } from './auth/auth.module';
export { AuthService } from './auth/auth.service';
export { JwtAuthGuard } from './auth/jwt/jwt-auth.guard';
export { LocalAuthGuard } from './auth/local/local-auth.guard';

export async function bootstrap(version, appModule) {
  const app = await NestFactory.create<NestFastifyApplication>(
    appModule,
    new FastifyAdapter()
  );
  app.setGlobalPrefix(`api/v${version}`);
  await app.listen(3000);
}