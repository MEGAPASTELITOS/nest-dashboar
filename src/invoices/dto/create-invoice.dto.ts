import { Status } from "@prisma/client";
import { IsEnum, IsInt, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateInvoiceDto {
  @IsNumber()
  @IsInt()
  amount: number;
  @IsEnum(Status)
  status: Status;
  @IsString()
  @IsNotEmpty()
  date: string;
}
