import React from "react";
import { twMerge } from "tailwind-merge";
import { clsx, type ClassValue } from "clsx";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

const Label: React.FC<LabelProps> = ({ className, required, children, ...props }) => {
  return (
    <label
      className={cn(
        "text-sm font-medium text-gray-700",
        { "after:content-['*'] after:ml-0.5 after:text-red-500": required },
        className
      )}
      {...props}
    >
      {children}
    </label>
  );
};

export default Label;
