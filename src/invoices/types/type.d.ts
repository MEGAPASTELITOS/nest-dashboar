import { Prisma } from "@prisma/client";

export type InvoicesWithCustomers = Prisma.InvoicesGetPayload<{
  select: {
    customers: true;
    amount: true;
    createdAt: true;
    date: true;
    id: true;
    updatedAt: true;
    status: true;
    customersId: true;
    deletedAt: true;
  };
}>;
