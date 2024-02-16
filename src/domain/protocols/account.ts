import { AccountModel } from '@domain/models/account';

export namespace AccountRepoInterfaces {
	export interface IAddReturn {
		id: string;
		name: string;
		email: string;
		createdAt: Date;
	}

	export interface IGetByEmailReturn {
		data?: {
			id: string;
			name: string;
			email: string;
			createdAt: Date;
		};
	}
}

export abstract class AccountAbstractRepo {
	abstract add(
		input: AccountModel,
	): Promise<AccountRepoInterfaces.IAddReturn>;
	abstract getByEmail(
		input: string,
	): Promise<AccountRepoInterfaces.IGetByEmailReturn>;
}
