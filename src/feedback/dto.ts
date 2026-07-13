import {
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";

export class CreateFeedbackDto {
  @IsEmail({}, { message: "A valid email is required" })
  @MaxLength(254)
  email!: string;

  @IsString()
  @MinLength(2, { message: "Full name is too short" })
  @MaxLength(120)
  fullName!: string;

  @IsString()
  @MinLength(5, { message: "Please add a little more detail" })
  @MaxLength(5000)
  content!: string;

  /** Honeypot — real users never fill this hidden field. */
  @IsOptional()
  @IsString()
  website?: string;
}

export class UpdateFeedbackDto {
  @IsIn(["new", "read", "resolved"])
  status!: "new" | "read" | "resolved";
}
