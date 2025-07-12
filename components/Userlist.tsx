"use client";
import { User } from "@prisma/client";
import Userbox from "./Userbox";

interface UserlistProps {
  users: User[];
}

const Userlist = ({ users }: UserlistProps) => {
  return (
    <aside className="fixed inset-y-0 left-0 w-full lg:left-20 lg:w-80 lg:block border-r border-orange-100 bg-orange-50 overflow-y-auto pb-20 lg:pb-0 shadow-lg shadow-orange-100">
      <div className="px-5">
        {/* Header */}
        <div className="flex flex-col border-b border-orange-200 py-5">
          <h2 className="text-2xl font-bold text-orange-600 tracking-tight">
            People
          </h2>
        </div>

        {/* User List */}
        <div className="space-y-3 mt-6">
          {users.map((user) => (
            <Userbox key={user.id} user={user} />
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Userlist;
