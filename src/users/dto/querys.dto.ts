import { IsOptional, IsString } from "class-validator";

export class Querys {
  @IsOptional()
  @IsString()
  username: string | undefined;

  @IsOptional()
  @IsString()
  email: string | undefined;
}
