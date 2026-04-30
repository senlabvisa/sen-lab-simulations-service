import { Module } from '@nestjs/common';
import { SimulationsController } from './simulations.controller';
import { SimulationsService } from './simulations.service';
import { RolesGuard } from './roles.guard';

@Module({
  controllers: [SimulationsController],
  providers: [SimulationsService, RolesGuard],
})
export class SimulationsModule {}
