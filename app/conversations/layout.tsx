import ConversationList from "@/components/ConversationList";
import Sidebar from "@/components/sidebar/Sidebar";
import getConversations from "../actions/getConversations";

export default async function ConversationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const conversations = await getConversations();
  return (
    <Sidebar>
      <div className="h-full ">
        <ConversationList existingConversations={conversations} />
        {children}
      </div>
    </Sidebar>
  );
}
