import prisma from "@/libs/prismadb";
import getSession from "./getSession";

const getUsers = async () => {
  const session = await getSession();
  if (!session?.user?.email) {
    return;
  }
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
      where: {
        // I don't want the current user to be in the list
        NOT: {
          email: session.user.email,
        },
      },
    });
    return users;
  } catch (_error) {
    if (process.env.NODE_ENV === "development") {
      console.error(_error);
    }
    return;
  }
};

export default getUsers;
