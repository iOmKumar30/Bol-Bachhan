"use client";
import clsx from "clsx";
interface ButtonProps {
  type?: "button" | "submit" | "reset" | undefined;
  fullWidth?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  secondary?: boolean;
  danger?: boolean;
}
const baseButtonStyle = `
  inline-flex items-center justify-center
  font-semibold tracking-wide
  rounded-xl
  shadow-sm
  transition-all duration-200 ease-in-out
  focus:outline-none focus:ring-2 focus:ring-offset-2
  focus:ring-orange-500 focus:ring-offset-orange-200
  bg-orange-500 text-white
  hover:bg-orange-600
  hover:scale-105
  disabled:opacity-60 disabled:cursor-not-allowed
`;

export function Button({
  type,
  fullWidth,
  children,
  onClick,
  disabled,
  className,
  secondary,
  danger,
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={clsx(
        baseButtonStyle,
        danger
          ? "bg-red-600 text-red-100 hover:bg-red-700 focus:ring-red-500"
          : secondary
          ? "bg-gray-100 text-gray-900 hover:bg-gray-200"
          : "bg-blue-600 text-blue-100 hover:bg-blue-700 focus:ring-blue-500",
        "px-5 py-2 text-base",
        fullWidth && "w-full",
        className
      )}
    >
      {children}
    </button>
  );
}
