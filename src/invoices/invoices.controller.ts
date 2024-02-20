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
import { InvoicesReturn } from "./types/type";

@Controller()
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Get("invoices")
  async findAll(@Query() querys: Querys): Promise<InvoicesReturn> {
    if (querys.amount)
      return this.invoicesService.findByAllAmount(querys.amount);

    if (querys.date) return this.invoicesService.findByAllDate(querys.date);

    if (querys.status)
      return this.invoicesService.findByAllStatus(querys.status);

    if (querys.name) {
      return this.invoicesService.findByAllNameCustomer(querys.name);
    }

    if (querys.email) {
      return this.invoicesService.findByAllEmailCustomer(querys.email);
    }

    if (querys.skip && querys.take) {
      return this.invoicesService.findAll(
        Number(querys.skip),
        Number(querys.take),
      );
    }

    if (querys.skip) {
      return this.invoicesService.findAll(Number(querys.skip));
    }

    if (querys.take) {
      return this.invoicesService.findAll(Number(querys.take));
    }

    return this.invoicesService.findAll();
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
