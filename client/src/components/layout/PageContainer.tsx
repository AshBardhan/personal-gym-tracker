import { ReactNode } from "react";
import clsx from "clsx";

interface PageContainerProps {
  className?: string;
  children: ReactNode;
}

/**
 * Shared content width + horizontal padding for navbar, headers, and page bodies.
 */
const PageContainer = ({ className = "", children }: PageContainerProps) => {
  return (
    <div
      className={clsx(
        "mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8",
        className,
      )}
    >
      {children}
    </div>
  );
};

export default PageContainer;
