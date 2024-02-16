import { Controller, Get } from '@nestjs/common';
import {
	HealthCheck,
	HealthCheckService,
	HttpHealthIndicator,
	MemoryHealthIndicator,
	PrismaHealthIndicator,
} from '@nestjs/terminus';
import { PrismaService } from '@infra/storages/db/prisma/prisma.service';

@Controller('health')
export class HealthController {
	constructor(
		private readonly http: HttpHealthIndicator,
		private readonly health: HealthCheckService,
		private readonly mem: MemoryHealthIndicator,
		private readonly prismaIndicator: PrismaHealthIndicator,
		private readonly prismaService: PrismaService,
	) {}

	@Get()
	@HealthCheck()
	check() {
		const max_mem_heap = parseInt(`${process.env.MAX_MEMORY_HEAP}`);
		const max_mem_rss = parseInt(`${process.env.MAX_MEMORY_RSS}`);
		const url = String(process.env.HEALTH_HTTP_PING);

		return this.health.check([
			() => this.http.pingCheck('http_request', url),
			() => this.mem.checkHeap('memory_heap', max_mem_heap),
			() => this.mem.checkRSS('memory_rss', max_mem_rss),
			() =>
				this.prismaIndicator.pingCheck(
					'prisma_client',
					this.prismaService,
				),
		]);
	}
}
