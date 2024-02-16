import { Injectable, NotFoundException } from "@nestjs/common";

import { PrismaService } from "@src/core/prisma/prisma.service";

import { CreateRevenueDto } from "./dto/create-revenue.dto";
import { UpdateRevenueDto } from "./dto/update-revenue.dto";

@Injectable()
export class RevenueService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.revenue.findMany();
  }

  async findOne(id: string) {
    const revenue = await this.prisma.revenue.findUnique({
      where: { month: id },
    });

    if (!revenue) throw new NotFoundException("revenue not exist");

    return revenue;
  }
  async create(dto: CreateRevenueDto) {
    return await this.prisma.revenue.create({ data: dto });
  }

  async update(id: string, dto: UpdateRevenueDto) {
    await this.findOne(id);

    return await this.prisma.revenue.update({
      where: { month: id },
      data: dto,
    });
  }

  async remove(id: string) {
    return await this.prisma.revenue.delete({ where: { month: id } });
  }
}
