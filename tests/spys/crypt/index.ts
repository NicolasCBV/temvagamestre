import { CryptAdapter } from '@infra/adapters/cryptography';

export class CryptSpy implements CryptAdapter {
	fixedOutputValues = {
		hash: 'hashed value',
	};
	calls = {
		hash: 0,
	};

	/* eslint-disable @typescript-eslint/no-unused-vars */
	async hash(_: string): Promise<string> {
		++this.calls.hash;
		return this.fixedOutputValues.hash;
	}
}
