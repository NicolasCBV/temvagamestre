import { AccountModel } from '@domain/models/account';
import {
	AccountAbstractRepo,
	AccountRepoInterfaces,
} from '@domain/protocols/account';
import { LinkedContainer } from '../linkedContainer';
import { RepositoryError } from '@domain/protocols/error';

export class InMemoryAccountSpy implements AccountAbstractRepo {
	refs: AccountModel[];
	calls = {
		add: 0,
		getByEmail: 0,
	};

	constructor(container: LinkedContainer) {
		this.refs = container.accounts;
	}

	async add(input: AccountModel): Promise<AccountRepoInterfaces.IAddReturn> {
		++this.calls.add;

		const searchedData = this.refs.find(
			(item) => item.id === input.id || item.email === input.email || item.name === input.name,
		);
		if (searchedData) throw new RepositoryError('Conta já existe');

		this.refs.push(input);
		return {
			id: input.id,
			name: input.name,
			email: input.email,
			createdAt: input.createdAt,
		};
	}

	async getByEmail(
		input: string,
	): Promise<AccountRepoInterfaces.IGetByEmailReturn> {
		++this.calls.getByEmail;

		const searchedData = this.refs.find((item) => item.email === input);

		const unsensitiveInfos: AccountRepoInterfaces.IGetByEmailReturn =
			searchedData
				? {
					data: {
						id: searchedData.id,
						name: searchedData.name,
						email: searchedData.email,
						createdAt: searchedData.createdAt,
					},
				}
				: { data: undefined };

		return unsensitiveInfos;
	}
}
