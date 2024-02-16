import { IsNumberString, IsOptional, IsString } from "class-validator";

export class Params {
  @IsString()
  customerId: string;

  @IsOptional()
  @IsNumberString()
  id: number;
}
