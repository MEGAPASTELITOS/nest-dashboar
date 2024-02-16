import { IsOptional, IsString } from "class-validator";

export class Querys {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  email: string;
}
