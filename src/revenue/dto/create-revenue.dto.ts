import { IsNotEmpty, IsString } from "class-validator";

export class CreateRevenueDto {
  @IsString()
  @IsNotEmpty()
  month: string;
  @IsString()
  @IsNotEmpty()
  revenue: string;
}
