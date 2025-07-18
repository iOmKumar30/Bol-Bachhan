import { pusherClient } from "@/libs/pusher";
import { Channel, Members } from "pusher-js";
import { useEffect, useState } from "react";
import useActive from "./useActive";

const useActiveChannel = () => {
  const { set, add, remove } = useActive();
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null);

  useEffect(() => {
    let channel = activeChannel;
    if (!channel) {
      channel = pusherClient.subscribe("presence-message_app");
      setActiveChannel(channel);
    }

    channel.bind("pusher:subscription_succeeded", (members: Members) => {
      const initialMembers: string[] = [];
      members.each((member: Record<string, any>) =>
        initialMembers.push(member.id)
      );
      set(initialMembers);
    });

    channel.bind("pusher:member_added", (member: Record<string, any>) => {
      add(member.id);
    });

    channel.bind("pusher:member_removed", (member: { id: string }) => {
      remove(member.id);
    });

    return () => {
      if (activeChannel) {
        pusherClient.unsubscribe("presence-message_app");
        setActiveChannel(null);
      }
    };
  }, [activeChannel, set, add, remove]);
};

export default useActiveChannel;
