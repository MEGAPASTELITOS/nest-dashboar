import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { HealthModule } from "@core/health/health.module";
import { LoggerModule } from "@core/logger/logger.module";

import { CustomersModule } from "./customers/customers.module";
import { RevenueModule } from "./revenue/revenue.module";
import { UsersModule } from "./users/users.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true }),
    LoggerModule,
    HealthModule,
    UsersModule,
    RevenueModule,
    CustomersModule,
  ],
})
export class AppModule {}
