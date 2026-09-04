import { ReactNode, useEffect, useRef, useState } from "react";
import clsx from "clsx";

export interface DropdownMenuItem {
  id?: string;
  label: ReactNode | string;
  onClick: () => void;
  variant?: "default" | "danger";
  selected?: boolean;
}

interface DropdownMenuProps {
  trigger: ReactNode | ((open: boolean) => ReactNode);
  items: DropdownMenuItem[];
  align?: "left" | "right";
  offset?: { x?: number; y?: number };
  size?: "small" | "medium";
  className?: string;
  triggerClassName?: string;
  "aria-label"?: string;
}

const DropdownMenu = ({
  trigger,
  items,
  align = "right",
  offset,
  size = "medium",
  className,
  triggerClassName,
  "aria-label": ariaLabel = "Open menu",
}: DropdownMenuProps) => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const { x: offsetX = 0, y: offsetY = 0 } = offset ?? { x: 0, y: 0 };

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <div className={clsx("relative", className)} ref={rootRef}>
      <button
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className={clsx(
          "inline-flex cursor-pointer items-center justify-center border-none transition-colors",
          triggerClassName ??
            "rounded-md bg-transparent p-1.5 text-gray-600 hover:bg-gray-300/60 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-neutral-800 dark:hover:text-white",
        )}
      >
        {typeof trigger === "function" ? trigger(open) : trigger}
      </button>

      {open && (
        <div
          role="menu"
          className={clsx(
            "absolute z-50 mt-1 min-w-[10rem] rounded-md border border-gray-200 bg-white py-1 shadow-lg dark:border-white dark:bg-black",
            align === "right" ? "right-0" : "left-0",
          )}
          style={{
            transform: `translate(${offsetX}px, ${offsetY}px)`,
          }}
        >
          {items.map((item, index) => (
            <button
              key={
                item.id ?? (typeof item.label === "string" ? item.label : index)
              }
              type="button"
              role="menuitem"
              aria-current={item.selected ? "true" : undefined}
              className={clsx(
                "flex w-full cursor-pointer items-center gap-3 border-none bg-transparent text-left text-sm transition-colors",
                size === "small" ? "px-2 py-1" : "px-4 py-2",
                item.variant === "danger" &&
                  "text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950",
                item.variant !== "danger" &&
                  item.selected &&
                  "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300",
                item.variant !== "danger" &&
                  !item.selected &&
                  "text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-neutral-800",
              )}
              onClick={() => {
                setOpen(false);
                item.onClick();
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
