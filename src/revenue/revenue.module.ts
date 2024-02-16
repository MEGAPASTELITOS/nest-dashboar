import { Module } from "@nestjs/common";

import { PrismaModule } from "@src/core/prisma/prisma.module";

import { RevenueController } from "./revenue.controller";
import { RevenueService } from "./revenue.service";

@Module({
  controllers: [RevenueController],
  providers: [RevenueService],
  imports: [PrismaModule],
})
export class RevenueModule {}
