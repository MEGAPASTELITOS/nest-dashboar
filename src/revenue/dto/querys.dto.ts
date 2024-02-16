import { IsOptional, IsString } from "class-validator";

export class Querys {
  @IsString()
  @IsOptional()
  month: string;
  @IsString()
  @IsOptional()
  revenue: string;
}
