import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GenericErrorFilter } from '@presentation/filters/generic.filter';
import { HealthCheckErrorFilter } from '@presentation/filters/healthCheck.filter';
import { PrismaErrorFilter } from '@presentation/filters/prisma.filter';
import { ClassValidatorErrorFilter } from '@presentation/filters/classValidator.filter';
import { NotFoundFilter } from '@presentation/filters/notFound.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { LoggerAdapter } from '@infra/adapters/logger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule, {
		bufferLogs: true,
	});

	app.useGlobalPipes(new ValidationPipe());
	app.enableShutdownHooks();
	app.enableCors({
		origin: '*',
		methods: ['POST'],
	});

	const logger = app.get(LoggerAdapter);

	const config = new DocumentBuilder()
		.setTitle('API Test')
		.setDescription('Lorem ipsum dolor sit ammet')
		.setVersion('1.0')
		.addTag('apitest')
		.build();

	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api', app, document);

	app.useGlobalFilters(new GenericErrorFilter(logger));
	app.useGlobalFilters(new HealthCheckErrorFilter());
	app.useGlobalFilters(new PrismaErrorFilter(logger));
	app.useGlobalFilters(new ClassValidatorErrorFilter(logger));
	app.useGlobalFilters(new NotFoundFilter(logger));

	const PORT = process.env.PORT ?? 3000;
	await app.listen(PORT);
}

bootstrap();
