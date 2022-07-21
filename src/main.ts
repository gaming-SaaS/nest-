import { INestApplication } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { mkdirSync } from "fs";
import { PATH } from "./constants";
import { LoggingInterceptor } from "./interceptors/logging";

export { AuthModule } from './auth/auth.module';
export { AuthService } from './auth/auth.service';
export { JwtAuthGuard } from './auth/jwt/jwt-auth.guard';
export { LocalAuthGuard } from './auth/local/local-auth.guard';

export async function bootstrap(name: string, version: string, appModule: any) {
  PATH.LOG = './log/' + name;

  initialize();

  await createServers(version, appModule);
}

async function createServers(version: string, appModule: any, enableGRPC = false) {
  const app: INestApplication = await createNestApp(version, appModule);

  await createHTTPServer(app);
  if (enableGRPC) {
    await createGRPCServer(app);
  }

  await app.startAllMicroservices();
  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

async function createNestApp(version: string, appModule: any): Promise<INestApplication> {
  const app: NestFastifyApplication = await NestFactory.create<NestFastifyApplication>(
    appModule,
    new FastifyAdapter()
  );
  app.setGlobalPrefix(`api/v${version}`);
  app.useGlobalInterceptors(new LoggingInterceptor());
  return <INestApplication>app;
}

async function createHTTPServer(app: INestApplication) {
}

async function createGRPCServer(app: INestApplication) {
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      url: 'localhost:50051',
      package: 'command',
      protoPath: ('./src/commands/command.proto'),
    }
  });
}

function initialize() {
  mkdirSync(PATH.LOG, { recursive: true })
}