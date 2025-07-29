"use client";
import clsx from "clsx";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import * as z from "zod";
import formSchema from "@/utils/zod/FormSchema";

interface InputProps {
  label: string;
  id: keyof z.infer<typeof formSchema>;
  type?: string;
  required?: boolean;
  register: UseFormRegister<z.infer<typeof formSchema>>;
  errors: FieldErrors;
  disabled?: boolean;
}
export default function Input({
  label,
  id,
  type,
  required,
  register,
  errors,
  disabled,
}: InputProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium, leading-6 text-gray-900"
      >
        {" "}
        {label}
      </label>
      <div>
        <input
          id={id}
          type={type}
          autoComplete={id}
          disabled={disabled}
          {...register(id, { required })}
          className={clsx(`
              shadow appearance-none border rounded-2xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500 focus:ring-blue-500 focus:ring-opacity-50 focus:ring-offset-2 focus:ring-offset-blue-500
              ${errors[id] ? "border-red-500 focus:border-red-500" : ""}
              ${disabled ? "opacity-50 cursor-not-allowed" : ""}
              ${required ? "required" : ""}
              
              `)}
        />
      </div>
    </div>
  );
}
