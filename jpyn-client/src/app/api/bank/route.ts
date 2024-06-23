import { NextRequest, NextResponse } from "next/server";

import { PrismaClient } from "../../../../../jpyn-oracle-client/node_modules/.prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const { address, hashedAccount, branchNo, accountTypeCode, accountNo } =
    await req.json();

  const res = await prisma.bank.create({
    data: {
      address: address,
      hashedAccount: hashedAccount,
      branchNo: branchNo,
      accountTypeCode: accountTypeCode,
      accountNo: accountNo,
    },
  });
  return NextResponse.json(res);
}

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const query = params.get("address");

  const res = await prisma.bank.findMany({
    where: {
      address: query!,
    },
  });
  return NextResponse.json({ res: res });
}
