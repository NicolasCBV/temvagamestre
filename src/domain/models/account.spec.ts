import { accountFactory } from '@tests/factories/account';
import { AccountModel } from './account';

describe('Account model test', () => {
	it('should be able to create a account entity', () => {
		const account = accountFactory();
		expect(account instanceof AccountModel).toEqual(true);

		account.password = 'new password';
		account.email = 'newemail@email.com';
		account.name = 'new name';

		expect(account.password).toEqual('new password');
		expect(account.email).toEqual('newemail@email.com');
		expect(account.name).toEqual('new name');
	});
});
