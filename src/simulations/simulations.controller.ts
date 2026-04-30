import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { SimulationDto } from '@senlabvisa/shared-types';
import { SimulationsService } from './simulations.service';
import { CreateSimulationInput, ListSimulationsQuery, UpdateSimulationInput } from './dto';
import { Roles, RolesGuard } from './roles.guard';

@Controller('simulations')
export class SimulationsController {
  constructor(private readonly svc: SimulationsService) {}

  @Get('health')
  health() {
    return { status: 'ok', service: 'simulations-service' };
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  findAll(@Query() query: ListSimulationsQuery): Promise<SimulationDto[]> {
    return this.svc.findAll({
      ...(query.subject ? { subject: query.subject } : {}),
      ...(query.targetGrade ? { targetGrade: query.targetGrade } : {}),
    });
  }

  @Get('slug/:slug')
  @UseGuards(AuthGuard('jwt'))
  findBySlug(@Param('slug') slug: string): Promise<SimulationDto> {
    return this.svc.findBySlug(slug);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  findOne(@Param('id', new ParseUUIDPipe()) id: string): Promise<SimulationDto> {
    return this.svc.findById(id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('sysadmin', 'admin')
  create(@Body() input: CreateSimulationInput): Promise<SimulationDto> {
    return this.svc.create(input);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('sysadmin', 'admin')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() input: UpdateSimulationInput,
  ): Promise<SimulationDto> {
    return this.svc.update(id, input);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('sysadmin', 'admin')
  @HttpCode(204)
  remove(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    return this.svc.remove(id);
  }
}
