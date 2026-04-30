import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import type {
  CreateSimulationDto,
  RubricTemplate,
  SimulationDto,
} from '@senlabvisa/shared-types';
import { PrismaService } from '../prisma/prisma.service';

type SimulationRow = {
  id: string;
  title: string;
  subject: string;
  targetGrade: string;
  slug: string;
  rubricTemplate: unknown;
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class SimulationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: CreateSimulationDto): Promise<SimulationDto> {
    try {
      const row = await this.prisma.simulation.create({
        data: {
          title: input.title,
          subject: input.subject,
          targetGrade: input.targetGrade,
          slug: input.slug,
          ...(input.rubricTemplate !== undefined
            ? { rubricTemplate: input.rubricTemplate as unknown as Prisma.InputJsonValue }
            : {}),
        },
      });
      return this.toDto(row);
    } catch (err) {
      if ((err as { code?: string }).code === 'P2002') {
        throw new ConflictException('Slug already in use');
      }
      throw err;
    }
  }

  async findAll(filters: { subject?: string; targetGrade?: string } = {}): Promise<SimulationDto[]> {
    const where: { subject?: string; targetGrade?: string } = {};
    if (filters.subject) where.subject = filters.subject;
    if (filters.targetGrade) where.targetGrade = filters.targetGrade;

    const args: {
      where?: typeof where;
      orderBy: Array<{ subject?: 'asc'; title?: 'asc' }>;
    } = {
      orderBy: [{ subject: 'asc' }, { title: 'asc' }],
    };
    if (Object.keys(where).length > 0) args.where = where;

    const rows = await this.prisma.simulation.findMany(args);
    return rows.map((r) => this.toDto(r));
  }

  async findById(id: string): Promise<SimulationDto> {
    const row = await this.prisma.simulation.findUnique({ where: { id } });
    if (!row) throw new NotFoundException('Simulation not found');
    return this.toDto(row);
  }

  async findBySlug(slug: string): Promise<SimulationDto> {
    const row = await this.prisma.simulation.findUnique({ where: { slug } });
    if (!row) throw new NotFoundException('Simulation not found');
    return this.toDto(row);
  }

  async update(id: string, input: Partial<CreateSimulationDto>): Promise<SimulationDto> {
    const data: Prisma.SimulationUpdateInput = {};
    if (input.title !== undefined) data.title = input.title;
    if (input.subject !== undefined) data.subject = input.subject;
    if (input.targetGrade !== undefined) data.targetGrade = input.targetGrade;
    if (input.slug !== undefined) data.slug = input.slug;
    if (input.rubricTemplate !== undefined) {
      data.rubricTemplate = input.rubricTemplate as unknown as Prisma.InputJsonValue;
    }
    try {
      const row = await this.prisma.simulation.update({ where: { id }, data });
      return this.toDto(row);
    } catch (err) {
      const code = (err as { code?: string }).code;
      if (code === 'P2025') throw new NotFoundException('Simulation not found');
      if (code === 'P2002') throw new ConflictException('Slug already in use');
      throw err;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.prisma.simulation.delete({ where: { id } });
    } catch (err) {
      if ((err as { code?: string }).code === 'P2025') {
        throw new NotFoundException('Simulation not found');
      }
      throw err;
    }
  }

  private toDto(r: SimulationRow): SimulationDto {
    return {
      id: r.id,
      title: r.title,
      subject: r.subject as SimulationDto['subject'],
      targetGrade: r.targetGrade,
      slug: r.slug,
      ...(r.rubricTemplate ? { rubricTemplate: r.rubricTemplate as RubricTemplate } : {}),
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
    };
  }
}
