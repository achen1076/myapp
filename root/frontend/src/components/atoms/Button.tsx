import React from "react";
import { twMerge } from "tailwind-merge";
import { clsx, type ClassValue } from "clsx";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ className, disabled, ...props }) => {
  return (
    <button
      className={cn(
        "button__basic",
        "relative",
        { "cursor-not-allowed": disabled },
        className
      )}
      {...props}
      disabled
    >
      Button
    </button>
  );
};

export default Button;
