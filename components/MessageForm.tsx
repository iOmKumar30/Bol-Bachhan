"use client";

import useConversation from "@/app/hooks/useConversation";
import axios from "axios";
import { useForm, FieldValues, SubmitHandler } from "react-hook-form";
import { HiPhoto } from "react-icons/hi2";
import { IoMdSend } from "react-icons/io";
import MessageInput from "./MessageInput";
import { CldUploadButton } from "next-cloudinary";

const MessageForm = () => {
  const { conversationId } = useConversation();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      message: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data: FieldValues) => {
    setValue("message", "", { shouldValidate: true });
    axios.post("/api/messages", { ...data, conversationId });
  };

  const handleImageUpload = (res: any) => {
    const secureUrl = res?.info?.secure_url;
    if (!secureUrl) return;

    axios.post("/api/messages", {
      image: secureUrl,
      conversationId,
    });
  };

  return (
    <div className="p-2 bg-white flex items-center gap-1 lg:gap-2 w-full border-t border-t-gray-200">
      <CldUploadButton
        options={{ maxFiles: 1 }}
        onSuccess={handleImageUpload}
        uploadPreset="bbpreset"
      >
        <HiPhoto size={20} className="text-sky-500 cursor-pointer" />
      </CldUploadButton>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex items-center w-full gap-1 lg:gap-2"
      >
        <MessageInput
          id="message"
          register={register}
          errors={errors}
          required
          placeholder="Type a message"
        />
        <button
          type="submit"
          title="Send message"
          className="rounded-full p-1 items-center justify-center cursor-pointer transition duration-300"
        >
          <IoMdSend size={20} className="text-sky-500 hover:text-sky-600" />
        </button>
      </form>
    </div>
  );
};

export default MessageForm;

