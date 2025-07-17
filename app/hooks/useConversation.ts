import { useParams } from "next/navigation";
import { useMemo } from "react";

const useConversation = () => {
  const params = useParams();

  const conversationId = useMemo(() => {
    const id = params?.conversationId;

    if (!id) return "";

    // If it's an array, take the first element
    return Array.isArray(id) ? id[0] : id;
  }, [params?.conversationId]);

  const isOpen = useMemo(() => !!conversationId, [conversationId]);

  return useMemo(
    () => ({
      conversationId,
      isOpen,
    }),
    [conversationId, isOpen]
  );
};

export default useConversation;
