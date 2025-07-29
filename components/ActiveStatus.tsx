"use client";

import useActiveChannel from "@/app/hooks/useActiveChannel";
import { useSession } from "next-auth/react";

const ActiveStatus = () => {
  const { status } = useSession();
  useActiveChannel();
  if (status !== "authenticated") return null;

  return null;
};

export default ActiveStatus;
