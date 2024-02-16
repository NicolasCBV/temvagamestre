import { AccountModel } from '@domain/models/account';
import { PrismaService } from '../prisma.service';
import { AccountMapper } from '@domain/mappers/account';
import {
	AccountAbstractRepo,
	AccountRepoInterfaces,
} from '@domain/protocols/account';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AccountPrismaRepository implements AccountAbstractRepo {
	constructor(private readonly prisma: PrismaService) {}

	async add(input: AccountModel): Promise<AccountRepoInterfaces.IAddReturn> {
		const parsedData = AccountMapper.fromClassToObject(input);
		const account = await this.prisma.account.create({
			data: parsedData,
			select: {
				id: true,
				name: true,
				email: true,
				createdAt: true,
			},
		});

		return { ...account };
	}

	async getByEmail(
		input: string,
	): Promise<AccountRepoInterfaces.IGetByEmailReturn> {
		const accountNonSensitiveData = await this.prisma.account.findUnique({
			where: { email: input },
			select: {
				id: true,
				name: true,
				email: true,
				createdAt: true,
			},
		});

		return { data: accountNonSensitiveData ?? undefined };
	}
}
