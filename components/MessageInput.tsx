"use client";

import {
  FieldErrors,
  FieldValues,
  UseFormRegister,
} from "react-hook-form";
const MessageInput = ({
  id,
  register,
  placeholder,
  type,
  required,
}: {
  id: string;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) => {
  return (
    <div className="relative w-full ">
      <input
        type={type}
        id={id}
        {...register(id, { required: required })}
        placeholder={placeholder}
        className="
        text-black font-normal py-2 px-4 bg-neutral-100 w-full rounded-full focus:outline-none autocomplete-off
        "
        autoComplete="off"
      />
    </div>
  );
};

export default MessageInput;
