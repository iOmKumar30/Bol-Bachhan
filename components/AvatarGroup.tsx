"use client";
import { User } from "@prisma/client";
import Image from "next/image";
import { useEffect, useState } from "react";
const AvatarGroup = ({ users }: { users: User[] }) => {
  const [displayUsers, setDisplayUsers] = useState<User[]>(users.slice(0, 3));

  useEffect(() => {
    const shuffled = [...users].sort(() => 0.5 - Math.random());
    setDisplayUsers(shuffled.slice(0, 3));
  }, [users]);

  const positionMap = {
    0: "top-0 left-[12px]",
    1: "bottom-0",
    2: "bottom-0 right-0",
  };
  return (
    <div className="relative h-12 w-12 rounded-full overflow-hidden ring-1 ring-gray-300 shadow-xs">
      {displayUsers.map((user, index) => (
        <div
          key={user.id}
          className={`absolute h-[24px] w-[24px] inline-block rounded-full overflow-hidden cursor-pointer ${
            positionMap[index as keyof typeof positionMap]
          }`}
        >
          <Image alt="Avatar" fill src={user?.image || "/avatar.jpg"} />
        </div>
      ))}
    </div>
  );
};

export default AvatarGroup;
