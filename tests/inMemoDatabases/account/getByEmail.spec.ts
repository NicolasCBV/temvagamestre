import { LinkedContainer } from '../linkedContainer';
import { InMemoryAccountSpy } from '.';
import { accountFactory } from '@tests/factories/account';

describe('InMemoryAccount getByEmail method test', () => {
	let container: LinkedContainer;
	let sut: InMemoryAccountSpy;

	beforeEach(() => {
		container = new LinkedContainer();
		sut = new InMemoryAccountSpy(container);
	});

	it('should be able to search for accounts by email', async () => {
		const account = accountFactory();
		sut.refs.push(account);

		const existentAccount = await sut.getByEmail(account.email);
		expect(existentAccount.data?.id === account.id).toEqual(true);
		expect(existentAccount.data?.name === account.name).toEqual(true);
		expect(existentAccount.data?.email === account.email).toEqual(true);
		expect(existentAccount.data?.createdAt === account.createdAt).toEqual(
			true,
		);

		const fakeEmail = await sut.getByEmail('fakeemail@email.com');
		expect(fakeEmail.data).toBeUndefined();
		expect(sut.calls.getByEmail).toEqual(2);
	});
});
