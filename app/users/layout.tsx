import Sidebar from "@/components/sidebar/Sidebar";
import Userlist from "@/components/Userlist";
import { Suspense } from "react";
import getUsers from "../actions/getUsers";
import Loading from "./loading";
// async components to render the fetched users
export default async function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const users = await getUsers();
  return (
    <Suspense fallback={<Loading />}>
      <Sidebar>
        <div className="h-full">
          <Userlist users={users!} />
          {children}
        </div>
      </Sidebar>
    </Suspense>
  );
}
