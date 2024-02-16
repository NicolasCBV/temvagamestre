export abstract class CryptAdapter {
	abstract hash(value: string): Promise<string>;
}
