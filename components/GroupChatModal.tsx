import { User } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "./Button";
import Modal from "./Modal";
import Select from "./input/Select";
const GroupChatModal = ({
  isOpen,
  onClose,
  users,
}: {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      members: [],
    },
  });

  const members = watch("members");

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);
    axios
      .post("/api/conversations", {
        ...data,
        isGroup: true,
      })
      .then(() => {
        router.refresh();
        onClose();
      })
      .catch((error) => {
        console.error("Error creating group chat:", error);
        toast.error("Failed to create group chat.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-12">
          <div className="border border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900 pl-2">
              Create a Group Chat
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600 pl-2">
              Select atleast two members to start a group chat.
            </p>
            <div className="mt-10 flex flex-col gap-y-4">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 pl-2"
              >
                Group Name
              </label>
              <input
                id="name"
                type="text"
                disabled={isLoading}
                {...register("name", { required: true })}
                className={`shadow appearance-none border rounded-2xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500 focus:ring-blue-500 focus:ring-opacity-50 focus:ring-offset-2 focus:ring-offset-blue-500 ${
                  errors.name ? "border-red-500" : ""
                }`}
              />
              {errors.name && (
                <span className="text-red-500 text-sm">
                  Group name is required.
                </span>
              )}
              <Select
                disabled={isLoading}
                label="Select Members"
                options={users.map((user) => ({
                  value: user.id,
                  label: user.name || user.email || "",
                }))}
                onChange={(value) =>
                  setValue("members", value, {
                    shouldValidate: true,
                  })
                }
                value={members}
              ></Select>
            </div>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-end gap-x-6">
          <Button
            disabled={isLoading}
            type="button"
            onClick={onClose}
            secondary
          >
            Cancel
          </Button>
          <Button
            disabled={isLoading}
            type="submit"
            onClick={onClose}
          >
            Create
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default GroupChatModal;
