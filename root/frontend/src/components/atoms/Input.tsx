import React from "react";
import { twMerge } from "tailwind-merge";
import { clsx, type ClassValue } from "clsx";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface InputProps extends React.HTMLAttributes<HTMLInputElement> {
  disabled?: boolean;
}

const Input: React.FC<InputProps> = ({ className, disabled, ...props }) => {
  return (
    <input
      className={cn(
        "bg-red-500",
        "relative",
        { "cursor-not-allowed": disabled },
        className
      )}
      {...props}
      disabled
    ></input>
  );
};

export default Input;
