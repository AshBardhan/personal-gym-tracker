import React, { ElementType, ReactNode } from "react";
import clsx from "clsx";

type ButtonProps<T extends ElementType> = {
  as?: T;
  variant?: "primary" | "secondary" | "danger" | "positive" | "icon-only";
  size?: "small" | "medium" | "large";
  className?: string;
  children: ReactNode;
} & Omit<React.ComponentPropsWithoutRef<T>, "as" | "className">;

const Button = <T extends ElementType = "button">({
  as,
  variant = "primary",
  size = "medium",
  className = "",
  children,
  ...props
}: ButtonProps<T>) => {
  const Component = as || "button";

  return (
    <Component
      {...props}
      className={clsx(
        "inline-flex items-center justify-center border-none cursor-pointer font-inherit no-underline transition-colors",
        "disabled:opacity-60 disabled:cursor-not-allowed",
        variant === "primary" &&
          "bg-blue-500 hover:bg-blue-600 text-white rounded gap-2",
        variant === "secondary" &&
          "bg-gray-500 hover:bg-gray-600 text-white rounded gap-2",
        variant === "danger" &&
          "bg-red-600 hover:bg-red-700 text-white rounded gap-2",
        variant === "positive" &&
          "bg-green-600 hover:bg-green-700 text-white rounded gap-2",
        variant === "icon-only" &&
          "bg-transparent text-gray-500 hover:text-gray-700 p-1 min-w-0 transition-all",
        variant !== "icon-only" && size === "small" && "px-2 py-1 text-xs",
        variant !== "icon-only" && size === "medium" && "px-4 py-2 text-sm",
        variant !== "icon-only" && size === "large" && "px-6 py-3 text-lg",
        className,
      )}
    >
      {children}
    </Component>
  );
};

export default Button;
