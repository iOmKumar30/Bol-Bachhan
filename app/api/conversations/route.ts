import getCurrentUser from "@/app/actions/getCurrentUser";

import prisma from "@/libs/prismadb";
import { pusherServer } from "@/libs/pusher";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser();
    const body = await req.json();
    const { userId, isGroup, members, name } = body;

    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse("Login required", { status: 401 });
    }

    if (isGroup && (!members || members.length < 2 || !name)) {
      return new NextResponse("Invalid data", { status: 400 });
    }

    if (isGroup) {
      const newConv = await prisma.conversation.create({
        data: {
          name,
          isGroup,
          users: {
            connect: [
              ...members.map((member: { value: string }) => ({
                id: member.value,
              })),
              {
                id: currentUser.id,
              },
            ],
          },
        },
        include: {
          users: true,
        },
      });

      newConv.users.forEach((user) => {
        if (user.email) {
          pusherServer.trigger(user.email, "conversation:new", newConv);
        }
      });
      return NextResponse.json(newConv);
    }

    // for one to one chat
    // check if the conversation already exist
    const existingConversations = await prisma.conversation.findMany({
      where: {
        OR: [
          {
            userIds: {
              equals: [currentUser.id, userId],
            },
          },
          {
            userIds: {
              equals: [userId, currentUser.id],
            },
          },
        ],
      },
    });

    const finalConv = existingConversations[0];

    if (finalConv) {
      return NextResponse.json(finalConv);
    }

    const newConv = await prisma.conversation.create({
      data: {
        userIds: [currentUser.id, userId],
        users: {
          connect: [
            {
              id: currentUser.id,
            },
            {
              id: userId,
            },
          ],
        },
      },
      include: {
        users: true,
      },
    });

    newConv.users.forEach((user) => {
      if (user.email) {
        pusherServer.trigger(user.email, "conversation:new", newConv);
      }
    });

    return NextResponse.json(newConv);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return new NextResponse(error.message, { status: 500 });
    } else {
      // handle other types of errors
      console.error("Unknown error:", error);
      return new NextResponse("Internal Server Error", { status: 500 });
    }
  }
}
