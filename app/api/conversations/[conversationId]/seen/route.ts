import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/libs/prismadb";
import { pusherServer } from "@/libs/pusher";
import { NextResponse } from "next/server";
interface parameters {
  conversationId: string;
}

export async function POST(
  req: Request,
  props: { params: Promise<parameters> }
) {
  const params = await props.params;
  try {
    const currentUser = await getCurrentUser();
    const { conversationId } = params;

    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse("Login required", { status: 401 });
    }

    if (!conversationId) {
      return new NextResponse("Invalid ID", { status: 400 });
    }

    const conversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        messages: {
          include: {
            seen: true,
          },
        },
        users: true,
      },
    });

    if (!conversation) {
      return new NextResponse("Invalid ID", { status: 404 });
    }

    const lastMsg = conversation.messages[conversation.messages.length - 1];

    if (!lastMsg) {
      return NextResponse.json(conversation);
    }

    const updatedMsg = await prisma.message.update({
      where: {
        id: lastMsg.id,
      },
      include: {
        seen: true,
        sender: true,
      },
      data: {
        seen: {
          connect: {
            id: currentUser.id,
          },
        },
      },
    });

    await pusherServer.trigger(currentUser.email, "conversation:update", {
      id: conversationId,
      messages: [updatedMsg],
    });

    if (lastMsg.seenIds.indexOf(currentUser.id) !== -1) {
      return NextResponse.json(conversation);
    }

    await pusherServer.trigger(conversationId, "message:update", updatedMsg);

    return NextResponse.json(updatedMsg);
  } catch (error) {
    return new NextResponse(String(error), { status: 500 });
  }
}
