// components/ui/Button.tsx
import React, { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      fullWidth = false,
      disabled,
      ...props
    },
    ref
  ) => {
    const variants = {
      primary:
        "bg-black hover:bg-indigo-700 text-white border border-transparent",
      secondary:
        "bg-gray-100 hover:bg-gray-200 text-black border border-transparent",
      outline:
        "bg-transparent hover:bg-gray-50 text-black border border-black hover:border-indigo-700 hover:text-indigo-700",
    };

    const sizes = {
      sm: "text-xs py-1 px-3",
      md: "text-sm py-2 px-4",
      lg: "text-base py-3 px-6",
    };

    const buttonStyles = twMerge(
      "rounded-xl font-semibold inline-flex items-center justify-center transition-colors duration-300 ease-in-out hover:scale-105 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100",
      variants[variant],
      sizes[size],
      fullWidth ? "w-full" : "",
      className
    );

    return (
      <button
        className={buttonStyles}
        disabled={isLoading || disabled}
        ref={ref}
        {...props}
      >
        {isLoading ? (
          <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
