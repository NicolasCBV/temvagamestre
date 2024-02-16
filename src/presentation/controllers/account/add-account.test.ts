import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { accountFactory } from '@tests/factories/account';
import * as supertest from 'supertest';
import { PrismaService } from '@infra/storages/db/prisma/prisma.service';
import { ClassValidatorErrorFilter } from '@presentation/filters/classValidator.filter';
import { PrismaErrorFilter } from '@presentation/filters/prisma.filter';
import { LoggerAdapter } from '@infra/adapters/logger';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from '../../../main/app.module';
import { NotFoundFilter } from '@presentation/filters/notFound.filter';
import { GenericErrorFilter } from '@presentation/filters/generic.filter';
import { AccountPrismaRepository } from '@infra/storages/db/prisma/repositories/account';
import { AccountModel } from '@domain/models/account';

describe('Add Account E2E test', () => {
	let sut: INestApplication;

	const endpoint = '/account';

	beforeEach(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();
		sut = moduleRef.createNestApplication({
			logger: false,
		});
		sut.enableShutdownHooks();

		sut.useGlobalPipes(new ValidationPipe());
		const logger = sut.get(LoggerAdapter);

		sut.useGlobalFilters(new GenericErrorFilter(logger));
		sut.useGlobalFilters(new PrismaErrorFilter(logger));
		sut.useGlobalFilters(new ClassValidatorErrorFilter(logger));
		sut.useGlobalFilters(new NotFoundFilter(logger));

		await sut.init();

		const db = sut.get(PrismaService);
		await db.account.deleteMany();
	});

	afterEach(async () => {
		const db = sut.get(PrismaService);
		await db.account.deleteMany();

		await sut.close();
	});

	it('should be able to create a user account', async () => {
		const account = accountFactory();
		const res = await supertest(sut.getHttpServer())
			.post(endpoint)
			.set('content-type', 'application/json')
			.send({
				name: account.name,
				email: account.email,
				password: account.password,
			});

		expect(res.statusCode).toEqual(201);
	});

	it('should throw one error - motive: wrong endpoint', async () => {
		const { statusCode, body } = await supertest(sut.getHttpServer()).get(
			'/wrong-endpoint',
		);
		expect(statusCode).toEqual(404);
		expect(body?.name).toEqual('Não encontrado');
	});

	it('should throw one error - motive: internal server error', async () => {
		const oldMethod = AccountPrismaRepository.prototype.add;
		AccountPrismaRepository.prototype.add = jest.fn(
			async (): Promise<AccountModel> => {
				throw new Error('unknown');
			},
		);

		const account = accountFactory();
		const { statusCode, body } = await supertest(sut.getHttpServer())
			.post(endpoint)
			.set('content-type', 'application/json')
			.send({
				name: account.name,
				email: account.email,
				password: account.password,
			});

		expect(statusCode).toEqual(500);
		expect(body?.message).toEqual('Erro interno do servidor');

		AccountPrismaRepository.prototype.add = oldMethod;
	});

	it('should throw one error - motive: account already exists', async () => {
		const account = accountFactory();
		const sendRequest = async () =>
			await supertest(sut.getHttpServer())
				.post(endpoint)
				.set('content-type', 'application/json')
				.send({
					name: account.name,
					email: account.email,
					password: account.password,
				});

		const { statusCode } = await sendRequest();
		expect(statusCode).toEqual(201);

		const finalResult = await sendRequest();
		expect(finalResult.statusCode).toEqual(401);
	});

	it('should throw one error - motive: malformed body', async () => {
		const account = accountFactory();
		const sendRequest = async (
			name: string,
			email: string,
			password: string,
		) =>
			await supertest(sut.getHttpServer())
				.post(endpoint)
				.set('content-type', 'application/json')
				.send({ name, email, password });

		// name
		const name_lessThan2CharsRes = await sendRequest(
			'a',
			account.email,
			account.password,
		);
		expect(name_lessThan2CharsRes.statusCode).toEqual(400);

		const name_majorThan64CharsRes = await sendRequest(
			'a'.repeat(65),
			account.email,
			account.password,
		);
		expect(name_majorThan64CharsRes.statusCode).toEqual(400);

		// email
		const email_malformedRes = await sendRequest(
			account.name,
			'malformed-email',
			account.password,
		);
		expect(email_malformedRes.statusCode).toEqual(400);

		// password
		const password_lessThan6CharsRes = await sendRequest(
			account.name,
			account.email,
			'12345',
		);
		expect(password_lessThan6CharsRes.statusCode).toEqual(400);

		const password_majorThan255CharsRes = await sendRequest(
			account.name,
			account.email,
			'1'.repeat(256),
		);
		expect(password_majorThan255CharsRes.statusCode).toEqual(400);
	});
});
