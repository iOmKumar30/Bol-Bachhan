import ConversationList from "@/components/ConversationList";
import Sidebar from "@/components/sidebar/Sidebar";
import { Suspense } from "react";
import getConversations from "../actions/getConversations";
import getUsers from "../actions/getUsers";
import Loading from "./loading";

export default async function ConversationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const conversations = await getConversations();
  const users = await getUsers();
  return (
    <Suspense fallback={<Loading />}>
      <Sidebar>
        <div className="h-full ">
          <ConversationList
            existingConversations={conversations}
            users={users!}
          />
          {children}
        </div>
      </Sidebar>
    </Suspense>
  );
}
