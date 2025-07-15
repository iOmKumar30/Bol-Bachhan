import { User } from "@prisma/client";
import { CompleteConversationType } from "../types";
import { useSession } from "next-auth/react";
import { useMemo } from "react";

const useOtherUsers = (
  conversation:
    | CompleteConversationType
    | {
        users: User[];
      }
) => {
  const session = useSession();

  const otherUsers = useMemo(() => {
    const currentUserEmail = session.data?.user?.email;

    // we don't try to find until session is loaded else our own acc will be rendered for moment due to inavailibility of currentUserEmail
    if (!currentUserEmail) return null;

    return conversation.users.find((user) => user.email !== currentUserEmail);
  }, [conversation.users, session.data?.user?.email]);

  return otherUsers;
};

export default useOtherUsers;
