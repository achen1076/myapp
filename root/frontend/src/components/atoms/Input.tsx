import React from "react";
import { twMerge } from "tailwind-merge";
import { clsx, type ClassValue } from "clsx";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  fullWidth?: boolean;
  label?: string;
  variant?: "default" | "login";
}

const Input: React.FC<InputProps> = ({
  className,
  error,
  fullWidth,
  label,
  disabled,
  variant = "default",
  placeholder,
  ...props
}) => {
  return (
    <div
      className={cn(
        "relative",
        variant === "default" && "flex flex-col gap-1",
        fullWidth && "w-full"
      )}
    >
      {label && (
        <label
          className={cn(
            variant === "default" && "text-sm font-medium text-gray-700",
            variant === "login" && "sr-only"
          )}
        >
          {label}
        </label>
      )}
      <input
        disabled={disabled}
        placeholder={placeholder}
        className={cn(
          // Default variant
          variant === "default" && [
            "px-4 py-2 rounded-lg border border-gray-300",
            "bg-white text-gray-900 placeholder:text-gray-400",
            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
          ],
          // Login variant
          variant === "login" && [
            "w-full h-12 px-4 py-2",
            "bg-transparent text-white placeholder:text-gray-400",
            "border-b-2 border-gray-600",
            "focus:outline-none focus:border-blue-500",
            "relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0",
            "after:bg-blue-500 after:transition-all after:duration-300 after:ease-out",
            "focus:after:w-full hover:after:w-full",
            "transition-all duration-200",
          ],
          // Common styles
          "transition-all duration-200",
          error && "border-red-500 focus:ring-red-500",
          disabled && "opacity-50 cursor-not-allowed",
          fullWidth && "w-full",
          className
        )}
        {...props}
      />
    </div>
  );
};

export default Input;
