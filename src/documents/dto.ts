import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from "class-validator";

export class CreateDocumentDto {
  @IsString()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: "slug must be kebab-case (lowercase, hyphens)",
  })
  @MaxLength(80)
  slug!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(160)
  title!: string;

  @IsString()
  @MaxLength(400)
  description!: string;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  eyebrow?: string;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  group?: string;

  @IsOptional()
  @IsInt()
  order?: number;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsBoolean()
  published?: boolean;
}

export class UpdateDocumentDto {
  @IsOptional()
  @IsString()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: "slug must be kebab-case (lowercase, hyphens)",
  })
  @MaxLength(80)
  slug?: string;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(400)
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  eyebrow?: string;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  group?: string;

  @IsOptional()
  @IsInt()
  order?: number;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsBoolean()
  published?: boolean;
}
