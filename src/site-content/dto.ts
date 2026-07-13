import { IsDefined, IsObject } from "class-validator";

export class UpsertSiteContentDto {
  /** Arbitrary JSON object for this section (home, nav, footer, general). */
  @IsDefined()
  @IsObject()
  value!: Record<string, unknown>;
}
