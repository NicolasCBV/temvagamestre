export class RepositoryError extends Error {
	constructor(readonly message: string) {
		super();

		this.name = 'Repository error';
		this.message = message;
	}
}
