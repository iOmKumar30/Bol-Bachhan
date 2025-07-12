import Sidebar from "@/components/sidebar/Sidebar";
import getUsers from "../actions/getUsers";
import Userlist from "@/components/Userlist";
// async components to render the fetched users
export default async function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const users = await getUsers();
  return (
    <Sidebar>
      <div className="h-full">
        <Userlist users={users!} />
        {children}
      </div>
    </Sidebar>
  );
}
