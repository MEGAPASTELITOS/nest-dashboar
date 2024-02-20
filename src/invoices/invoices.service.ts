import { Injectable, NotFoundException } from "@nestjs/common";
import { Status } from "@prisma/client";

import { PrismaService } from "@src/core/prisma/prisma.service";

import { CustomersService } from "../customers/customers.service";
import { CreateInvoiceDto } from "./dto/create-invoice.dto";
import { UpdateInvoiceDto } from "./dto/update-invoice.dto";
import {
  InvoicesReturn,
  InvoicesReturnData,
  InvoicesWithCustomers,
} from "./types/type";

@Injectable()
export class InvoicesService {
  constructor(
    private readonly prisma: PrismaService,
    private customersService: CustomersService,
  ) {}

  async findAll(skip?: number, take?: number): Promise<InvoicesReturn> {
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
      skip: skip,
      take: take,
      orderBy: {
        date: "asc",
      },
    });

    const pages = await this.prisma.invoices.count();

    if (take) {
      const data = await this.formatReturInvoices(invoices);
      const totalPage = Math.ceil(pages / take);

      return { data: data, filters: "none", length: pages, totalPage };
    }

    const data = await this.formatReturInvoices(invoices);

    return { data, filters: "none", length: pages };
  }

  async findByAllAmount(amount: string): Promise<InvoicesReturn> {
    const invoices = await this.prisma.invoices.findMany({
      where: {
        amount: {
          contains: amount,
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

    const pages = await this.prisma.invoices.count({
      where: {
        amount: {
          contains: amount,
        },
        deletedAt: undefined,
      },
    });
    const data = await this.formatReturInvoices(invoices);

    return { data, filters: "amount", length: pages };
  }

  async findByAllNameCustomer(name: string): Promise<InvoicesReturn> {
    const invoices = await this.prisma.invoices.findMany({
      where: {
        customers: {
          name: {
            contains: name,
            mode: "insensitive",
          },
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

    const pages = await this.prisma.invoices.count({
      where: {
        customers: {
          name: {
            contains: name,
            mode: "insensitive",
          },
        },
        deletedAt: undefined,
      },
    });
    const data = await this.formatReturInvoices(invoices);

    return { data, filters: "name", length: pages };
  }

  async findByAllDate(date: string): Promise<InvoicesReturn> {
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

    const pages = await this.prisma.invoices.count({
      where: {
        date: {
          equals: date,
        },
        deletedAt: undefined,
      },
    });
    const data = await this.formatReturInvoices(invoices);

    return { data, filters: "date", length: pages };
  }

  async findByAllEmailCustomer(email: string): Promise<InvoicesReturn> {
    const invoices = await this.prisma.invoices.findMany({
      where: {
        customers: {
          email: {
            contains: email,
            mode: "insensitive",
          },
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

    const pages = await this.prisma.invoices.count({
      where: {
        customers: {
          email: {
            contains: email,
            mode: "insensitive",
          },
        },
        deletedAt: undefined,
      },
    });
    const data = await this.formatReturInvoices(invoices);

    return { data, filters: "email", length: pages };
  }

  async findByAllStatus(status: Status): Promise<InvoicesReturn> {
    const invoices = await this.prisma.invoices.findMany({
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

    const pages = await this.prisma.invoices.count({
      where: {
        status: status,
        deletedAt: undefined,
      },
    });
    const data = await this.formatReturInvoices(invoices);

    return { data, filters: "status", length: pages };
  }

  async findOne(id: number): Promise<InvoicesReturn> {
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

    const data = await this.formatReturInvoices(invoice);

    return { data, filters: "status", length: 1 };
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
  ): Promise<InvoicesReturnData | InvoicesReturnData[]> {
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
                name: invoice.customers.name,
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
            name: invoice.customers.name,
          },
        };
  }
}
