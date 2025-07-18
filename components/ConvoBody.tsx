"use client";

import useConversation from "@/app/hooks/useConversation";
import { CompleteMessageType } from "@/app/types";
import { pusherClient } from "@/libs/pusher";
import axios from "axios";
import { find } from "lodash";
import { useEffect, useRef, useState } from "react";
import MessageBox from "./MessageBox";
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
    const channel = pusherClient.subscribe(conversationId);
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    const messageHandler = (message: CompleteMessageType) => {
      // alert the seen as soon as message is received
      axios.post(`/api/conversations/${conversationId}/seen`);
      setMessages((current) => {
        if (find(current, { id: message.id })) {
          return current;
        } else {
          return [...current, message];
        }
      });
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const updateMsgHandler = (newMsg: CompleteMessageType) => {
      setMessages((current) =>
        current.map((currentMsg) => {
          if (currentMsg.id === newMsg.id) {
            return newMsg;
          }
          return currentMsg;
        })
      );
    };

    channel.bind("messages:new", messageHandler);
    channel.bind("message:update", updateMsgHandler); // update the seen array in realtime

    return () => {
      channel.unbind("messages:new", messageHandler);
      channel.unbind("message:update", updateMsgHandler);
      pusherClient.unsubscribe(conversationId);
    };
  }, [conversationId, messages]);

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
