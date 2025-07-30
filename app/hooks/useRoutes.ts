import { usePathname } from "next/navigation";
// useParams gives dynanmic values from the URL whereas the usePathname give the path as string
import { useMemo } from "react";

import { HiChat } from "react-icons/hi";
import { HiArrowLeftOnRectangle, HiUsers } from "react-icons/hi2";

import { signOut, useSession } from "next-auth/react";

import axios from "axios";
import useConversation from "./useConversation";

const useRoutes = () => {
  const pathname = usePathname();
  const { conversationId } = useConversation();
  const session = useSession();
  const handleLogout = async () => {
    try {
      await axios.post("/api/last-active", {
        email: session.data?.user?.email,
      });
    } catch (err) {
      console.error("Failed to update lastActiveAt", err);
    }
    signOut();
  };

  const routes = useMemo(
    () => [
      {
        label: "Chat",
        href: "/conversations",
        icon: HiChat,
        active: pathname === "/conversations" || !!conversationId,
      },
      {
        label: "Users",
        href: "/users",
        icon: HiUsers,
        active: pathname === "/users",
      },
      {
        label: "Logout",
        href: "#",
        onClick: handleLogout,
        icon: HiArrowLeftOnRectangle,
      },
    ],
    [pathname, conversationId]
  );

  return routes;
};

export default useRoutes;
