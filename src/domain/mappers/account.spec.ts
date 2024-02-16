import { accountFactory } from '@tests/factories/account';
import { AccountMapper } from './account';

describe('Account Mapper', () => {
	it('should be able to use AccountMapper', () => {
		const base = accountFactory();
		const accountObjt = AccountMapper.fromClassToObject(base);
		const sut = AccountMapper.fromObjectToClass(accountObjt);

		expect(sut.equalTo(base)).toEqual(true);
	});
});
