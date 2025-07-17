"use client";
import formSchema from "@/utils/zod/FormSchema";
import { User } from "@prisma/client";
import axios from "axios";
import { CldUploadButton } from "next-cloudinary";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import Modal from "../Modal";
import Input from "../input/Input";

const SettingsModal = ({
  isOpen,
  onClose,
  currentUser,
}: {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [imgError, setImgError] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      name: currentUser.name ?? "",
      image: currentUser.image ?? "",
    },
  });

  const image = watch("image");

  const noProfileImage =
    !image ||
    image === "/avatar.jpg" ||
    image === "" ||
    image === null ||
    image === undefined;
  const handleUpload = (result: any) => {
    // result.info.secure_url contains the uploaded image URL
    if (result?.info?.secure_url) {
      setValue("image", result.info.secure_url, { shouldValidate: true });
      setImgError(false);
    } else {
      setImgError(true);
      toast.error("Image upload failed!");
    }
  };
  const handleRemoveImage = () => {
    setValue("image", "/avatar.jpg", { shouldValidate: true });
    setImgError(false);
  };
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);
    axios
      .post("/api/settings", data)
      .then(() => {
        router.refresh();
        onClose();
      })
      .catch(() => toast.error("Something went wrong!"))
      .finally(() => setIsLoading(false));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form
        className="bg-white rounded-xl p-8 max-w-md mx-auto"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="space-y-8">
          <div className="pb-8  border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-1">Profile</h2>
            <p className="text-sm text-gray-500 mb-6">
              Update your profile information.
            </p>
            <div className="flex flex-col gap-y-6">
              <Input
                disabled={isLoading}
                label="Name"
                id="name"
                errors={errors}
                register={register}
                required
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Photo
                </label>
                <div className="relative w-20 h-20 mx-auto group flex flex-col items-center justify-center">
                  <Image
                    width={80}
                    height={80}
                    className="rounded-full border-2 border-gray-300 object-cover bg-gray-100"
                    src={
                      !imgError
                        ? image || currentUser.image || "/avatar.jpg"
                        : "/avatar.jpg"
                    }
                    alt="Avatar"
                    onError={() => setImgError(true)}
                  />
                  <div className="flex gap-x-2 items-center justify-center">
                    <CldUploadButton
                      options={{ maxFiles: 1 }}
                      onSuccess={handleUpload}
                      uploadPreset="bbpreset"
                      className="mt-3"
                    >
                      <div className="inline-flex items-center justify-center bg-gray-100 text-sm text-gray-800 font-semibold px-3 py-1.5 rounded-md hover:bg-gray-200 transition duration-200 disabled:opacity:40 disabled:cursor-not-allowed">
                        Change
                      </div>
                    </CldUploadButton>
                    <button
                      className="inline-flex items-center justify-center bg-gray-100 text-sm text-gray-800 font-semibold px-3 py-1.5 rounded-md transition duration-200 mt-3 hover:bg-red-600 hover:text-white disabled:opacity:40 disabled:cursor-not-allowed"
                      onClick={handleRemoveImage}
                      type="button"
                      disabled={noProfileImage || isLoading}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 flex items-center justify-end gap-x-6">
            <button
              type="button"
              onClick={onClose}
              className="text-sm font-semibold leading-6 text-gray-900 cursor-pointer bg-white border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-lg transition duration-200"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="text-sm font-semibold leading-6 cursor-pointer bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg transition duration-200"
              disabled={isLoading}
            >
              Save
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default SettingsModal;
