import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/libs/prismadb";
import { pusherServer } from "@/libs/pusher";
import { NextResponse } from "next/server";
interface IParams {
  conversationId: string;
}
export async function DELETE(req: Request, { params }: { params: IParams }) {
  try {
    const { conversationId } = params;
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

    existingConversation.users.forEach((user) => {
      if (user.email) {
        pusherServer.trigger(
          user.email,
          "conversation:remove",
          existingConversation
        );
      }
    });
    return NextResponse.json(deletedConversation);
  } catch (error) {
    console.error("Error deleting conversation:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
