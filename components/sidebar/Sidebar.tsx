import getCurrentUser from "@/app/actions/getCurrentUser";
import DesktopSidebar from "./DesktopSidebar";
import MobileFooter from "./MobileFooter";

async function Sidebar({ children }: { children: React.ReactNode }) {
  const currentUser = await getCurrentUser();

  return (
    <div className="h-full">
      {/*  The exclamation mark is the "non-null assertion operator". It tells TypeScript that we know that currentUser is not null or undefined, even though TypeScript can't prove it. This is useful in this case, because we know that getCurrentUser will return a User if the user is logged in. If we didn't use the non-null assertion operator, TypeScript would complain that currentUser might be null or undefined when we pass it to DesktopSidebar. */}
      <DesktopSidebar currentUser={currentUser!} />
      <MobileFooter />
      <main className="lg:pl-20 h-full"> {children}</main>
    </div>
  );
}

export default Sidebar;
