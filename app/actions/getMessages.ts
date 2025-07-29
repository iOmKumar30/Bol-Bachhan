import prisma from "@/libs/prismadb";

const getMessages = async (conversationId: string) => {
  try {
    const messages = await prisma.message.findMany({
      where: {
        conversationId: conversationId,
      },
      include: {
        sender: true,
        seen: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
    return messages;
  } catch (_error) {
    if (process.env.NODE_ENV === "development") {
      console.error(_error);
    }
    return [];
  }
};

export default getMessages;
