"use client";

import { CompleteMessageType } from "@/app/types";
import clsx from "clsx";
import { format } from "date-fns/format";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import ImageModal from "./ImageModal";

const MessageSkeleton = () => {
  return (
    <div className="flex gap-3 px-4 py-3 animate-pulse">
      <div className="h-9 w-9 rounded-full bg-gray-300" />
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <div className="h-3 w-20 bg-gray-300 rounded-md" />
          <div className="h-3 w-10 bg-gray-200 rounded-md" />
        </div>
        <div className="h-8 w-48 bg-gray-200 rounded-2xl" />
      </div>
    </div>
  );
};

const MessageBox = ({
  isLast,
  data,
}: {
  isLast: boolean;
  data: CompleteMessageType;
}) => {
  const session = useSession();
  const [imageModalOpen, setImageModalOpen] = useState(false);
  if (session.status === "loading") {
    return (
      <div className="flex flex-col gap-3 ">
        <div className="flex justify-end px-4 py-3 text-sm text-gray-500">
          <MessageSkeleton />
        </div>
        <div className="flex justify-start px-4 py-3 text-sm text-gray-500">
          <MessageSkeleton />
        </div>
      </div>
    );
  }

  const isOwn = session?.data?.user?.email === data?.sender?.email;

  const seenList = (data?.seen || [])
    .filter((user) => user.email !== data?.sender?.email)
    .map((user) => user.name)
    .join(", ");

  const container = clsx("flex gap-3 p-4", isOwn && "justify-end");

  const avatar = clsx(isOwn && "order-2");

  const body = clsx("flex flex-col gap-2", isOwn && "items-end");

  const message = clsx(
    "text-sm w-fit max-w-[550px] break-words break-all ",
    isOwn ? "bg-orange-100 text-gray-800" : "bg-gray-100 text-gray-800",
    data.image ? "rounded-md p-0" : "rounded-lg py-2 px-3"
  );

  return (
    <div className={container}>
      {/*   <div className={avatar}>
        <Avatar user={data.sender} />
      </div> */}
      <div className={body}>
        <div className="flex items-center gap-1">
          <div className="text-xs text-gray-500">{data.sender.name || "Unknown"}</div>
          <div className="text-xs text-gray-400">
            {format(new Date(data.createdAt), "p")}
          </div>
        </div>
        <div className={message}>
          <ImageModal
            src={data.image}
            isOpen={imageModalOpen}
            onClose={() => setImageModalOpen(false)}
          />
          {data.image ? (
            <Image
              onClick={() => setImageModalOpen(true)}
              src={data.image}
              alt="Message Image"
              width={250}
              height={250}
              className="object-cover cursor-pointer hover:scale-105 transition translate rounded-md"
            />
          ) : (
            data.body
          )}
        </div>
        {isLast && isOwn && seenList.length > 0 && (
          <div className="text-xs text-gray-500">{`Seen By: ${seenList}`}</div>
        )}
      </div>
    </div>
  );
};

export default MessageBox;
