# sen-lab-simulations-service

> 🧪 **Catalogue des TPs (simulations)** Sen Lab Visa.

**Port** : `3006` · **Schéma BDD** : `simulations_svc`

---

## Rôle

Gère le **catalogue des TPs virtuels** disponibles dans Sen Lab Visa, alignés sur le programme officiel sénégalais.

Chaque simulation expose :
- **Métadonnées** : titre, matière (Maths / PC / SVT), niveau cible
- **Slug** unique (ex: `loi-ohm-3eme`) qui correspond à un module React côté front
- **Rubrique d'évaluation** (`RubricTemplate`) : critères pondérés pour l'évaluation enseignant

## Endpoints

| Méthode | Route | Rôles |
|---|---|---|
| `GET`  | `/simulations` | tous (auth) |
| `GET`  | `/simulations/by-slug/:slug` | tous (auth) |
| `POST` | `/simulations` | sysadmin |
| `PATCH`| `/simulations/:id` | sysadmin |
| `DELETE`| `/simulations/:id` | sysadmin |

## Seed automatique

Le service seed automatiquement **3 TPs pilotes** au démarrage Docker (idempotent) :

| Slug | Titre | Matière | Niveau |
|---|---|---|---|
| `loi-ohm-3eme` | Loi d'Ohm — Compteur Woyofal et résistance d'une LED | Physique-Chimie | 3ème |
| `photosynthese-4eme` | Photosynthèse — Élodée, lumière et bulles d'oxygène | SVT | 4ème |
| `pythagore-4eme` | Théorème de Pythagore — La corde 3-4-5 du maçon de Thiès | Maths | 4ème |

Chaque TP est ancré dans un **contexte sénégalais** pour rendre la science palpable.

---

## Modèle

```ts
SimulationDto {
  id            string
  title         string
  subject       'Maths' | 'Physique-Chimie' | 'SVT'
  targetGrade   string         // ex: "3eme"
  slug          string         // ex: "loi-ohm-3eme"
  rubricTemplate?: RubricTemplate
  createdAt     DateTime
  updatedAt     DateTime
}

RubricTemplate {
  criteria: RubricCriterion[]  // [{id, label, maxScore, description}]
}
```

## Stack

- **NestJS 10**
- **Prisma 5** (PostgreSQL)

## Variables d'environnement

```env
PORT=3006
DATABASE_URL=postgresql://senlab:...@postgres:5432/senlab?schema=simulations_svc
JWT_SECRET=...
```

## Lancement

```bash
pnpm install
pnpm prisma:generate
pnpm start:dev
```

## Lien parent

🔗 [`sen-lab-infra`](https://github.com/senlabvisa/sen-lab-infra)
