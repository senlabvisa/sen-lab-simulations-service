import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class RubricCriterionInput {
  @IsString()
  @MinLength(1)
  @MaxLength(40)
  id!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(160)
  label!: string;

  @IsInt()
  @Min(1)
  @Max(100)
  maxScore!: number;

  @IsOptional()
  @IsString()
  @MaxLength(400)
  description?: string;
}

export class RubricTemplateInput {
  @IsArray()
  @ArrayMaxSize(20)
  @ValidateNested({ each: true })
  @Type(() => RubricCriterionInput)
  criteria!: RubricCriterionInput[];
}

const SUBJECTS = ['Maths', 'Physique-Chimie', 'SVT'] as const;

export class CreateSimulationInput {
  @IsString()
  @MinLength(2)
  @MaxLength(160)
  title!: string;

  @IsString()
  @IsIn(SUBJECTS as unknown as string[])
  subject!: (typeof SUBJECTS)[number];

  @IsString()
  @MinLength(2)
  @MaxLength(40)
  targetGrade!: string;

  @IsString()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { message: 'slug must be kebab-case lowercase' })
  @MinLength(2)
  @MaxLength(120)
  slug!: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => RubricTemplateInput)
  rubricTemplate?: RubricTemplateInput;
}

export class UpdateSimulationInput {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(160)
  title?: string;

  @IsOptional()
  @IsString()
  @IsIn(SUBJECTS as unknown as string[])
  subject?: (typeof SUBJECTS)[number];

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(40)
  targetGrade?: string;

  @IsOptional()
  @IsString()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { message: 'slug must be kebab-case lowercase' })
  @MinLength(2)
  @MaxLength(120)
  slug?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => RubricTemplateInput)
  rubricTemplate?: RubricTemplateInput;
}

export class ListSimulationsQuery {
  @IsOptional()
  @IsString()
  @IsIn(SUBJECTS as unknown as string[])
  subject?: (typeof SUBJECTS)[number];

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(40)
  targetGrade?: string;
}
