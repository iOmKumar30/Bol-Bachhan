"use client";
import { CompleteConversationType } from "@/app/types";
import clsx from "clsx";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";

import useOtherUsers from "@/app/hooks/useOtherUsers";
import Avatar from "./Avatar";
import AvatarGroup from "./AvatarGroup";
import ConvoSkeleton from "./ConvoSkeleton";

const ConversationBox = ({
  data,
  selected,
}: {
  data: CompleteConversationType;
  selected?: boolean;
}) => {
  const otherUsers = useOtherUsers(data);
  const session = useSession();
  const router = useRouter();

  const handleClick = useCallback(() => {
    router.push(`/conversations/${data.id}`);
  }, [router, data.id]);

  /////////////////////////////////////
  const lastMsg = useMemo(() => {
    const messages = data.messages || [];
    return messages[messages.length - 1];
  }, [data.messages]);

  ////////////////////////////////////
  const userEmail = useMemo(() => {
    return session.data?.user?.email;
  }, [session.data?.user?.email]);

  ////////////////////////////////////
  const hasSeen = useMemo(() => {
    if (!lastMsg) {
      return false;
    }

    const seenArray = lastMsg.seen || [];

    if (!userEmail) {
      return false;
    }

    return seenArray.filter((user) => user.email === userEmail).length !== 0;
  }, [userEmail, lastMsg]);

  ////////////////////////////////////

  const lastMsgText = useMemo(() => {
    if (lastMsg?.image) {
      return "[ ◉¯] Image";
    }

    if (lastMsg?.body) {
      return lastMsg.body;
    }

    return "Started a conversation";
  }, [lastMsg]);

  if (!otherUsers) {
    return <ConvoSkeleton />;
  }

  return (
    <div
      onClick={handleClick}
      className={clsx(
        "w-full flex items-center space-x-4 p-3 rounded-xl transition-all duration-200 cursor-pointer group hover:border-b-1",
        selected
          ? "bg-orange-100 shadow-md"
          : "bg-white hover:bg-orange-50 hover:shadow-sm"
      )}
    >
      {data.isGroup ? <AvatarGroup users={data.users} /> : <Avatar user={otherUsers!} />}
      <div className="flex-1 min-w-0">
        <div className="focus:outline-none">
          <div className="flex justify-between items-center mb-0.5">
            <p className="text-sm font-medium text-gray-800 group-hover:text-orange-600 transition-colors duration-150">
              {data.name || otherUsers?.name}
            </p>
            {lastMsg?.createdAt && (
              <p className="text-xs text-gray-400 font-light">
                {format(new Date(lastMsg.createdAt), "pp")}
              </p>
            )}
          </div>
          <p
            className={clsx(
              "text-xs text-black truncate font-bold",
              hasSeen || lastMsg?.sender?.email === userEmail
                ? "font-normal"
                : "font-bold"
            )}
          >
            {lastMsgText}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConversationBox;
