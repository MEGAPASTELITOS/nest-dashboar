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
    const customers = await this.prisma.customers.findMany({
      where: {
        deletedAt: undefined,
      },
    });

    return await this.FormatReturCustomers(customers);
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
