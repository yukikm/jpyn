import { NextRequest, NextResponse } from "next/server";

import { PrismaClient } from "../../../../../jpyn-oracle-client/node_modules/.prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { hashedAccount, branchNo, accountTypeCode, accountNo } =
      await req.json();

    const res = await prisma.blackListBankAccount.create({
      data: {
        hashedAccount: hashedAccount,
        branchNo: branchNo,
        accountTypeCode: accountTypeCode,
        accountNo: accountNo,
      },
    });
    return NextResponse.json(res);
  } catch (error) {
    return NextResponse.json({ error: error });
  }
}

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const query = params.get("hashedAccount");

  const res = await prisma.blackListBankAccount.findMany({
    where: {
      hashedAccount: query!,
    },
  });
  return NextResponse.json({ res: res });
}
