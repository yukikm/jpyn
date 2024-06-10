-- CreateTable
CREATE TABLE "Bank" (
    "id" SERIAL NOT NULL,
    "hashedAccount" TEXT NOT NULL,
    "branchNo" TEXT NOT NULL,
    "accountTypeCode" TEXT NOT NULL,
    "accountNo" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Bank_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Bank_hashedAccount_key" ON "Bank"("hashedAccount");
