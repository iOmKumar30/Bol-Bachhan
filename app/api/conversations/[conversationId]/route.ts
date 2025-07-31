import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/libs/prismadb";
import { pusherServer } from "@/libs/pusher";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ conversationId: string }> }
) {
  try {
    const { conversationId } = await context.params;

    if (!conversationId) {
      return new NextResponse("Invalid ID", { status: 400 });
    }

    const currentUser = await getCurrentUser();
    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse("Login required", { status: 401 });
    }

    const existingConversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        users: true,
      },
    });

    if (!existingConversation) {
      return new NextResponse("Invalid ID", { status: 404 });
    }

    const deletedConversation = await prisma.conversation.deleteMany({
      where: {
        id: conversationId,
        userIds: {
          hasSome: [currentUser.id],
        },
      },
    });

    for (const user of existingConversation.users) {
      if (user.email) {
        await pusherServer.trigger(
          user.email,
          "conversation:remove",
          existingConversation
        );
      }
    }

    return NextResponse.json(deletedConversation);
  } catch (error) {
    console.error("Error deleting conversation:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
