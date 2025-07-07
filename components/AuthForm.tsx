"use client";

import { useState } from "react";
import {
  FieldValue,
  FieldValues,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { set } from "zod/v4-mini";
import Input from "./input/Input";
import formSchema from "@/utils/zod/FormSchema";
import { Button } from "./Button";
import GoogleButton from "react-google-button";
import { FacebookLoginButton } from "react-social-login-buttons";
interface AuthFormProps {
  type: "login" | "register";
  setType: React.Dispatch<React.SetStateAction<"login" | "register">>;
}
export default function AuthForm({ type, setType }: AuthFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  // Function to change the form type between login and register
  const toggleFormType = () => {
    setType((prev: "login" | "register") =>
      prev === "login" ? "register" : "login"
    );
  };

  // Initialize the form with react-hook-form
  // and use the Zod schema for validation
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = (data) => {
    setIsLoading(true);

    if (type === "login") {
      // next auth login
    }

    if (type === "register") {
      // axios register db call
    }
  };

  const otherProviderSign = (action: string) => {
    setIsLoading(true);
    // Handle other provider sign-in
  };

  return (
    <div className="sm:w-full sm:max-w-md sm:mx-auto  ">
      <div className="bg-white rounded-lg shadow-md px-4 py-8 sm:p-10">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {type === "register" && (
            <Input
              label="Name"
              id="name"
              type="text"
              required
              register={register}
              errors={errors}
            />
          )}
          <Input
            label="Email"
            id="email"
            type="email"
            register={register}
            errors={errors}
          />
          <Input
            label="Password"
            id="password"
            type="password"
            required
            register={register}
            errors={errors}
          />
          <Button type="submit" disabled={isLoading} fullWidth>
            {type === "login" ? "Sign in" : "Register"}
          </Button>
        </form>
        <div className="mt-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Or continue with
              </span>
            </div>
          </div>
        </div>
        <div className="mt-2 flex gap-4 items-center w-full">
          <div className="flex-1">
            <GoogleButton
              onClick={() => otherProviderSign("google")}
              type="light"
              label="Google"
              style={{
                width: "100%",
                textAlign: "center",
                fontSize: "20px",
                paddingRight: "35px",
              }}
            />
          </div>
          <div className="flex-1">
            <FacebookLoginButton
              onClick={() => otherProviderSign("facebook")}
              style={{ width: "100%" }}
            >
              <span className="flex justify-center text-[20px]">Facebook</span>
            </FacebookLoginButton>
          </div>
        </div>
        {type === "login" ? (
          <div className="mt-4 flex justify-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <span
                onClick={toggleFormType}
                className="underline cursor-pointer"
              >
                Create one
              </span>
            </p>
          </div>
        ) : (
          <div className="mt-4 flex justify-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <span
                onClick={toggleFormType}
                className="underline cursor-pointer"
              >
                Sign in
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
