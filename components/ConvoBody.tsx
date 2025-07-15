"use client";

import useConversation from "@/app/hooks/useConversation";
import { CompleteMessageType } from "@/app/types";
import { useRef, useState, useEffect } from "react";
import MessageBox from "./MessageBox";
import axios from "axios";
const ConvoBody = ({
  initialMessages,
}: {
  initialMessages: CompleteMessageType[];
}) => {
  const [messages, setMessages] = useState(initialMessages);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { conversationId } = useConversation();

  useEffect(() => {
    axios.post(`/api/conversations/${conversationId}/seen`);
  }, [conversationId]);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  return (
    <div className="flex-1 overflow-y-auto">
      {messages.map((message, i) => (
        <MessageBox
          key={message.id}
          data={message}
          isLast={i === messages.length - 1}
        />
      ))}
      <div className="pt-5" ref={bottomRef} />
    </div>
  );
};

export default ConvoBody;
