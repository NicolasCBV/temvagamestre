import { Module } from '@nestjs/common';
import { AdaptersModule } from '@infra/adapters/adapters.module';
import { PrismaModule } from '@infra/storages/db/prisma/prisma.module';
import { AccountControllerModule } from '@presentation/controllers/account/account.module';
import { HealthControllerModule } from '@presentation/controllers/health/health.module';

@Module({
	imports: [
		PrismaModule,
		AccountControllerModule,
		HealthControllerModule,
		AdaptersModule,
	],
})
export class AppModule {}
