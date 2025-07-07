"use client";
import AuthForm from "@/components/AuthForm";
import Image from "next/image";
import { useState } from "react";
export default function Home() {
  const [formType, setFormType] = useState<"login" | "register">("login");
  return (
    <div className="flex flex-col min-h-screen justify-center items-center bg-gradient-to-br from-orange-50 via-white to-orange-100 px-4 py-12">
      <div className="backdrop-blur-md flex flex-col items-center w-full max-w-md">
        <div className="bg-orange-100 rounded-full p-4 shadow-md mb-4">
          <Image
            src="/chat.png"
            alt="Logo"
            width={56}
            height={56}
            className="w-14 h-14"
          />
        </div>
        <h2 className="text-3xl font-extrabold text-orange-700 text-center mb-2">
          {formType === "login" ? "Welcome Back!" : "Create an Account"}
        </h2>
        <p className="text-gray-600 text-center mb-6">
          {formType === "login"
            ? "Sign in to your account and start chatting now."
            : "Register to connect and start chatting with people."}
        </p>
        <AuthForm type={formType} setType={setFormType} />
      </div>
    </div>
  );
}
