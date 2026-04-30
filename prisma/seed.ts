import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const SEEDS = [
  {
    title: "Loi d'Ohm",
    subject: 'Physique-Chimie',
    targetGrade: '3eme',
    slug: 'loi-dohm-3eme',
  },
  {
    title: 'Photosynthèse',
    subject: 'SVT',
    targetGrade: '4eme',
    slug: 'photosynthese-4eme',
  },
  {
    title: 'Théorème de Pythagore',
    subject: 'Maths',
    targetGrade: '4eme',
    slug: 'theoreme-pythagore-4eme',
  },
];

async function main() {
  for (const sim of SEEDS) {
    const existing = await prisma.simulation.findUnique({ where: { slug: sim.slug } });
    if (existing) {
      console.log(`Skip (déjà présent): ${sim.slug}`);
      continue;
    }
    await prisma.simulation.create({ data: sim });
    console.log(`Créé: ${sim.title} (${sim.slug})`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
