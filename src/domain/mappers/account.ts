import { AccountModel, IAccountModelProps } from '@domain/models/account';

type TAccountMapperObject = IAccountModelProps & { id: string };

export class AccountMapper {
	static fromClassToObject(input: AccountModel): TAccountMapperObject {
		return {
			password: input.password,
			email: input.email,
			name: input.name,
			id: input.id,
			createdAt: input.createdAt,
			updatedAt: input.updatedAt
		};
	}

	static fromObjectToClass(input: TAccountMapperObject): AccountModel {
		return new AccountModel(
			{
				name: input.name,
				email: input.email,
				password: input.password,
				createdAt: input.createdAt,
				updatedAt: input.updatedAt
			},
			input.id,
		);
	}
}
