import getConversationById from "@/app/actions/getConversationById";
import getMessages from "@/app/actions/getMessages";
import ConvoBody from "@/components/ConvoBody";
import ConvoHeader from "@/components/ConvoHeader";
import EmptyState from "@/components/EmptyState";
import MessageForm from "@/components/MessageForm";

interface ConversationPageProps {
  params: Promise<{ conversationId: string }>;
}
const conversationId = async (props: ConversationPageProps) => {
  const params = await props.params;
  const { conversationId } = params;

  const conversation = await getConversationById(conversationId);
  const messages = await getMessages(conversationId);
  console.log("conversation", conversation);

  if (!conversation) {
    return (
      <div className="lg:pl-80 h-full">
        <div className="h-full flex flex-col">
          <EmptyState />
        </div>
      </div>
    );
  }

  return (
      <div className="lg:pl-80 h-full">
        <div className="h-full flex flex-col">
          <ConvoHeader conversation={conversation} />
          <ConvoBody initialMessages={messages} />
          <MessageForm />
        </div>
      </div>
  );
};

export default conversationId;
