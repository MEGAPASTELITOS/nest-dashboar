import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";

import { CustomersService } from "./customers.service";
import { CreateCustomerDto } from "./dto/create-customer.dto";
import { Querys } from "./dto/querys.dto";
import { UpdateCustomerDto } from "./dto/update-customer.dto";

@Controller("customers")
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  async findAll(@Query() query: Querys) {
    if (query.email)
      return await this.customersService.findAllByEmail(query.email);

    if (query.name)
      return await this.customersService.findAllByName(query.name);

    return await this.customersService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return await this.customersService.findOne(+id);
  }

  @Post()
  async create(@Body() createCustomerDto: CreateCustomerDto) {
    return await this.customersService.create(createCustomerDto);
  }

  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    return await this.customersService.update(+id, updateCustomerDto);
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    return await this.customersService.remove(Number(id));
  }
}
