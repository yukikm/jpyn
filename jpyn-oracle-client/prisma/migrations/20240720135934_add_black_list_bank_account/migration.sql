-- CreateTable
CREATE TABLE "BlackListBankAccount" (
    "id" SERIAL NOT NULL,
    "hashedAccount" TEXT NOT NULL,
    "branchNo" TEXT NOT NULL,
    "accountTypeCode" TEXT NOT NULL,
    "accountNo" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BlackListBankAccount_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BlackListBankAccount_hashedAccount_key" ON "BlackListBankAccount"("hashedAccount");
