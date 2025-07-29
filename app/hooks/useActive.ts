import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ActiveUser {
  id: string;
  lastActiveAt?: string;
}

interface ActiveListStore {
  onlineMembers: Record<string, ActiveUser>;
  lastSeenMap: Record<string, string>;
  add: (id: string) => void;
  remove: (id: string) => void;
  set: (ids: string[]) => void;
}

const useActive = create<ActiveListStore>()(
  persist(
    (set) => ({
      onlineMembers: {},
      lastSeenMap: {},

      add: (id) =>
        set((state) => ({
          onlineMembers: {
            ...state.onlineMembers,
            [id]: { id },
          },
        })),

      remove: (id) =>
        set((state) => {
          const updatedOnline = { ...state.onlineMembers };
          delete updatedOnline[id];

          return {
            onlineMembers: updatedOnline,
            lastSeenMap: {
              ...state.lastSeenMap,
              [id]: new Date().toISOString(),
            },
          };
        }),

      set: (ids) => {
        const newOnline: Record<string, ActiveUser> = {};
        ids.forEach((id) => {
          newOnline[id] = { id };
        });
        set({ onlineMembers: newOnline });
      },
    }),
    {
      name: "active-store", 
    }
  )
);

export default useActive;
