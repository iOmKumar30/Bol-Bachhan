"use client";

import useActive from "@/app/hooks/useActive";
import { User } from "@prisma/client";
import Image from "next/image";

const Avatar = ({ user }: { user: User }) => {
  const onlineMembers = useActive((state) => state.onlineMembers);
  const isActive = !!onlineMembers[user?.email!];

  return (
    <div className="relative group">
      <div className="relative inline-block rounded-full overflow-hidden h-10 w-10 md:h-12 md:w-12 ring-1 ring-gray-300 shadow-sm transition-transform duration-200 group-hover:scale-105">
        <Image
          alt="User avatar"
          src={user?.image || "/avatar.jpg"}
          fill
          className="object-cover"
        />
      </div>

      {isActive && (
        <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white shadow-sm" />
      )}
    </div>
  );
};

export default Avatar;
