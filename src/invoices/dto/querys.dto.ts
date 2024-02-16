import { Status } from "@prisma/client";
import { IsEnum, IsNumberString, IsOptional, IsString } from "class-validator";

export class Querys {
  @IsNumberString()
  @IsOptional()
  amount: string;
  @IsEnum(Status)
  @IsOptional()
  status: Status;
  @IsString()
  @IsOptional()
  date: string;
}
