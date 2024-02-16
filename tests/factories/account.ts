import { AccountModel } from '@domain/models/account';

type TOverride = Partial<AccountModel> & { id?: string };

export function accountFactory(input: TOverride = {}) {
	return new AccountModel(
		{
			name: 'John Doe',
			email: 'johndoe@email.com',
			password: '12345678',
			...input,
		},
		input.id,
	);
}
