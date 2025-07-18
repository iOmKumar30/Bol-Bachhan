import ActiveStatus from "@/components/ActiveStatus";
import type { Metadata } from "next";
import AuthContext from "./context/AuthContext";
import ToasterProvider from "./context/toaster-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bol Bachhan",
  description: "Start chatting now!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthContext>
          <ToasterProvider />
          <ActiveStatus />
          {children}
        </AuthContext>
      </body>
    </html>
  );
}
