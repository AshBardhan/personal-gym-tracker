import { ReactNode } from "react";
import clsx from "clsx";

interface TileProps {
  children: ReactNode;
  className?: string;
}

const Tile = ({ children, className }: TileProps) => {
  const classes = clsx(
    "block rounded-md p-4 transition-colors",
    "bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200",
    "border border-gray-200 dark:border-transparent",
    className,
  );

  return <div className={classes}>{children}</div>;
};

export default Tile;
