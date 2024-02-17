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

import { CreateInvoiceDto } from "./dto/create-invoice.dto";
import { Params } from "./dto/params.dto";
import { Querys } from "./dto/querys.dto";
import { UpdateInvoiceDto } from "./dto/update-invoice.dto";
import { InvoicesService } from "./invoices.service";

@Controller()
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Get("invoices")
  async findAll(@Query() querys: Querys) {
    if (querys.amount)
      return await this.invoicesService.findByAllAmount(querys.amount);

    if (querys.date)
      return await this.invoicesService.findByAllDate(querys.date);

    if (querys.status)
      return await this.invoicesService.findByAllStatus(querys.status);

    if (querys.skip) {
      return await this.invoicesService.findAll(Number(querys.skip));
    }

    if (querys.name)
      return await this.invoicesService.findByAllNameCustomer(querys.name);

    if (querys.email)
      return await this.invoicesService.findByAllNameCustomer(querys.email);

    if (querys.take) {
      return await this.invoicesService.findAll(Number(querys.take));
    }

    if (querys.skip && querys.take) {
      return await this.invoicesService.findAll(
        Number(querys.skip),
        Number(querys.take),
      );
    }

    return await this.invoicesService.findAll();
  }

  @Get("invoices/:id")
  async findOne(@Param("id") id: string) {
    return await this.invoicesService.findOne(+id);
  }

  @Post("customers/:customerId/invoices")
  async create(@Body() dto: CreateInvoiceDto, @Param() param: Params) {
    return await this.invoicesService.create(+param.customerId, dto);
  }

  @Patch("invoices/:id")
  async update(@Param("id") id: string, @Body() dto: UpdateInvoiceDto) {
    return await this.invoicesService.update(+id, dto);
  }

  @Delete("invoices/:id")
  async remove(@Param("id") id: string) {
    return await this.invoicesService.remove(+id);
  }
}
