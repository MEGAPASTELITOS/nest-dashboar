import { Status } from "@prisma/client";
import { IsEnum, IsNotEmpty, IsNumberString, IsString } from "class-validator";

export class CreateInvoiceDto {
  @IsNumberString()
  amount: string;
  @IsEnum(Status)
  status: Status;
  @IsString()
  @IsNotEmpty()
  date: string;
}
