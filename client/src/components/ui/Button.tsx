import { ButtonHTMLAttributes, ReactNode } from "react";
import { Link } from "react-router-dom";
import clsx from "clsx";

interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> {
  variant?: "primary" | "secondary" | "danger" | "positive" | "icon-only";
  size?: "small" | "medium" | "large";
  className?: string;
  children: ReactNode;
  /** When set, renders as a React Router Link instead of a button */
  to?: string;
}

const Button = ({
  variant = "primary",
  size = "medium",
  className = "",
  children,
  to,
  type = "button",
  ...props
}: ButtonProps) => {
  const classes = clsx(
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
  );

  if (to) {
    return (
      <Link to={to} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  );
};

export default Button;
