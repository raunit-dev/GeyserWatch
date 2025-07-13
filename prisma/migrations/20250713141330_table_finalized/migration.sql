/*
  Warnings:

  - The `signature` column on the `buy_transactions` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `signature` column on the `sell_transactions` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "buy_transactions" DROP COLUMN "signature",
ADD COLUMN     "signature" BYTEA;

-- AlterTable
ALTER TABLE "sell_transactions" DROP COLUMN "signature",
ADD COLUMN     "signature" BYTEA;

-- CreateIndex
CREATE UNIQUE INDEX "buy_transactions_signature_key" ON "buy_transactions"("signature");

-- CreateIndex
CREATE UNIQUE INDEX "sell_transactions_signature_key" ON "sell_transactions"("signature");
