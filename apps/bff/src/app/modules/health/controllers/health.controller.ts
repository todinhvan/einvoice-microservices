import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HealthService } from '../services/health.service';
import { HealthCheck } from '@nestjs/terminus';

@Controller()
@ApiTags('Health Checks')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get('liveness')
  @HealthCheck()
  checkLive() {
    return this.healthService.checkMemoryHeap();
  }

  @Get('readiness')
  @HealthCheck()
  checkReady() {
    return this.healthService.checkReadiness();
  }

  @Get('startup')
  @HealthCheck()
  checkStartup() {
    return this.healthService.checkStartup();
  }
}
