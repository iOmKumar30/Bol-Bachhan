import { pusherClient } from "@/libs/pusher";
import axios from "axios";
import { useSession } from "next-auth/react";
import { Channel, Members } from "pusher-js";
import { useEffect, useRef } from "react";
import useActive from "./useActive";

const useActiveChannel = () => {
  const { set, add, remove } = useActive();
  const activeChannel = useRef<Channel | null>(null);
  const { data: session, status } = useSession();

  useEffect(() => {
    // Wait until session is fully loaded
    if (status !== "authenticated") return;
    if (activeChannel.current || !session?.user?.email) return;

    const channel = pusherClient.subscribe("presence-message_app");
    activeChannel.current = channel;

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
      axios.post("/api/last-active", { email: member.id });
      remove(member.id);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      activeChannel.current = null;
    };
  }, [status, session?.user?.email]);
};

export default useActiveChannel;
