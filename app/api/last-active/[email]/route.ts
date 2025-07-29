import prisma from "@/libs/prismadb";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: { email: string } }
) {
  try {
    const user = await prisma.user.findUnique({
      where: { email: decodeURIComponent(params.email) },
      select: { lastActiveAt: true },
    });

    return NextResponse.json(user?.lastActiveAt ?? null);
  } catch (error) {
    console.error("Failed to fetch last seen:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
