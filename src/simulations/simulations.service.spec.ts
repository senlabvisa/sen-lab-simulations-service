import { Test } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { SimulationsService } from './simulations.service';
import { PrismaService } from '../prisma/prisma.service';

describe('SimulationsService', () => {
  let service: SimulationsService;
  const prismaMock = {
    simulation: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module = await Test.createTestingModule({
      providers: [SimulationsService, { provide: PrismaService, useValue: prismaMock }],
    }).compile();
    service = module.get(SimulationsService);
  });

  const row = (over: Partial<Record<string, unknown>> = {}) => ({
    id: 's1',
    title: "Loi d'Ohm",
    subject: 'Physique-Chimie',
    targetGrade: '3eme',
    slug: 'loi-dohm-3eme',
    createdAt: new Date('2026-01-01T00:00:00Z'),
    updatedAt: new Date('2026-01-01T00:00:00Z'),
    ...over,
  });

  describe('create', () => {
    it('creates a simulation and returns DTO', async () => {
      prismaMock.simulation.create.mockResolvedValueOnce(row());
      const dto = await service.create({
        title: "Loi d'Ohm",
        subject: 'Physique-Chimie',
        targetGrade: '3eme',
        slug: 'loi-dohm-3eme',
      });
      expect(prismaMock.simulation.create).toHaveBeenCalledWith({
        data: {
          title: "Loi d'Ohm",
          subject: 'Physique-Chimie',
          targetGrade: '3eme',
          slug: 'loi-dohm-3eme',
        },
      });
      expect(dto).toEqual({
        id: 's1',
        title: "Loi d'Ohm",
        subject: 'Physique-Chimie',
        targetGrade: '3eme',
        slug: 'loi-dohm-3eme',
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
      });
    });

    it('throws ConflictException on duplicate slug (P2002)', async () => {
      prismaMock.simulation.create.mockRejectedValueOnce(
        Object.assign(new Error('unique'), { code: 'P2002' }),
      );
      await expect(
        service.create({
          title: 'X',
          subject: 'Maths',
          targetGrade: '6eme',
          slug: 'x',
        }),
      ).rejects.toBeInstanceOf(ConflictException);
    });
  });

  describe('findAll', () => {
    it('lists all sorted by subject asc, title asc', async () => {
      prismaMock.simulation.findMany.mockResolvedValueOnce([row(), row({ id: 's2' })]);
      const list = await service.findAll();
      expect(prismaMock.simulation.findMany).toHaveBeenCalledWith({
        orderBy: [{ subject: 'asc' }, { title: 'asc' }],
      });
      expect(list).toHaveLength(2);
    });

    it('filters by subject', async () => {
      prismaMock.simulation.findMany.mockResolvedValueOnce([]);
      await service.findAll({ subject: 'Maths' });
      expect(prismaMock.simulation.findMany).toHaveBeenCalledWith({
        where: { subject: 'Maths' },
        orderBy: [{ subject: 'asc' }, { title: 'asc' }],
      });
    });

    it('filters by targetGrade', async () => {
      prismaMock.simulation.findMany.mockResolvedValueOnce([]);
      await service.findAll({ targetGrade: '3eme' });
      expect(prismaMock.simulation.findMany).toHaveBeenCalledWith({
        where: { targetGrade: '3eme' },
        orderBy: [{ subject: 'asc' }, { title: 'asc' }],
      });
    });
  });

  describe('findById', () => {
    it('returns when found', async () => {
      prismaMock.simulation.findUnique.mockResolvedValueOnce(row());
      const dto = await service.findById('s1');
      expect(prismaMock.simulation.findUnique).toHaveBeenCalledWith({ where: { id: 's1' } });
      expect(dto.id).toBe('s1');
    });

    it('throws NotFoundException when missing', async () => {
      prismaMock.simulation.findUnique.mockResolvedValueOnce(null);
      await expect(service.findById('nope')).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('findBySlug', () => {
    it('returns when slug exists', async () => {
      prismaMock.simulation.findUnique.mockResolvedValueOnce(row());
      const dto = await service.findBySlug('loi-dohm-3eme');
      expect(prismaMock.simulation.findUnique).toHaveBeenCalledWith({
        where: { slug: 'loi-dohm-3eme' },
      });
      expect(dto.slug).toBe('loi-dohm-3eme');
    });

    it('throws NotFoundException when missing', async () => {
      prismaMock.simulation.findUnique.mockResolvedValueOnce(null);
      await expect(service.findBySlug('nope')).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('update', () => {
    it('updates title and returns DTO', async () => {
      prismaMock.simulation.update.mockResolvedValueOnce(row({ title: 'New' }));
      const dto = await service.update('s1', { title: 'New' });
      expect(prismaMock.simulation.update).toHaveBeenCalledWith({
        where: { id: 's1' },
        data: { title: 'New' },
      });
      expect(dto.title).toBe('New');
    });

    it('throws NotFoundException when id missing (P2025)', async () => {
      prismaMock.simulation.update.mockRejectedValueOnce(
        Object.assign(new Error('gone'), { code: 'P2025' }),
      );
      await expect(service.update('ghost', { title: 'x' })).rejects.toBeInstanceOf(NotFoundException);
    });

    it('throws ConflictException when updating to an existing slug (P2002)', async () => {
      prismaMock.simulation.update.mockRejectedValueOnce(
        Object.assign(new Error('dupe'), { code: 'P2002' }),
      );
      await expect(service.update('s1', { slug: 'taken' })).rejects.toBeInstanceOf(ConflictException);
    });
  });

  describe('remove', () => {
    it('deletes', async () => {
      prismaMock.simulation.delete.mockResolvedValueOnce(row());
      await expect(service.remove('s1')).resolves.toBeUndefined();
      expect(prismaMock.simulation.delete).toHaveBeenCalledWith({ where: { id: 's1' } });
    });

    it('throws NotFoundException when id missing (P2025)', async () => {
      prismaMock.simulation.delete.mockRejectedValueOnce(
        Object.assign(new Error('gone'), { code: 'P2025' }),
      );
      await expect(service.remove('ghost')).rejects.toBeInstanceOf(NotFoundException);
    });
  });
});
