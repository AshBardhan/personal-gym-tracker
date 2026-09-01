import { LabelHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  children: ReactNode;
  required?: boolean;
  hasError?: boolean;
  size?: "small" | "normal";
}

const Label = ({
  children,
  required = false,
  hasError = false,
  size = "normal",
  className,
  ...props
}: LabelProps) => {
  return (
    <label
      {...props}
      className={clsx(
        "flex gap-1 cursor-pointer font-medium",
        size === "small" && "text-xs",
        size === "normal" && "text-sm",
        hasError ? "text-red-600" : "text-gray-800 dark:text-white",
        className,
      )}
    >
      {children}
      {required && (
        <span className="text-red-600 text-sm self-start" aria-hidden="true">
          *
        </span>
      )}
    </label>
  );
};

export default Label;
