import React from "react";
import { twMerge } from "tailwind-merge";
import { clsx, type ClassValue } from "clsx";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
  label?: string;
  error?: boolean;
  fullWidth?: boolean;
}

const Select: React.FC<SelectProps> = ({
  className,
  options,
  label,
  error,
  fullWidth,
  disabled,
  ...props
}) => {
  return (
    <div className={cn("flex flex-col gap-1", fullWidth && "w-full")}>
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}
      <select
        disabled={disabled}
        className={cn(
          "px-4 py-2 rounded-lg border border-gray-300",
          "bg-white text-gray-900",
          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
          "transition-all duration-200",
          error && "border-red-500 focus:ring-red-500",
          disabled && "opacity-50 cursor-not-allowed bg-gray-50",
          fullWidth && "w-full",
          className
        )}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
