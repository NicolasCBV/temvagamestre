import { AccountModel } from '@domain/models/account';

export class LinkedContainer {
	constructor(private readonly _accounts: AccountModel[] = []) {}
	get accounts() {
		return this._accounts;
	}
}
