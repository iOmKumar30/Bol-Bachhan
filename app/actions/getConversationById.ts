import prisma from "@/libs/prismadb";

import getCurrentUser from "./getCurrentUser";

const getConversationById = async (conversationId: string) => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser?.id) {
      return null;
    }
    const conversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        users: true,
      },
    });
    return conversation;
  } catch (_error) {
    if (process.env.NODE_ENV === "development") {
      console.error(_error);
    }
    return null;
  }
};

export default getConversationById;
