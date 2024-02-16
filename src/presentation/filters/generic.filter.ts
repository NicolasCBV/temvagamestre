import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { LoggerAdapter } from '@infra/adapters/logger';

interface IUntrackableErrors {
	name: string;
	key: string;
	message: string;
	httpCode: number;
}

@Catch()
export class GenericErrorFilter implements ExceptionFilter {
	constructor(private readonly logger: LoggerAdapter) {}

	private readonly untrackableErrors: IUntrackableErrors[] = [
		{
			name: 'Conteúdo já existe',
			key: 'ALREADY_EXISTS: entity already exists',
			message: 'O conteúdo a ser criado já existe',
			httpCode: 401,
		},
	];

	catch(exception: Error, host: ArgumentsHost) {
		const context = host.switchToHttp();
		const response = context.getResponse<Response>();

		const error = this.untrackableErrors.find((item) => {
			return exception?.message?.includes(item.key);
		});

		if (error) {
			this.logger.error({
				name: `${error.name} - ${exception.name}`,
				description: error.message,
				stack: exception.stack,
			});

			return response.status(error.httpCode).json({
				statusCode: error.httpCode,
				message: error.message,
			});
		}

		this.logger.error({
			name: `Erro interno do servidor ${exception?.name}`,
			description: exception?.message ?? 'Causa desconhecida',
			stack: exception?.stack ?? 'Causa desconhecida',
		});

		return response.status(500).json({
			statusCode: 500,
			message: 'Erro interno do servidor',
		});
	}
}
