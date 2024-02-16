import { Module } from "@nestjs/common";

import { PrismaModule } from "@src/core/prisma/prisma.module";

import { CustomersController } from "./customers.controller";
import { CustomersService } from "./customers.service";

@Module({
  controllers: [CustomersController],

  providers: [CustomersService],

  imports: [PrismaModule],

  exports: [CustomersService],
})
export class CustomersModule {}
