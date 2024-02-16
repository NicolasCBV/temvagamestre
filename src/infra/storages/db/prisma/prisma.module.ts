import { AccountAbstractRepo } from '@domain/protocols/account';
import { Global, Module } from '@nestjs/common';
import { AccountPrismaRepository } from './repositories/account';
import { PrismaService } from './prisma.service';

@Global()
@Module({
	providers: [
		{
			provide: AccountAbstractRepo,
			useClass: AccountPrismaRepository,
		},
		PrismaService,
	],
	exports: [AccountAbstractRepo, PrismaService],
})
export class PrismaModule {}
