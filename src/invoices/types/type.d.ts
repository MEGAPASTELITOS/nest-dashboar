import { Prisma, Status } from "@prisma/client";

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

export interface InvoicesReturn {
  data: InvoicesReturnData | InvoicesReturnData[];
  length: number;
  totalPage?: number;
  filters: string;
}

export interface InvoicesReturnData {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  amount: string;
  status: Status;
  date: string;
  customers: {
    image_url: string;
    email: string;
    name: string;
  };
}
