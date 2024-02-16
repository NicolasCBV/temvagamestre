import { accountFactory } from '@tests/factories/account';
import { InMemoryAccountSpy } from '.';
import { LinkedContainer } from '../linkedContainer';
import { RepositoryError } from '@domain/protocols/error';

describe('InMemoryAccount add method test', () => {
	let container: LinkedContainer;
	let sut: InMemoryAccountSpy;

	beforeEach(() => {
		container = new LinkedContainer();
		sut = new InMemoryAccountSpy(container);
	});

	it('should be able to add a new account', async () => {
		const account = accountFactory();
		const response = await sut.add(account);

		expect(response.id === account.id).toEqual(true);
		expect(response.name === account.name).toEqual(true);
		expect(response.email === account.email).toEqual(true);
		expect(response.createdAt === account.createdAt).toEqual(true);
		expect(sut.calls.add).toEqual(1);
	});

	it('should throw one error - motive: account already exists', async () => {
		const account = accountFactory();
		await sut.add(account);

		const errorAgent = accountFactory();
		await expect(sut.add(errorAgent)).rejects.toThrow(
			new RepositoryError('Conta já existe'),
		);
		expect(sut.calls.add).toEqual(2);
	});
});
