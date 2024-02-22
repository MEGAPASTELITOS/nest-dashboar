import { Injectable, NotFoundException } from "@nestjs/common";
import { Customers } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

import { PrismaService } from "@src/core/prisma/prisma.service";

import { CreateCustomerDto } from "./dto/create-customer.dto";
import { UpdateCustomerDto } from "./dto/update-customer.dto";

@Injectable()
export class CustomersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const result = await this.prisma.customers.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        image_url: true,
        invoices: {
          select: {
            id: true,
            amount: true,
            status: true,
          },
        },
      },
    });

    return result.map(customer => {
      const total_invoices = customer.invoices.length;
      const total_pending = customer.invoices.reduce(
        (sum, invoice) =>
          invoice.status === "PENDING"
            ? sum + Number.parseFloat(invoice.amount)
            : sum,
        0,
      );
      const total_paid = customer.invoices.reduce(
        (sum, invoice) =>
          invoice.status === "PAID"
            ? sum + Number.parseFloat(invoice.amount)
            : sum,
        0,
      );

      const { invoices, ...customerWithoutInvoices } = customer;

      return {
        ...customerWithoutInvoices,
        total_invoices,
        total_pending,
        total_paid,
      };
    });
  }

  private formatCurrency(amount: number) {
    return (amount / 100).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  }

  async findAllByEmail(email: string) {
    const customers = await this.prisma.customers.findMany({
      where: {
        email: {
          contains: email,

          mode: "insensitive",
        },

        deletedAt: undefined,
      },
    });

    return await this.FormatReturCustomers(customers);
  }

  async findAllByName(name: string) {
    const customers = await this.prisma.customers.findMany({
      where: {
        name: {
          contains: name,

          mode: "insensitive",
        },

        deletedAt: undefined,
      },
    });

    return await this.FormatReturCustomers(customers);
  }

  async findOne(id: number) {
    const customer = await this.prisma.customers.findUnique({
      where: {
        id: id,
      },
    });

    if (!customer) throw new NotFoundException("customer by id not fount");

    return await this.FormatReturCustomers(customer);
  }

  async create(dto: CreateCustomerDto) {
    await this.findCustomerEmailUnique(dto.email);

    const customer = await this.prisma.customers.create({ data: dto });

    return await this.FormatReturCustomers(customer);
  }

  async update(id: number, dto: UpdateCustomerDto) {
    if (dto.email) await this.findCustomerEmailUnique(dto.email);

    const customer = await this.prisma.customers.update({
      where: { id: id },
      data: dto,
    });

    return await this.FormatReturCustomers(customer);
  }

  async remove(id: number) {
    const user = await this.findOne(id);

    const newOnique = this.newKeysUniquesForCustomerDelete(user[0].email);

    return this.prisma.customers.update({
      where: { id },

      data: {
        deletedAt: new Date(),

        email: newOnique.newUniqueEmail,
      },
    });
  }

  private newKeysUniquesForCustomerDelete(email: string) {
    const newUniqueEmail = `${email}-${uuidv4()}`;

    return {
      newUniqueEmail,
    };
  }

  private async FormatReturCustomers(user: Customers | Customers[]) {
    return Array.isArray(user)
      ? Promise.all(
          user.map(user => {
            return {
              id: user.id,

              createdAt: user.createdAt,

              updatedAt: user.updatedAt,

              image_url: user.image_url,

              email: user.email,

              name: user.name,
            };
          }),
        )
      : [
          {
            id: user.id,

            createdAt: user.createdAt,

            updatedAt: user.updatedAt,

            image_url: user.image_url,

            email: user.email,

            name: user.name,
          },
        ];
  }

  private async findCustomerEmailUnique(email: string) {
    const customerWitUsername = await this.prisma.customers.findUnique({
      where: {
        email: email,
      },
    });

    if (customerWitUsername)
      throw new NotFoundException("customer by email already exist");
  }
}
