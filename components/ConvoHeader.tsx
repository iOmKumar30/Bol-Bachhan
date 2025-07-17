"use client";

import useOtherUsers from "@/app/hooks/useOtherUsers";
import { Conversation, User } from "@prisma/client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { HiEllipsisHorizontal } from "react-icons/hi2";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import Avatar from "./Avatar";
import ProfileModal from "./ProfileModal";
import LoadingModal from "./LoadingModal";
const ConvoHeader = ({
  conversation,
}: {
  conversation: Conversation & {
    users: User[];
  };
}) => {
  const otherUser = useOtherUsers(conversation);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const statusText = useMemo(() => {
    if (conversation.isGroup) {
      return `${conversation.users.length} members`;
    }
    return "Active";
  }, [conversation]);

  if (!otherUser) {
    return null;
  }
  if (!conversation) {
    return <LoadingModal />;
  }
  return (
    <>
      <ProfileModal
        data={conversation}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
      <div className="bg-white w-full flex items-center justify-between border-b border-b-gray-200 sm:px-4 px-3 mt-1 lg:px-6">
        {/* Left section: Back button + avatar + names */}
        <div className="flex items-center gap-3">
          <Link
            href="/conversations"
            className="lg:hidden text-orange-500 hover:text-orange-600 transition duration-150 ease-in-out"
          >
            <IoArrowBackCircleOutline size={24} />
          </Link>

          <Avatar user={otherUser!} />

          <div className="flex flex-col leading-tight">
            <span className="text-sm font-medium text-gray-800 truncate">
              {conversation.name || otherUser?.name}
            </span>
            <span className="text-xs text-gray-500">{statusText}</span>
          </div>
        </div>

        {/* Right section: Options */}
        <button
          className="p-1 rounded-full hover:bg-orange-100 text-orange-500 hover:text-orange-600 transition duration-150 ease-in-out"
          aria-label="More options"
        >
          <HiEllipsisHorizontal size={22} onClick={() => setDrawerOpen(true)} />
        </button>
      </div>
    </>
  );
};

export default ConvoHeader;
