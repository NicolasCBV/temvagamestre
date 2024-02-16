import { Injectable } from '@nestjs/common';
import { LoggerAdapter } from '../logger';
import pino from 'pino';
import pretty from 'pino-pretty';

const logger = pino({
	transport: {
		target: 'pino-pretty',
	},
});

const loggerTest = pino(pretty({ sync: true }));
export { logger, loggerTest };

@Injectable()
export class PinoLoggerAdapter implements LoggerAdapter {
	private readonly logger: ReturnType<typeof pino>;

	constructor() {
		this.logger =
			process.env.NODE_ENV !== 'test'
				? pino({ transport: { target: 'pino-pretty' } })
				: pino(pretty({ sync: true }));
	}

	info(input: any) {
		if (!process.env.NO_LOGS) this.logger.info(input);
	}

	warn(input: any) {
		if (!process.env.NO_LOGS) this.logger.warn(input);
	}

	debug(input: any) {
		if (!process.env.NO_LOGS) this.logger.debug(input);
	}

	error(input: any) {
		if (!process.env.NO_LOGS) this.logger.error(input);
	}
}
