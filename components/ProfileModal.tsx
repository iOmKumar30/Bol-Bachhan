"use client";
import useOtherUsers from "@/app/hooks/useOtherUsers";
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Conversation, User } from "@prisma/client";
import { format } from "date-fns";
import React, { useMemo } from "react";
import { IoClose, IoTrash } from "react-icons/io5";
import Avatar from "./Avatar";
import AvatarGroup from "./AvatarGroup";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

const ProfileModal = ({
  data,
  isOpen,
  onClose,
}: {
  data: Conversation & {
    users: User[];
  };
  isOpen: boolean;
  onClose: () => void;
}) => {
  const otherUser = useOtherUsers(data);
  // delete confirmation modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const joinedOn = useMemo(() => {
    return format(new Date(otherUser!.createdAt), "PP");
  }, [otherUser!.createdAt]);

  const title = useMemo(() => {
    return data.name || otherUser?.name || "Conversation";
  }, [data.name, otherUser?.name]);

  const statusText = useMemo(() => {
    if (data.isGroup) {
      return `${data.users.length} members`;
    }
    return "Active";
  }, [data]);

  return (
    <>
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      />
      <Transition show={isOpen} as={React.Fragment}>
        <Dialog as="div" className="relative z-50" onClose={onClose}>
          <TransitionChild
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/40"></div>
          </TransitionChild>

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                <TransitionChild
                  as={React.Fragment}
                  enter="transition ease-in-out duration-500 transform"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transition ease-in-out duration-500 transform"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <DialogPanel className="pointer-events-auto w-screen max-w-md">
                    <div className="flex h-full flex-col overflow-y-scroll bg-orange-50 py-6 shadow-xl">
                      <div className="px-4 sm:px-6">
                        <div className="flex items-start justify-end">
                          <div className="ml-3 flex h-7 items-center">
                            <button
                              type="button"
                              className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                              onClick={onClose}
                            >
                              <span className="sr-only">Close panel</span>
                              <IoClose
                                size={24}
                                className="text hover:text-red-600"
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="relative mt-6 flex-1 px-4 sm:px-6">
                        <div className="flex flex-col items-center">
                          <div className="mb-2">
                            {data.isGroup ? (
                              <AvatarGroup users={data.users} />
                            ) : (
                              <Avatar user={otherUser!} />
                            )}
                          </div>
                          <div className="">{title}</div>
                          <div className="text-sm text-gray-500">
                            {statusText}
                          </div>
                          <div className="flex gap-10 my-8">
                            <div
                              className="flex flex-col gap-3 items-center cursor-pointer hover:opacity-75"
                              onClick={() => setIsDeleteModalOpen(true)}
                            >
                              <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                                <IoTrash
                                  size={20}
                                  className="text hover:text-red-600"
                                />
                              </div>
                              <div className="text-sm font-light text-neutral-600">
                                Delete Conversation!
                              </div>
                            </div>
                          </div>
                          <div className="w-full pb-5 ot-5 sm:px-0 sm:pt-0">
                            <dl className="space-y-8 px-4 sm:space-y-6 sm:px-6">
                              {data.isGroup && (
                                <div>
                                  <dt className="text-sm font-medium text-gray-500">
                                    Group Members
                                  </dt>
                                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 space-y-2">
                                    {data.users.map((user) => (
                                      <div
                                        key={user.id}
                                        className="flex items-center"
                                      >
                                        <Avatar user={user} />
                                        <span className="ml-2">
                                          {user.name || user.email}
                                        </span>
                                      </div>
                                    ))}
                                  </dd>
                                </div>
                              )}

                              {!data.isGroup && (
                                <div>
                                  <dt className="text-sm font-medium text-gray-500">
                                    Email
                                  </dt>
                                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                                    {otherUser?.email}
                                  </dd>
                                </div>
                              )}
                              {!data.isGroup && (
                                <>
                                  <div>
                                    <hr />
                                  </div>
                                  <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0 mb-0">
                                    Joined on
                                  </dt>
                                  <dd className="mt-0 text-sm text-gray-900 sm:col-span-2">
                                    <time dateTime={joinedOn}>{joinedOn}</time>
                                  </dd>
                                </>
                              )}
                            </dl>
                          </div>
                        </div>
                      </div>
                    </div>
                  </DialogPanel>
                </TransitionChild>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default ProfileModal;
