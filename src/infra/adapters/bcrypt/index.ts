import { hash } from 'bcrypt';
import { CryptAdapter } from '../cryptography';

export class BcryptAdapter implements CryptAdapter {
	async hash(value: string): Promise<string> {
		return await hash(value, 12);
	}
}
