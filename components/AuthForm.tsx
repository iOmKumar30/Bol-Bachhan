"use client";

import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Input from "./input/Input";
import formSchema from "@/utils/zod/FormSchema";
import { Button } from "./Button";
import GoogleButton from "react-google-button";
import axios from "axios";
import { toast } from "sonner";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
interface AuthFormProps {
  type: "login" | "register";
  setType: React.Dispatch<React.SetStateAction<"login" | "register">>;
}
export default function AuthForm({ type, setType }: AuthFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const session = useSession();
  const router = useRouter();
  const toggleFormType = () => {
    setType((prev: "login" | "register") =>
      prev === "login" ? "register" : "login"
    );
    reset();
  };

  useEffect(() => {
    if (session.status === "authenticated") {
      router.push("/users");
    }
  }, [session?.status, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = async (data) => {
    setIsLoading(true);
    console.log("Form Data:", data);
    if (type === "register") {
      axios
        .post("/api/registration", data)
        .then(() => {
          toast.success("Registration successful!");
          setTimeout(() => {
            signIn("credentials", data);
            toast.success("Login successful!");
          }, 3000);
        })
        .catch((error) => {
          toast.error(error.response?.data || "Registration failed!");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }

    if (type === "login") {
      try {
        const res = await signIn("credentials", {
          redirect: false,
          email: data.email,
          password: data.password,
        });

        if (res?.error) {
          toast.error(res.error);
        } else {
          toast.success("Login successful!");
          router.push("/users");
        }

        reset();
      } catch (error) {
        console.error(error);
        toast.error("Login failed!");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const otherProviderSign = (action: string) => {
    setIsLoading(true);
    signIn(action, {
      redirect: false,
    })
      .then((callback) => {
        if (callback?.error) {
          toast.error(callback.error);
        } else {
          router.push("/users");
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error("Login failed!");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="sm:w-full sm:max-w-md sm:mx-auto  ">
      <div className="bg-white rounded-lg shadow-md px-4 py-8 sm:p-10">
        <form
          onSubmit={handleSubmit(onSubmit, (error) => {
            console.log(error, "error");
          })}
          className="space-y-6"
        >
          {type === "register" && (
            <Input
              label="Name"
              id="name"
              type="text"
              required
              register={register}
              errors={errors}
              disabled={isLoading}
            />
          )}
          <Input
            label="Email"
            id="email"
            type="email"
            register={register}
            errors={errors}
            disabled={isLoading}
          />
          <Input
            label="Password"
            id="password"
            type="password"
            required
            register={register}
            errors={errors}
            disabled={isLoading}
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
              <span className="px-2 bg-white text-gray-500">Or continue</span>
            </div>
          </div>
        </div>
        <div className="mt-2 flex gap-4 items-center w-full">
          <div className="flex-1">
            <GoogleButton
              onClick={() => otherProviderSign("google")}
              style={{
                width: "100%",
                textAlign: "center",
                fontSize: "20px",
              }}
            />
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
