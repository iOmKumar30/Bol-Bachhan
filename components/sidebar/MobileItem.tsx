"use client";

import Link from "next/link";
import clsx from "clsx";

interface diprops {
  label: string;
  href: string;
  icon: any;
  active?: boolean;
  onClick?: () => void;
}

const MobileItem = ({ label, href, icon: Icon, active, onClick }: diprops) => {
  const handleClick = () => {
    if (onClick) {
      return onClick();
    }
  };

  return (
    <div>
      <Link
        href={href}
        onClick={handleClick}
        className={clsx(
          "group flex justify-center items-center w-full p-4 transition-all duration-200 ease-out rounded-md",
          "hover:bg-orange-100 hover:text",
          active ? "bg-orange-100 text shadow-sm" : "text-black"
        )}
      >
        <Icon className="h-6 w-6 shrink-0" />
        <span className="sr-only">{label}</span>
      </Link>
    </div>
  );
};

export default MobileItem;
