"use client";

import { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import axios from "axios";
import Avatar from "./Avatar";

const Userbox = ({ user }: { user: User }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = useCallback(async () => {
    if (isLoading) return; // prevent double click
    setIsLoading(true);
    try {
      const response = await axios.post("/api/conversations", {
        userId: user.id,
      });
      router.push(`/conversations/${response.data.id}`); // conversationId received from the api request
    } finally {
      setIsLoading(false);
    }
  }, [user, router, isLoading]);

  return (
    <div
      onClick={handleClick}
      className="w-full relative flex items-center space-x-4 p-4 bg-white rounded-xl shadow-sm transition hover:shadow-md hover:bg-orange-50 cursor-pointer group"
    >
      <Avatar user={user} />
      <div className="flex-1 min-w-0">
        <div className="flex flex-col">
          <p className="text-base font-semibold text-gray-800 group-hover:text-orange-600 transition">
            {user.name}
          </p>
          <p className="text-sm text-gray-400 truncate">{user.email}</p>
        </div>
      </div>
    </div>
  );
};

export default Userbox;
