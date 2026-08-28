import { ReactNode } from "react";
import clsx from "clsx";

interface TextProps {
  variant?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "div";
  className?: string;
  children: ReactNode;
}

const Text = ({
  variant = "div",
  className = "",
  children,
}: TextProps) => {
  const classes = clsx(
    variant === "h1" && "text-3xl font-bold",
    variant === "h2" && "text-2xl font-bold",
    variant === "h3" && "text-xl font-semibold",
    variant === "h4" && "text-lg font-semibold",
    variant === "h5" && "text-base font-medium",
    variant === "h6" && "text-sm font-medium",
    (variant === "p" || variant === "div") && "text-base",
    className,
  );

  switch (variant) {
    case "h1":
      return <h1 className={classes}>{children}</h1>;
    case "h2":
      return <h2 className={classes}>{children}</h2>;
    case "h3":
      return <h3 className={classes}>{children}</h3>;
    case "h4":
      return <h4 className={classes}>{children}</h4>;
    case "h5":
      return <h5 className={classes}>{children}</h5>;
    case "h6":
      return <h6 className={classes}>{children}</h6>;
    case "p":
      return <p className={classes}>{children}</p>;
    default:
      return <div className={classes}>{children}</div>;
  }
};

export default Text;
