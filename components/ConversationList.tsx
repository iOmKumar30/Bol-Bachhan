"use client";
import { CompleteConversationType } from "@/app/types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import useConversation from "@/app/hooks/useConversation";
import clsx from "clsx";
import { MdOutlineGroupAdd } from "react-icons/md";
import ConversationBox from "./ConversationBox";
const ConversationList = ({
  existingConversations,
}: {
  existingConversations: CompleteConversationType[];
}) => {
  const [conversations, setConversations] = useState(existingConversations);
  const router = useRouter();
  const { conversationId, isOpen } = useConversation();

  return (
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
          <div className="rounded-full p-2 text-black cursor-pointer hover:scale-102 transition">
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
  );
};

export default ConversationList;
