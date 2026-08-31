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
    "app-card block rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-colors sm:p-6 dark:border-transparent dark:shadow-sm",
    href &&
      "cursor-pointer hover:bg-gray-100 hover:shadow-md dark:hover:bg-neutral-700",
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
