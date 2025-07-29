import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/libs/prismadb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const currentUser = await getCurrentUser();

  const emailToUpdate = body.email || currentUser?.email;
  if (!emailToUpdate) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  await prisma.user.update({
    where: { email: emailToUpdate },
    data: {
      lastActiveAt: new Date(),
    },
  });

  return NextResponse.json({ success: true });
}
