import { randomUUID } from 'crypto';
import { TReplace } from '@utils/replace';

export interface IAccountModelProps {
	name: string;
	email: string;
	password: string;
	createdAt: Date;
	updatedAt: Date;
}

export type TInputAccountModelProps = TReplace<
	TReplace<
		IAccountModelProps,
		{ createdAt?: Date }
	>,
	{ updatedAt?: Date }
>

export class AccountModel {
	private props: IAccountModelProps;
	private readonly _id: string;

	constructor(input: TInputAccountModelProps, id?: string) {
		this._id = id ?? randomUUID();
		this.props = {
			...input,
			createdAt: input.createdAt ?? new Date(),
			updatedAt: input.updatedAt ?? new Date()
		};
	}

	equalTo(input: AccountModel): boolean {
		return (
			input instanceof AccountModel &&
			input.id === this.id &&
			input.createdAt === this.createdAt &&
			input.name === this.name &&
			input.email === this.email &&
			input.password === this.password
		);
	}

	get id() {
		return this._id;
	}
	get createdAt() {
		return this.props.createdAt;
	}
	get updatedAt() {
		return this.props.updatedAt;
	}

	get name() {
		return this.props.name;
	}
	set name(input: string) {
		this.props.name = input;
	}

	get email() {
		return this.props.email;
	}
	set email(input: string) {
		this.props.email = input;
	}

	get password() {
		return this.props.password;
	}
	set password(input: string) {
		this.props.password = input;
	}
}
