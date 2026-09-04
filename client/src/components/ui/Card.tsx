import { Link } from "react-router-dom";
import { ReactNode } from "react";
import clsx from "clsx";

interface CardProps {
  children: ReactNode;
  className?: string;
  href?: string;
}

const Card = ({ children, className, href }: CardProps) => {
  const classes = clsx(
    "block rounded-lg p-4 transition-colors shadow-sm sm:p-6",
    "bg-white dark:bg-neutral-950",
    "border border-gray-200 dark:border-transparent",
    href &&
      "cursor-pointer hover:bg-gray-50 hover:shadow-md dark:hover:bg-neutral-900",
    className,
  );

  if (href) {
    return (
      <Link to={href} className={classes}>
        {children}
      </Link>
    );
  }

  return <div className={classes}>{children}</div>;
};

export default Card;
