import { LinkedContainer } from '@tests/inMemoDatabases/linkedContainer';
import { InMemoryAccountSpy } from '@tests/inMemoDatabases/account';
import { JwtService } from '@nestjs/jwt';
import { AddAccountUseCase } from './add-account.service';
import { CryptSpy } from '@tests/spys/crypt';
import { accountFactory } from '@tests/factories/account';

describe('AddAccountUseCase', () => {
	let container: LinkedContainer;
	let accountRepo: InMemoryAccountSpy;
	let jwtService: JwtService;
	let crypt: CryptSpy;
	let sut: AddAccountUseCase;

	beforeEach(() => {
		JwtService.prototype.signAsync = jest.fn(async () => '__fake_token__');

		container = new LinkedContainer();
		accountRepo = new InMemoryAccountSpy(container);
		crypt = new CryptSpy();
		jwtService = new JwtService();

		sut = new AddAccountUseCase(crypt, accountRepo, jwtService);
	});

	it('Should call LoadAccountByEmailRepository with correct email', async () => {
		const account = accountFactory();
		const { token } = await sut.exec({
			name: account.name,
			email: account.email,
			password: account.password,
		});

		expect(crypt.calls.hash).toEqual(1);
		expect(accountRepo.calls.add).toEqual(1);
		expect(token).toEqual('__fake_token__');
	});
});
