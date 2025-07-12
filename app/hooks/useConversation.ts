import { useParams } from "next/navigation";
import { use, useMemo } from "react";

const useConversation = () => {
  const params = useParams();

  const conversationId = useMemo(() => {
    if (!params?.conversationId) {
      return "";
    }
    return params.conversationId;
  }, [params?.conversationId]);

  const isOpen = useMemo(() => {
    if (conversationId) {
      return true;
    } else {
      return false;
    }
  }, [conversationId]);

  return useMemo(
    () => ({
      conversationId,
      isOpen,
    }),
    [conversationId, isOpen]
  );
};

export default useConversation;
