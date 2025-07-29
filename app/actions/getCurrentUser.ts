import prisma from "@/libs/prismadb";

import getSession from "./getSession";

const getCurrentUser = async () => {
  try {
    const session = await getSession();
    if (!session?.user?.email) {
      return null;
    }
    const currentUser = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });
    if (!currentUser) {
      return null;
    }
    return currentUser;
  } catch (_error) {
    if (process.env.NODE_ENV === "development") {
      console.error(_error);
    }
    return null;
  }
};

export default getCurrentUser;
