"use client";

import getLastSeen from "@/app/actions/getLastSeen";
import { useEffect, useMemo, useState } from "react";
import useActive from "./useActive";

const useUserActivityStatus = (email?: string | null) => {
  const onlineMembers = useActive((state) => state.onlineMembers);
  const lastSeenMap = useActive((state) => state.lastSeenMap);

  const isActive = !!email && !!onlineMembers[email];
  const [dbLastSeen, setDbLastSeen] = useState<Date | null>(null);

  useEffect(() => {
    if (!email || isActive) return;

    let mounted = true;

    const fetchLastSeen = async () => {
      const fallbackLastSeen = await getLastSeen(email);
      if (mounted && fallbackLastSeen) {
        setDbLastSeen(fallbackLastSeen);
      }
    };

    if (!lastSeenMap[email]) {
      fetchLastSeen();
    } else {
      setDbLastSeen(new Date(lastSeenMap[email]));
    }

    return () => {
      mounted = false;
    };
  }, [email, isActive, lastSeenMap]);

  const statusText = useMemo(() => {
    if (isActive) return "Currently active";
    if (dbLastSeen) {
      return `Last Active at ${new Intl.DateTimeFormat("en-GB", {
        timeStyle: "short",
        dateStyle: "short",
      }).format(dbLastSeen)}`;
    }
    return "Offline";
  }, [isActive, dbLastSeen]);

  return statusText;
};

export default useUserActivityStatus;
