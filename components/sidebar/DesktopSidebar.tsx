"use client";

import useRoutes from "@/app/hooks/useRoutes";
import { useState } from "react";
import DesktopItem from "./DesktopItems";
import { User } from "@prisma/client";
import Avatar from "../Avatar";

const DesktopSidebar = ({ currentUser }: { currentUser: User }) => {
  const routes = useRoutes();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:min-w-[80px] xl:w-20 lg:bg-orange-300 lg:pb-6 lg:pt-6 lg:flex lg:flex-col lg:justify-between border-r border-orange-200 shadow-neutral-500 bg-white overflow-y-auto pb-20 shadow-md ">
      {/* Sidebar Items */}
      <nav className="flex flex-col items-center space-y-5">
        <ul role="list" className="flex flex-col items-center space-y-5 w-full">
          {routes.map((route) => (
            <DesktopItem
              key={route.href}
              href={route.href}
              label={route.label}
              icon={route.icon}
              active={route.active}
              onClick={route.onClick}
            />
          ))}
        </ul>
      </nav>

      {/* Avatar */}
      <div className="flex flex-col items-center">
        <div
          onClick={() => setIsOpen(true)}
          className="cursor-pointer hover:scale-110 transition-transform duration-200 ease-out drop-shadow-md"
        >
          <Avatar user={currentUser} />
        </div>
      </div>
    </div>
  );
};

export default DesktopSidebar;
