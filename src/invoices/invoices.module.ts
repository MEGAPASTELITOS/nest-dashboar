import { Module } from "@nestjs/common";

import { PrismaModule } from "@src/core/prisma/prisma.module";

import { CustomersModule } from "../customers/customers.module";
import { InvoicesController } from "./invoices.controller";
import { InvoicesService } from "./invoices.service";

@Module({
  controllers: [InvoicesController],
  providers: [InvoicesService],
  imports: [PrismaModule, CustomersModule],
})
export class InvoicesModule {}
