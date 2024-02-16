import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule as AxiosHttpModule } from '@nestjs/axios';

@Module({
	imports: [
		TerminusModule.forRoot({
			errorLogStyle: 'pretty',
		}),
		AxiosHttpModule,
	],
	controllers: [HealthController],
})
export class HealthControllerModule {}
