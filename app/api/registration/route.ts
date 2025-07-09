import bcrypt from "bcrypt";
import prisma from "@/libs/prismadb";
import { NextResponse } from "next/server";
import formSchema from "@/utils/zod/FormSchema";
import { z } from "zod";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = formSchema.safeParse(body);

    if (!result.success) {
      return new NextResponse("Invalid input", { status: 400 });
    }

    const { name, email, password } = result.data;

    if (!name || !email || !password) {
      return new NextResponse("Incomplete Data", { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        hashedPassword,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.log(error);
    return new NextResponse(String(error), { status: 500 });
  }
}
