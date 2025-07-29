const getLastSeen = async (email: string): Promise<Date | null> => {
  try {
    const res = await fetch(`/api/last-active/${encodeURIComponent(email)}`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch last seen");

    const data = await res.json();
    return data ? new Date(data) : null;
  } catch (error) {
    console.error("getLastSeen error:", error);
    return null;
  }
};

export default getLastSeen;
