import React from "react";
import { twMerge } from "tailwind-merge";
import { clsx, type ClassValue } from "clsx";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
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
