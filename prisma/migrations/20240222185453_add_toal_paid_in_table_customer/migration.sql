/*
  Warnings:

  - You are about to drop the column `totalPaid` on the `Invoices` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Customers" ADD COLUMN     "totalPaid" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Invoices" DROP COLUMN "totalPaid";
