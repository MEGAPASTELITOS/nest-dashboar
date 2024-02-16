import { IsNotEmpty, IsString, IsUrl } from "class-validator";

export class CreateCustomerDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsUrl()
  @IsNotEmpty()
  image_url: string;
}
