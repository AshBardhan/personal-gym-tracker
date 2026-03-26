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
    "block p-4 sm:p-6 bg-white border border-gray-200 rounded-lg shadow-sm transition-colors",
    href && "hover:bg-gray-100 hover:shadow-md cursor-pointer",
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
