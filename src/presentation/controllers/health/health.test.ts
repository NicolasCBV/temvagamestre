import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as supertest from 'supertest';
import { ClassValidatorErrorFilter } from '@presentation/filters/classValidator.filter';
import { PrismaErrorFilter } from '@presentation/filters/prisma.filter';
import { LoggerAdapter } from '@infra/adapters/logger';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from '../../../main/app.module';
import { PrismaHealthIndicator } from '@nestjs/terminus';
import { HealthCheckErrorFilter } from '@presentation/filters/healthCheck.filter';

describe('Health check E2E test', () => {
	let sut: INestApplication;

	const endpoint = '/health';

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

		sut.useGlobalFilters(new PrismaErrorFilter(logger));
		sut.useGlobalFilters(new ClassValidatorErrorFilter(logger));

		await sut.init();
	});

	it('should be able to check a health of server', async () => {
		const old_max_mem_heap = process.env.MAX_MEMORY_HEAP;
		const old_max_mem_rss = process.env.MAX_MEMORY_RSS;

		process.env.MAX_MEMORY_HEAP = '';
		process.env.MAX_MEMORY_RSS = '';

		const res = await supertest(sut.getHttpServer()).get(endpoint);
		expect(res.statusCode).toEqual(200);

		process.env.MAX_MEMORY_HEAP = old_max_mem_heap;
		process.env.MAX_MEMORY_RSS = old_max_mem_rss;
	});

	it('should throw one error - motive: database error', async () => {
		PrismaHealthIndicator.prototype.pingCheck = jest.fn(async () => {
			throw new HealthCheckErrorFilter();
		});

		const res = await supertest(sut.getHttpServer()).get(endpoint);
		expect(res.statusCode).toEqual(500);
	});
});
