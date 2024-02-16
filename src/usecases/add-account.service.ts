import { CryptAdapter } from '@infra/adapters/cryptography';
import { AccountAbstractRepo } from '@domain/protocols/account';
import { AccountModel } from '@domain/models/account';
import { JwtService } from '@nestjs/jwt';
import { IUseCase } from '.';
import { Injectable } from '@nestjs/common';

interface IProps {
	name: string;
	email: string;
	password: string;
}

@Injectable()
export class AddAccountUseCase implements IUseCase {
	constructor(
		private readonly crypt: CryptAdapter,
		private readonly accountRepo: AccountAbstractRepo,
		private readonly jwtService: JwtService,
	) {}

	async exec({ name, email, password }: IProps): Promise<{ token: string }> {
		const hashedPassword = await this.crypt.hash(password);
		const account = new AccountModel({
			name,
			email,
			password: hashedPassword,
		});

		await this.accountRepo.add(account);

		const payload = JSON.stringify({
			name,
			email,
			id: account.id,
			createdAt: account.createdAt,
		});
		const SECRET = process.env.JWT_SECRET;

		const token = await this.jwtService.signAsync(payload, {
			secret: SECRET,
		});

		return { token };
	}
}
