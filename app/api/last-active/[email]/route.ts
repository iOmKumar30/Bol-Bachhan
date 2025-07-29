import prisma from "@/libs/prismadb";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ email: string }> }
) {
  const { email } = await params;

  try {
    const user = await prisma.user.findUnique({
      where: { email: decodeURIComponent(email) },
      select: { lastActiveAt: true },
    });

    return NextResponse.json(user?.lastActiveAt ?? null);
  } catch (error) {
    console.error("Failed to fetch last seen:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
