import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { HealthCheckError } from '@nestjs/terminus';

@Catch(HealthCheckError)
export class HealthCheckErrorFilter implements ExceptionFilter {
	/* eslint-disable @typescript-eslint/no-unused-vars */
	catch(_: HealthCheckError, host: ArgumentsHost) {
		const context = host.switchToHttp();
		const response = context.getResponse<Response>();

		return response.status(500).json({
			statusCode: 500,
			message: 'Erro interno do servidor',
		});
	}
}
