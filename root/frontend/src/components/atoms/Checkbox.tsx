import React from "react";
import { twMerge } from "tailwind-merge";
import { clsx, type ClassValue } from "clsx";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  disabled?: boolean;
}

const Checkbox: React.FC<CheckboxProps> = ({ className, disabled, ...props }) => {
  return (
    <input
      type="checkbox"
      className={cn(
        "h-4 w-4 rounded border-gray-300 text-blue-600",
        "focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
        { "cursor-not-allowed opacity-50": disabled },
        className
      )}
      disabled={disabled}
      {...props}
    />
  );
};

export default Checkbox;
