import { authOptions } from "@/libs/auth";
import { pusherServer } from "@/libs/pusher";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return new NextResponse("Not authenticated", {
      status: 401,
      headers: {
        "Access-Control-Allow-Origin": "*", 
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  const body = await req.json();
  const socketId = body.socket_id;
  const channel = body.channel_name;

  const data = {
    user_id: session.user.email,
  };

  const authResponse = pusherServer.authorizeChannel(socketId, channel, data);

  return new NextResponse(JSON.stringify(authResponse), {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
