import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { createWriteStream, WriteStream } from 'fs';
import { PATH } from 'src/constants';

let writeStream: WriteStream;

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        if (!writeStream) {
            writeStream = createWriteStream(PATH.LOG + '/out.log');
        }

        const request = context.getArgByIndex(0);
        writeStream.write(JSON.stringify({
            id: request.id,
            ip: request.ip,
            time: new Date().getTime(),
            requestedEndpoint: `${request.method} ${request.headers.host + request.url}`,
            body: request.body
        }));

        const now = Date.now();
        return next
            .handle()
            .pipe(
                tap((data) => writeStream.write(JSON.stringify({ id: request.id }))),
            );
    }
}
