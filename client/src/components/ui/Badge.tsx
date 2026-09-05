import { ReactNode } from "react";
import { X } from "lucide-react";
import clsx from "clsx";

interface BadgeProps {
  children: ReactNode;
  onRemove?: () => void;
  className?: string;
  size?: "normal" | "small";
}

const Badge = ({ children, onRemove, className, size = "normal" }: BadgeProps) => {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 rounded-full border border-gray-300 bg-white text-gray-800 dark:border-white dark:bg-neutral-900 dark:text-gray-100",
        size === "small" ? "text-xs px-2 py-0.5" : "text-sm px-3 py-1",
        className,
      )}
    >
      {children}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${typeof children === "string" ? children : "filter"}`}
          className="ml-0.5 inline-flex cursor-pointer items-center justify-center rounded-full border-none bg-transparent p-0.5 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-neutral-700 dark:hover:text-white"
        >
          <X size={14} />
        </button>
      )}
    </span>
  );
};

export default Badge;
