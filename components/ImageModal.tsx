"use client";

import Image from "next/image";
import Modal from "./Modal";


const ImageModal = ({
  src,
  isOpen,
  onClose,
}: {
  src: string | null;
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!src) return null;
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="relative h-full">
        <div className="absolute top-0 right-0 p-4">
        </div>
        <div className="flex items-center justify-center h-full">
          <Image
            src={src}
            alt="Image"
            width={750}
            height={750}
            className="object-cover"
            priority
          />
        </div>
      </div>
    </Modal>
  );
};

export default ImageModal;

