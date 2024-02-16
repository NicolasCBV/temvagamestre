import { Global, Module } from '@nestjs/common';
import { CryptAdapter } from './cryptography';
import { BcryptAdapter } from './bcrypt';
import { LoggerAdapter } from './logger';
import { PinoLoggerAdapter } from './logger/pino';

@Global()
@Module({
	providers: [
		{
			provide: CryptAdapter,
			useClass: BcryptAdapter,
		},
		{
			provide: LoggerAdapter,
			useClass: PinoLoggerAdapter,
		},
	],
	exports: [CryptAdapter, LoggerAdapter],
})
export class AdaptersModule {}
