import { ReactNode, useEffect, useRef, useState } from "react";
import clsx from "clsx";

interface DropdownMenuItem {
  label: string;
  onClick: () => void;
  variant?: "default" | "danger";
}

interface DropdownMenuProps {
  trigger: ReactNode;
  items: DropdownMenuItem[];
  align?: "left" | "right";
  "aria-label"?: string;
}

const DropdownMenu = ({
  trigger,
  items,
  align = "right",
  "aria-label": ariaLabel = "Open menu",
}: DropdownMenuProps) => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (
        rootRef.current &&
        !rootRef.current.contains(event.target as Node)
      ) {
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
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex items-center justify-center rounded-md border-none bg-transparent p-1.5 text-gray-600 transition-colors hover:bg-gray-300/60 hover:text-gray-900 cursor-pointer"
      >
        {trigger}
      </button>

      {open && (
        <div
          role="menu"
          className={clsx(
            "absolute z-50 mt-1 min-w-[10rem] rounded-md border border-gray-200 bg-white py-1 shadow-lg",
            align === "right" ? "right-0" : "left-0",
          )}
        >
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              role="menuitem"
              className={clsx(
                "block w-full cursor-pointer border-none bg-transparent px-4 py-2 text-left text-sm transition-colors",
                item.variant === "danger"
                  ? "text-red-600 hover:bg-red-50"
                  : "text-gray-700 hover:bg-gray-100",
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
