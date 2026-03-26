import { ReactNode, ElementType } from "react";
import clsx from "clsx";

interface TextProps {
  variant?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "div";
  className?: string;
  children: ReactNode;
  [key: string]: any;
}

const Text = ({
  variant = "div",
  className = "",
  children,
  ...props
}: TextProps) => {
  const Component = variant as ElementType;

  return (
    <Component
      className={clsx(
        variant === "h1" && "text-3xl font-bold",
        variant === "h2" && "text-2xl font-bold",
        variant === "h3" && "text-xl font-semibold",
        variant === "h4" && "text-lg font-semibold",
        variant === "h5" && "text-base font-medium",
        variant === "h6" && "text-sm font-medium",
        variant === "p" && "text-base",
        variant === "div" && "text-base",
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Text;
