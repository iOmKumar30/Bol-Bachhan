"use client";
import useConversation from "@/app/hooks/useConversation";
import { DialogTitle } from "@headlessui/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { FiAlertTriangle } from "react-icons/fi";
import { toast } from "sonner";
import { Button } from "./Button";
import Modal from "./Modal";

interface ModalProps {
  isOpen?: boolean;
  onClose: () => void;
}

const ConfirmDeleteModal = ({ isOpen, onClose }: ModalProps) => {
  const router = useRouter();
  const { conversationId } = useConversation();
  const [isLoading, setIsLoading] = useState(false);

  const onDelete = useCallback(() => {
    setIsLoading(true);
    axios
      .delete(`/api/conversations/${conversationId}`)
      .then(() => {
        onClose();
        router.push("/conversations");
        router.refresh();
      })
      .catch((error) => {
        toast.error("Something Went Wrong!");
        console.error("Failed to delete conversation:", error);
      })
      .finally(() => {
        setIsLoading(false);
        onClose();
      });
  }, [conversationId, router, onClose]);
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="sm:flex sm:items-start space-x-4">
        <div className="mx-auto sm:mx-0 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mr-4">
          <FiAlertTriangle className="h-6 w-6 text-red-600" />
        </div>

        <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
          <DialogTitle
            as="h3"
            className="text-lg font-semibold leading-6 text-gray-900"
          >
            Delete Conversation
          </DialogTitle>
          <div className="mt-2">
            <p className="text-sm text-gray-600">
              Are you sure you want to{" "}
              <span className="font-medium text-red-600">
                permanently delete
              </span>{" "}
              this conversation?
            </p>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <Button disabled={isLoading} secondary onClick={onClose}>
              Cancel
            </Button>
            <Button disabled={isLoading} danger onClick={onDelete}>
              Delete
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDeleteModal;
