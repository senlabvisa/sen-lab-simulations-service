import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Catalogue pédagogique Sen Lab Visa.
 *
 * Couvre les 3 grandes matières STEM × les 7 niveaux du programme sénégalais
 * (6ème → Terminale). Chaque TP est ancré dans un contexte local.
 *
 * Le rubricTemplate (rubrique d'évaluation) est défini sur les TPs qui ont
 * déjà un module pédagogique implémenté côté front (les autres seront
 * complétés au fur et à mesure du développement).
 */

type Seed = {
  title: string;
  subject: 'Maths' | 'Physique-Chimie' | 'SVT';
  targetGrade: string;
  slug: string;
  rubricTemplate?: {
    criteria: Array<{ id: string; label: string; maxScore: number; description?: string }>;
  };
};

const STANDARD_RUBRIC = {
  criteria: [
    { id: 'demarche', label: 'Démarche scientifique', maxScore: 25, description: 'Respect des étapes : hypothèse, expérience, conclusion.' },
    { id: 'mesures', label: 'Précision des mesures', maxScore: 25, description: 'Qualité et cohérence des données collectées.' },
    { id: 'analyse', label: 'Analyse et interprétation', maxScore: 25, description: 'Lien entre observations et concepts du cours.' },
    { id: 'rapport', label: 'Qualité du rapport', maxScore: 25, description: 'Clarté, structure, schémas si pertinents.' },
  ],
};

const SEEDS: Seed[] = [
  // ============================================================
  // MATHÉMATIQUES (∑)
  // ============================================================
  {
    title: 'Numération et opérations',
    subject: 'Maths',
    targetGrade: '6eme',
    slug: 'numeration-6eme',
  },
  {
    title: 'Périmètres et aires',
    subject: 'Maths',
    targetGrade: '6eme',
    slug: 'perimetres-aires-6eme',
  },
  {
    title: 'Fractions et nombres décimaux',
    subject: 'Maths',
    targetGrade: '5eme',
    slug: 'fractions-decimaux-5eme',
  },
  {
    title: 'Symétrie axiale',
    subject: 'Maths',
    targetGrade: '5eme',
    slug: 'symetrie-axiale-5eme',
  },
  {
    title: 'Théorème de Pythagore',
    subject: 'Maths',
    targetGrade: '4eme',
    slug: 'theoreme-pythagore-4eme',
    rubricTemplate: STANDARD_RUBRIC,
  },
  {
    title: 'Théorème de Thalès',
    subject: 'Maths',
    targetGrade: '4eme',
    slug: 'theoreme-thales-4eme',
  },
  {
    title: 'Fonctions affines — tarif Senelec',
    subject: 'Maths',
    targetGrade: '3eme',
    slug: 'fonctions-affines-3eme',
    rubricTemplate: STANDARD_RUBRIC,
  },
  {
    title: 'Trigonométrie dans le triangle rectangle',
    subject: 'Maths',
    targetGrade: '3eme',
    slug: 'trigonometrie-3eme',
  },
  {
    title: 'Vecteurs et translations',
    subject: 'Maths',
    targetGrade: 'seconde',
    slug: 'vecteurs-2nde',
  },
  {
    title: 'Statistiques descriptives — sondage de classe',
    subject: 'Maths',
    targetGrade: 'seconde',
    slug: 'statistiques-2nde',
  },
  {
    title: 'Dérivation et tangente',
    subject: 'Maths',
    targetGrade: 'premiere',
    slug: 'derivees-1ere',
  },
  {
    title: 'Probabilités conditionnelles',
    subject: 'Maths',
    targetGrade: 'premiere',
    slug: 'probabilites-1ere',
  },
  {
    title: 'Suites numériques et limites',
    subject: 'Maths',
    targetGrade: 'terminale',
    slug: 'suites-terminale',
  },
  {
    title: 'Intégration et calcul d\'aire',
    subject: 'Maths',
    targetGrade: 'terminale',
    slug: 'integration-terminale',
  },

  // ============================================================
  // SCIENCES PHYSIQUES (⚛︎) — Physique-Chimie
  // ============================================================
  {
    title: 'États de la matière — eau du Saloum',
    subject: 'Physique-Chimie',
    targetGrade: '6eme',
    slug: 'etats-matiere-6eme',
    rubricTemplate: STANDARD_RUBRIC,
  },
  {
    title: 'Mélanges et solutions — bissap, tamarin, café Touba',
    subject: 'Physique-Chimie',
    targetGrade: '5eme',
    slug: 'melanges-solutions-5eme',
  },
  {
    title: 'Circuits électriques simples',
    subject: 'Physique-Chimie',
    targetGrade: '5eme',
    slug: 'circuits-simples-5eme',
  },
  {
    title: 'Air et pression atmosphérique',
    subject: 'Physique-Chimie',
    targetGrade: '4eme',
    slug: 'air-pression-4eme',
  },
  {
    title: 'Optique — lentilles et focales',
    subject: 'Physique-Chimie',
    targetGrade: '4eme',
    slug: 'optique-lentilles-4eme',
  },
  {
    title: 'Molécule d\'eau (H₂O) en 3D',
    subject: 'Physique-Chimie',
    targetGrade: '4eme',
    slug: 'molecule-eau-4eme',
    rubricTemplate: STANDARD_RUBRIC,
  },
  {
    title: 'Loi d\'Ohm — Compteur Woyofal et résistance d\'une LED',
    subject: 'Physique-Chimie',
    targetGrade: '3eme',
    slug: 'loi-dohm-3eme',
    rubricTemplate: STANDARD_RUBRIC,
  },
  {
    title: 'Cinématique — vitesse et accélération',
    subject: 'Physique-Chimie',
    targetGrade: '3eme',
    slug: 'cinematique-3eme',
  },
  {
    title: 'Forces et équilibre — pont de Foundiougne',
    subject: 'Physique-Chimie',
    targetGrade: 'seconde',
    slug: 'forces-equilibre-2nde',
  },
  {
    title: 'Tableau périodique — éléments du sel marin',
    subject: 'Physique-Chimie',
    targetGrade: 'seconde',
    slug: 'tableau-periodique-2nde',
  },
  {
    title: 'Énergie mécanique et travail',
    subject: 'Physique-Chimie',
    targetGrade: 'premiere',
    slug: 'energie-mecanique-1ere',
  },
  {
    title: 'Dosage acide-base — vinaigre vs bicarbonate',
    subject: 'Physique-Chimie',
    targetGrade: 'premiere',
    slug: 'dosage-acide-base-1ere',
  },
  {
    title: 'Mécanique de Newton — chute libre du baobab',
    subject: 'Physique-Chimie',
    targetGrade: 'terminale',
    slug: 'mecanique-newton-terminale',
  },
  {
    title: 'Cinétique chimique — vitesse de réaction',
    subject: 'Physique-Chimie',
    targetGrade: 'terminale',
    slug: 'cinetique-chimique-terminale',
  },

  // ============================================================
  // SVT (🌱)
  // ============================================================
  {
    title: 'Classification du vivant — faune du Niokolo-Koba',
    subject: 'SVT',
    targetGrade: '6eme',
    slug: 'classification-vivant-6eme',
    rubricTemplate: STANDARD_RUBRIC,
  },
  {
    title: 'Environnement — mangrove du Saloum',
    subject: 'SVT',
    targetGrade: '6eme',
    slug: 'mangrove-saloum-6eme',
    rubricTemplate: STANDARD_RUBRIC,
  },
  {
    title: 'Respiration humaine et capacité pulmonaire',
    subject: 'SVT',
    targetGrade: '5eme',
    slug: 'respiration-5eme',
  },
  {
    title: 'Circulation sanguine — cœur et vaisseaux',
    subject: 'SVT',
    targetGrade: '5eme',
    slug: 'circulation-sanguine-5eme',
  },
  {
    title: 'Photosynthèse — Élodée, lumière et bulles d\'oxygène',
    subject: 'SVT',
    targetGrade: '4eme',
    slug: 'photosynthese-4eme',
    rubricTemplate: STANDARD_RUBRIC,
  },
  {
    title: 'Reproduction des plantes à fleurs — pollinisation',
    subject: 'SVT',
    targetGrade: '4eme',
    slug: 'reproduction-plantes-4eme',
  },
  {
    title: 'Génétique — lois de Mendel',
    subject: 'SVT',
    targetGrade: '3eme',
    slug: 'genetique-mendel-3eme',
  },
  {
    title: 'Système immunitaire — défense contre le paludisme',
    subject: 'SVT',
    targetGrade: '3eme',
    slug: 'systeme-immunitaire-3eme',
  },
  {
    title: 'Cellule animale vs végétale — microscope virtuel',
    subject: 'SVT',
    targetGrade: 'seconde',
    slug: 'cellule-animale-vegetale-2nde',
  },
  {
    title: 'ADN — extraction depuis la banane',
    subject: 'SVT',
    targetGrade: 'seconde',
    slug: 'adn-extraction-2nde',
  },
  {
    title: 'Tectonique des plaques — failles du Sahel',
    subject: 'SVT',
    targetGrade: 'premiere',
    slug: 'tectonique-plaques-1ere',
  },
  {
    title: 'Évolution des espèces — adaptations au climat aride',
    subject: 'SVT',
    targetGrade: 'premiere',
    slug: 'evolution-especes-1ere',
  },
  {
    title: 'Génétique moléculaire — du gène à la protéine',
    subject: 'SVT',
    targetGrade: 'terminale',
    slug: 'genetique-moleculaire-terminale',
  },
  {
    title: 'Climat et atmosphère — réchauffement au Sénégal',
    subject: 'SVT',
    targetGrade: 'terminale',
    slug: 'climat-terminale',
  },
];

async function main() {
  let created = 0;
  let skipped = 0;

  for (const sim of SEEDS) {
    const existing = await prisma.simulation.findUnique({ where: { slug: sim.slug } });
    if (existing) {
      console.log(`Skip (déjà présent): ${sim.slug}`);
      skipped++;
      continue;
    }
    await prisma.simulation.create({
      data: {
        title: sim.title,
        subject: sim.subject,
        targetGrade: sim.targetGrade,
        slug: sim.slug,
        ...(sim.rubricTemplate ? { rubricTemplate: sim.rubricTemplate as object } : {}),
      },
    });
    console.log(`Créé: ${sim.title} (${sim.slug})`);
    created++;
  }

  console.log('');
  console.log(`Total : ${created} créé(s), ${skipped} déjà présent(s), ${SEEDS.length} dans le catalogue.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
