"use client";
import React from "react";
import useOtherUsers from "@/app/hooks/useOtherUsers";
import { Conversation, User } from "@prisma/client";
import { useMemo } from "react";
import { format } from "date-fns";
import { Dialog, Transition, TransitionChild } from "@headlessui/react";
const ProfileModal = ({
  data,
  isOpen,
  onClose,
}: {
  data: Conversation & {
    users: User[];
  };
  isOpen: boolean;
  onClose: () => void;
}) => {
  const otherUser = useOtherUsers(data);

  const convoStartDate = useMemo(() => {
    return format(new Date(otherUser!.createdAt), "PP");
  }, [otherUser!.createdAt]);

  const title = useMemo(() => {
    return data.name || otherUser?.name || "Conversation";
  }, [data.name, otherUser?.name]);

  const statusText = useMemo(() => {
    if (data.isGroup) {
      return `${data.users.length} members`;
    }
    return "Active";
  }, [data]);

  return (
    <Transition show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <TransitionChild
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-40"></div>
        </TransitionChild>
      </Dialog>
    </Transition>
  );
};

export default ProfileModal;
