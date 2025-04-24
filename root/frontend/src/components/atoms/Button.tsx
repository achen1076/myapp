import React from "react";
import { twMerge } from "tailwind-merge";
import { clsx, type ClassValue } from "clsx";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "google";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  className,
  variant = "primary",
  size = "md",
  fullWidth,
  disabled,
  children,
  ...props
}) => {
  return (
    <button
      disabled={disabled}
      className={cn(
        // Base styles
        "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200",
        "border-2 border-gray-300",

        // Variants
        variant === "primary" && [
          "bg-white text-black",
          "hover:bg-red-200 hover:text-white",
          "focus:ring-black",
        ],
        variant === "secondary" && [
          "bg-gray-100 text-black",
          "hover:bg-blue-200 hover:text-white",
          "focus:ring-black",
        ],
        variant === "outline" && [
          "border-2 border-black text-black",
          "hover:bg-black hover:text-white",
          "focus:ring-black",
        ],
        variant === "ghost" && [
          "text-black",
          "hover:bg-black hover:text-white",
          "focus:ring-black",
        ],
        variant === "google" && [
          "relative bg-white text-[#757575] font-medium font-sans",
          "pl-12 border border-gray-300",
          "hover:shadow-[0_-0.15vw_0_#db4437,0_0.15vw_0.2vw_#4285f4,0.15vw_0_0_#f4b400,-0.15vw_0_0_#0f9d58]",
          "focus:outline-none focus:shadow-[0_-0.15vw_0_#db4437,0_0.15vw_0.2vw_#4285f4,0.15vw_0_0_#f4b400,-0.15vw_0_0_#0f9d58]",
          "active:bg-gray-100",
          "before:content-[\"\"] before:absolute before:left-4 before:top-1/2 before:-translate-y-1/2",
          "before:w-5 before:h-5 before:bg-[url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBkPSJNMTcuNiA5LjJsLS4xLTEuOEg5djMuNGg0LjhDMTMuNiAxMiAxMyAxMyAxMiAxMy42djIuMmgzYTguOCA4LjggMCAwIDAgMi42LTYuNnoiIGZpbGw9IiM0Mjg1RjQiIGZpbGwtcnVsZT0ibm9uemVybyIvPjxwYXRoIGQ9Ik05IDE4YzIuNCAwIDQuNS0uOCA2LTIuMmwtMy0yLjJhNS40IDUuNCAwIDAgMS04LTIuOUgxVjEzYTkgOSAwIDAgMCA4IDV6IiBmaWxsPSIjMzRBODUzIiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBkPSJNNCAxMC43YTUuNCA1LjQgMCAwIDEgMC0zLjRWNUgxYTkgOSAwIDAgMCAwIDhsMy0yLjN6IiBmaWxsPSIjRkJCQzA1IiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBkPSJNOSAzLjZjMS4zIDAgMi41LjQgMy40IDEuM0wxNSAyLjNBOSA5IDAgMCAwIDEgNWwzIDIuNGE1LjQgNS40IDAgMCAxIDUtMy43eiIgZmlsbD0iI0VBNDMzNSIgZmlsbC1ydWxlPSJub256ZXJvIi8+PHBhdGggZD0iTTAgMGgxOHYxOEgweiIvPjwvZz48L3N2Zz4=)]",
          "before:bg-no-repeat before:bg-center",
          "disabled:grayscale disabled:bg-gray-100"
        ],

        // Sizes
        size === "sm" && "px-3 py-1.5 text-sm",
        size === "md" && "px-4 py-2 text-base",
        size === "lg" && "px-6 py-3 text-lg",

        // Width
        fullWidth && "w-full",

        // States
        disabled && "opacity-50 cursor-not-allowed pointer-events-none",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
