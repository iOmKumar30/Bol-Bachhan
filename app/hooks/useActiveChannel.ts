import { pusherClient } from "@/libs/pusher";
import axios from "axios";
import { useSession } from "next-auth/react";
import { Members, PresenceChannel } from "pusher-js";
import { useEffect, useRef } from "react";
import useActive from "./useActive";

const useActiveChannel = () => {
  const { set, add, remove } = useActive();
  const activeChannel = useRef<PresenceChannel | null>(null);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status !== "authenticated") return;
    if (activeChannel.current || !session?.user?.email) return;

    const channel = pusherClient.subscribe(
      "presence-message_app"
    ) as PresenceChannel;
    activeChannel.current = channel;

    channel.bind("pusher:subscription_succeeded", (members: Members) => {
      const initialMembers: string[] = [];
      members.each((member: { id: string }) => {
        initialMembers.push(member.id);
      });
      set(initialMembers);
    });

    channel.bind("pusher:member_added", (member: { id: string }) => {
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
  }, [status, session?.user?.email, add, remove, set]);
};

export default useActiveChannel;
