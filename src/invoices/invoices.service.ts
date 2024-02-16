import { Injectable, NotFoundException } from "@nestjs/common";
import { Status } from "@prisma/client";

import { PrismaService } from "@src/core/prisma/prisma.service";

import { CustomersService } from "../customers/customers.service";
import { CreateInvoiceDto } from "./dto/create-invoice.dto";
import { UpdateInvoiceDto } from "./dto/update-invoice.dto";
import { InvoicesWithCustomers } from "./types/type";

@Injectable()
export class InvoicesService {
  constructor(
    private readonly prisma: PrismaService,
    private customersService: CustomersService,
  ) {}

  async findAll() {
    const invoices = await this.prisma.invoices.findMany({
      where: { deletedAt: undefined },
      select: {
        customers: true,
        amount: true,
        createdAt: true,
        date: true,
        id: true,
        updatedAt: true,
        status: true,
        customersId: true,
        deletedAt: true,
      },
    });

    return await this.formatReturInvoices(invoices);
  }

  async findByAllAmount(amount: number) {
    const invoices = await this.prisma.invoices.findMany({
      where: {
        amount: {
          gt: amount,
        },
        deletedAt: undefined,
      },
      select: {
        customers: true,
        amount: true,
        createdAt: true,
        date: true,
        id: true,
        updatedAt: true,
        status: true,
        customersId: true,
        deletedAt: true,
      },
    });

    return await this.formatReturInvoices(invoices);
  }

  async findByAllDate(date: string) {
    const invoices = await this.prisma.invoices.findMany({
      where: {
        date: {
          equals: date,
        },
        deletedAt: undefined,
      },
      select: {
        customers: true,
        amount: true,
        createdAt: true,
        date: true,
        id: true,
        updatedAt: true,
        status: true,
        customersId: true,
        deletedAt: true,
      },
    });

    return await this.formatReturInvoices(invoices);
  }

  async findByAllStatus(status: Status) {
    const invoice = await this.prisma.invoices.findMany({
      where: {
        status: status,
        deletedAt: undefined,
      },
      select: {
        customers: true,
        amount: true,
        createdAt: true,
        date: true,
        id: true,
        updatedAt: true,
        status: true,
        customersId: true,
        deletedAt: true,
      },
    });

    return await this.formatReturInvoices(invoice);
  }

  async findOne(id: number) {
    const invoice = await this.prisma.invoices.findUnique({
      where: { id: id },
      select: {
        customers: true,
        amount: true,
        createdAt: true,
        date: true,
        id: true,
        updatedAt: true,
        status: true,
        customersId: true,
        deletedAt: true,
      },
    });

    if (!invoice) throw new NotFoundException("invoice by id not fount");

    return await this.formatReturInvoices(invoice);
  }

  async create(customerId: number, dto: CreateInvoiceDto) {
    await this.customersService.findOne(customerId);

    const invoice = await this.prisma.invoices.create({
      data: {
        ...dto,
        customersId: customerId,
      },
      select: {
        customers: true,
        amount: true,
        createdAt: true,
        date: true,
        id: true,
        updatedAt: true,
        status: true,
        customersId: true,
        deletedAt: true,
      },
    });

    return await this.formatReturInvoices(invoice);
  }

  async update(id: number, dto: UpdateInvoiceDto) {
    const invoice = await this.prisma.invoices.update({
      where: {
        id: id,
      },
      data: {
        ...dto,
      },
      select: {
        customers: true,
        amount: true,
        createdAt: true,
        date: true,
        id: true,
        updatedAt: true,
        status: true,
        customersId: true,
        deletedAt: true,
      },
    });

    return await this.formatReturInvoices(invoice);
  }

  async remove(id: number) {
    const invoice = await this.prisma.invoices.update({
      where: {
        id: id,
      },
      data: {
        deletedAt: undefined,
      },
      select: {
        customers: true,
        amount: true,
        createdAt: true,
        date: true,
        id: true,
        updatedAt: true,
        status: true,
        customersId: true,
        deletedAt: true,
      },
    });

    return await this.formatReturInvoices(invoice);
  }

  private async formatReturInvoices(
    invoice: InvoicesWithCustomers | InvoicesWithCustomers[],
  ) {
    return Array.isArray(invoice)
      ? Promise.all(
          invoice.map(invoice => {
            return {
              id: invoice.id,
              createdAt: invoice.createdAt,
              updatedAt: invoice.updatedAt,
              amount: invoice.amount,
              status: invoice.status,
              date: invoice.date,
              customers: {
                image_url: invoice.customers.image_url,
                email: invoice.customers.email,
              },
            };
          }),
        )
      : {
          id: invoice.id,
          createdAt: invoice.createdAt,
          updatedAt: invoice.updatedAt,
          amount: invoice.amount,
          status: invoice.status,
          date: invoice.date,
          customers: {
            image_url: invoice.customers.image_url,
            email: invoice.customers.email,
          },
        };
  }
}
