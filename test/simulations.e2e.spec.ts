import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AuthGuard } from '@nestjs/passport';
import request from 'supertest';
import { SimulationsModule } from '../src/simulations/simulations.module';
import { SimulationsService } from '../src/simulations/simulations.service';
import { PrismaService } from '../src/prisma/prisma.service';

class FakeAuthGuard {
  constructor(private readonly role: string) {}
  canActivate(ctx: any) {
    const req = ctx.switchToHttp().getRequest();
    req.user = { userId: '00000000-0000-4000-8000-000000000000', role: this.role };
    return true;
  }
}

const UUID_A = '11111111-1111-4111-9111-111111111111';
const sample = () => ({
  id: UUID_A,
  title: "Loi d'Ohm",
  subject: 'Physique-Chimie' as const,
  targetGrade: '3eme',
  slug: 'loi-dohm-3eme',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
});

async function buildApp(role: 'admin' | 'teacher' | 'student') {
  const moduleRef = await Test.createTestingModule({
    imports: [SimulationsModule],
  })
    .overrideProvider(PrismaService).useValue({})
    .overrideProvider(SimulationsService).useValue({
      create: jest.fn().mockResolvedValue(sample()),
      findAll: jest.fn().mockResolvedValue([sample()]),
      findById: jest.fn().mockResolvedValue(sample()),
      findBySlug: jest.fn().mockResolvedValue(sample()),
      update: jest.fn().mockResolvedValue({ ...sample(), title: 'New' }),
      remove: jest.fn().mockResolvedValue(undefined),
    })
    .overrideGuard(AuthGuard('jwt')).useValue(new FakeAuthGuard(role))
    .compile();

  const app: INestApplication = moduleRef.createNestApplication();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  await app.init();
  return app;
}

describe('Simulations HTTP (e2e)', () => {
  let app: INestApplication;
  afterEach(async () => { if (app) await app.close(); });

  it('GET /simulations/health — public', async () => {
    app = await buildApp('student');
    await request(app.getHttpServer())
      .get('/simulations/health')
      .expect(200)
      .expect({ status: 'ok', service: 'simulations-service' });
  });

  it('GET /simulations — authenticated returns list', async () => {
    app = await buildApp('student');
    await request(app.getHttpServer()).get('/simulations').expect(200);
  });

  it('GET /simulations?subject=Maths — filter passes through', async () => {
    app = await buildApp('student');
    await request(app.getHttpServer()).get('/simulations?subject=Maths').expect(200);
  });

  it('GET /simulations?subject=Bogus — validation 400', async () => {
    app = await buildApp('student');
    await request(app.getHttpServer()).get('/simulations?subject=Bogus').expect(400);
  });

  it('GET /simulations/slug/loi-dohm-3eme — returns the sim', async () => {
    app = await buildApp('teacher');
    await request(app.getHttpServer())
      .get('/simulations/slug/loi-dohm-3eme')
      .expect(200);
  });

  it('POST /simulations — admin succeeds', async () => {
    app = await buildApp('admin');
    await request(app.getHttpServer())
      .post('/simulations')
      .send({
        title: "Loi d'Ohm",
        subject: 'Physique-Chimie',
        targetGrade: '3eme',
        slug: 'loi-dohm-3eme',
      })
      .expect(201);
  });

  it('POST /simulations — teacher forbidden', async () => {
    app = await buildApp('teacher');
    await request(app.getHttpServer())
      .post('/simulations')
      .send({
        title: 'X',
        subject: 'Maths',
        targetGrade: '6eme',
        slug: 'x',
      })
      .expect(403);
  });

  it('POST /simulations — validation rejects non-kebab slug', async () => {
    app = await buildApp('admin');
    await request(app.getHttpServer())
      .post('/simulations')
      .send({
        title: 'Bad slug',
        subject: 'Maths',
        targetGrade: '6eme',
        slug: 'Bad_Slug',
      })
      .expect(400);
  });

  it('PATCH /simulations/:id — admin succeeds', async () => {
    app = await buildApp('admin');
    await request(app.getHttpServer())
      .patch(`/simulations/${UUID_A}`)
      .send({ title: 'New' })
      .expect(200);
  });

  it('DELETE /simulations/:id — admin returns 204', async () => {
    app = await buildApp('admin');
    await request(app.getHttpServer()).delete(`/simulations/${UUID_A}`).expect(204);
  });

  it('DELETE /simulations/:id — student forbidden', async () => {
    app = await buildApp('student');
    await request(app.getHttpServer()).delete(`/simulations/${UUID_A}`).expect(403);
  });

  it('GET /simulations/:id — rejects non-UUID', async () => {
    app = await buildApp('student');
    await request(app.getHttpServer()).get('/simulations/not-a-uuid').expect(400);
  });
});
