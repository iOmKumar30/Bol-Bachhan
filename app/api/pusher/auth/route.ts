import { authOptions } from "@/libs/auth";
import { pusherServer } from "@/libs/pusher";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return new NextResponse("Not authenticated", { status: 401 });
  }

  const formData = await req.formData();
  const socketId = formData.get("socket_id") as string;
  const channel = formData.get("channel_name") as string;

  if (!socketId || !channel) {
    return new NextResponse("Missing socket_id or channel_name", {
      status: 400,
    });
  }

  const authResponse = pusherServer.authorizeChannel(socketId, channel, {
    user_id: session.user.email,
  });

  return new NextResponse(JSON.stringify(authResponse), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
