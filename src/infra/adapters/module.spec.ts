import { INestApplication } from '@nestjs/common';
import { AdaptersModule } from './adapters.module';
import { NestFactory } from '@nestjs/core';
import { CryptAdapter } from './cryptography';
import { LoggerAdapter } from './logger';

describe('AdaptersModule test', () => {
	let app: INestApplication;
	let crypt: CryptAdapter;
	let logger: LoggerAdapter;

	beforeEach(async () => {
		app = await NestFactory.create(AdaptersModule, {
			logger: false,
		});
		crypt = app.get(CryptAdapter);
		logger = app.get(LoggerAdapter);
	});

	afterEach(async () => {
		await app.close();
	});

	it('should be able to use CryptAdapter', async () => {
		const value = 'test';
		const hashedValue = await crypt.hash(value);

		expect(hashedValue !== value).toEqual(true);
		expect(hashedValue.length > value.length).toEqual(true);
	});

	it('should be able to use a LoggerAdapter', async () => {
		const actualState = process.env.NO_LOGS;
		process.env.NO_LOGS = '';

		logger.info('test');
		logger.warn('test');
		logger.debug('test');
		logger.error('test');

		process.env.NO_LOGS = actualState;
	});
});
