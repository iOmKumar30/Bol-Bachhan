"use client";

import clsx from "clsx";
import useConversation from "../hooks/useConversation";
import EmptyState from "@/components/EmptyState";

const Conversation = () => {
  const { isOpen } = useConversation();

  return (
    <div
      className={clsx("lg:pl-80 h-full lg:block", isOpen ? "block" : "hidden")}
    >
      <EmptyState />
    </div>
  );
};

export default Conversation;
