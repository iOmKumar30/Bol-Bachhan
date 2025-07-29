"use client";
import useConversation from "@/app/hooks/useConversation";
import { CompleteConversationType } from "@/app/types";
import { pusherClient } from "@/libs/pusher";
import { User } from "@prisma/client";
import clsx from "clsx";
import { find } from "lodash";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import { MdOutlineGroupAdd } from "react-icons/md";
import ConversationBox from "./ConversationBox";
import GroupChatModal from "./GroupChatModal";
const ConversationList = ({
  existingConversations,
  users,
}: {
  existingConversations: CompleteConversationType[];
  users: User[];
}) => {
  const session = useSession();
  const [conversations, setConversations] = useState(existingConversations);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);

  const { conversationId, isOpen } = useConversation();
  const pusherKey = useMemo(() => {
    return session.data?.user?.email;
  }, [session.data?.user?.email]);

  useEffect(() => {
    if (!pusherKey) return;

    const convoHandler = (conversation: CompleteConversationType) => {
      setConversations((current) => {
        if (find(current, { id: conversation.id })) {
          return current;
        } else {
          return [conversation, ...current];
        }
      });
    };

    const updateHandler = (conversation: CompleteConversationType) => {
      setConversations((current) =>
        current.map((currentConvo) => {
          if (currentConvo.id === conversation.id) {
            return {
              ...currentConvo,
              messages: conversation.messages,
            };
          }
          return currentConvo;
        })
      );
    };
    const removeHandler = (conversation: CompleteConversationType) => {
      setConversations((current) =>
        current.filter((c) => c.id !== conversation.id)
      );
    };

    pusherClient.subscribe(pusherKey);
    pusherClient.bind("conversation:new", convoHandler);
    pusherClient.bind("conversation:update", updateHandler);
    pusherClient.bind("conversation:remove", removeHandler);
    return () => {
      pusherClient.unsubscribe(pusherKey);
      pusherClient.unbind("conversation:new", convoHandler);
      pusherClient.unbind("conversation:update", updateHandler);
      pusherClient.unbind("conversation:remove", removeHandler);
    };
  }, [pusherKey]);

  return (
    <>
      <GroupChatModal
        isOpen={isGroupModalOpen}
        onClose={() => setIsGroupModalOpen(false)}
        users={users}
      />
      <aside
        className={clsx(
          `fixed inset-y-0 left-0 w-full lg:left-20 lg:w-80 lg:block border-r border-orange-100 bg-orange-50 overflow-y-auto pb-20 lg:pb-0 shadow-lg shadow-orange-100`,
          isOpen ? `hidden` : `block w-full left-0`
        )}
      >
        <div className="px-5">
          <div className="flex justify-between items-center mb-4 pt-4 py-5 border-b border-orange-200">
            <h2 className="text-2xl font-bold text-orange-600 tracking-tight">
              Messages
            </h2>
            <div
              className="rounded-full p-2 text-black cursor-pointer hover:scale-102 transition"
              onClick={() => setIsGroupModalOpen(true)}
            >
              <MdOutlineGroupAdd size={24} className="mt-2" />
            </div>
          </div>
          <div className="space-y-3 mt-6">
            {conversations.map((conversation) => (
              <ConversationBox
                key={conversation.id}
                data={conversation}
                selected={conversationId === conversation.id}
              />
            ))}
          </div>
        </div>
      </aside>
    </>
  );
};

export default ConversationList;
