import React from "react";
import { twMerge } from "tailwind-merge";
import { clsx, type ClassValue } from "clsx";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface TextboxProps extends React.HTMLAttributes<HTMLTextAreaElement> {
  disabled?: boolean;
}

const Textbox: React.FC<TextboxProps> = ({ className, disabled, ...props }) => {
  return (
    <textarea
      className={cn(
        "bg-gray-100",
        "relative",
        "border border-black",
        "text-black",
        { "cursor-not-allowed": disabled },
        className
      )}
      {...props}
      disabled={disabled}
    ></textarea>
  );
};

export default Textbox;
