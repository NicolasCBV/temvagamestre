import { CryptSpy } from '.';

describe('CryptSpy hash method test', () => {
	const sut = new CryptSpy();

	it('should be able to hash some data', async () => {
		const data = 'data';
		await expect(sut.hash(data)).resolves.toEqual(
			sut.fixedOutputValues.hash,
		);
	});
});
