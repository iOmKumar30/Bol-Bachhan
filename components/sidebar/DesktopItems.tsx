"use client";

import clsx from "clsx";
import Link from "next/link";

interface diprops {
  label: string;
  href: string;
  icon: React.ElementType;
  active?: boolean;
  onClick?: () => void;
}

const DesktopItem = ({ label, href, icon: Icon, active, onClick }: diprops) => {
  const handleClick = () => {
    if (onClick) {
      return onClick();
    }
  };

  return (
    <li onClick={handleClick} className="relative group">
      <Link
        href={href}
        className={clsx(
          "flex items-center justify-center p-4 rounded-xl transition-all duration-200 ease-out",
          "hover:bg-orange-100",
          active ? "bg-orange-100 shadow-sm text-black" : "text-black"
        )}
      >
        <Icon className="h-6 w-6 shrink-0" />
        <span className="absolute top-full mb-2 px-2 py-1 text-xs text-gray-600 rounded opacity-0 group-hover:opacity-70 transition-opacity">
          {label}
        </span>
      </Link>
    </li>
  );
};

export default DesktopItem;
