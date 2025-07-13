-- CreateTable
CREATE TABLE "buy_transactions" (
    "id" TEXT NOT NULL,
    "signature" TEXT NOT NULL,
    "mint" TEXT NOT NULL,
    "amount" TEXT NOT NULL,
    "maxSolCost" TEXT,
    "slot" TEXT NOT NULL,
    "mintAuthority" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "buy_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sell_transactions" (
    "id" TEXT NOT NULL,
    "signature" TEXT NOT NULL,
    "mint" TEXT NOT NULL,
    "amount" TEXT NOT NULL,
    "minSolOutput" TEXT,
    "slot" TEXT NOT NULL,
    "mintAuthority" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sell_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "buy_transactions_signature_key" ON "buy_transactions"("signature");

-- CreateIndex
CREATE UNIQUE INDEX "sell_transactions_signature_key" ON "sell_transactions"("signature");
