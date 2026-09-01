import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import clsx from "clsx";
import Label from "@/components/ui/Label";

export interface MultiSelectOption {
  value: string;
  label: string;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  label?: string;
  id?: string;
  "aria-label"?: string;
  className?: string;
  size?: "small" | "normal";
  showEmptyOption?: boolean;
}

const MultiSelect = ({
  options,
  value,
  onChange,
  placeholder = "All muscles",
  label,
  id,
  "aria-label": ariaLabel,
  className,
  size = "small",
  showEmptyOption = true,
}: MultiSelectProps) => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

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

  const selectedCount = value.length;
  const triggerLabel =
    selectedCount === 0
      ? placeholder
      : selectedCount === 1
        ? (options.find((option) => option.value === value[0])?.label ??
          placeholder)
        : `${selectedCount} muscles`;

  const toggleOption = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((item) => item !== optionValue));
      return;
    }
    onChange([...value, optionValue]);
  };

  const selectAll = () => {
    onChange([]);
  };

  return (
    <div className={clsx("relative w-full", className)} ref={rootRef}>
      {label && (
        <Label htmlFor={id} className="mb-1">
          {label}
        </Label>
      )}
      <button
        type="button"
        id={id}
        aria-label={ariaLabel ?? label}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-multiselectable="true"
        onClick={() => setOpen((prev) => !prev)}
        className={clsx(
          "flex w-full cursor-pointer items-center justify-between gap-2 rounded border text-left transition-colors",
          size === "small" && "px-2 py-2 text-sm",
          size === "normal" && "px-3 py-3 text-base",
          "border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:outline-none dark:border-white dark:bg-black dark:text-white",
        )}
      >
        <span
          className={clsx(
            "truncate",
            selectedCount === 0 && "text-gray-400 dark:text-gray-400",
          )}
        >
          {triggerLabel}
        </span>
        <ChevronDown
          size={16}
          className={clsx(
            "shrink-0 text-gray-400 transition-transform dark:text-gray-300",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-multiselectable="true"
          className={clsx(
            "absolute top-full left-0 right-0 z-[1000] mt-1 mb-0 list-none p-0",
            "max-h-80 overflow-y-auto rounded border border-gray-300 bg-white shadow-lg dark:border-white dark:bg-black",
          )}
        >
          {showEmptyOption && (
            <li
              role="option"
              aria-selected={selectedCount === 0}
              className={clsx(
                "flex cursor-pointer items-center gap-2 border-b border-gray-200 px-3 py-2.5 text-sm dark:border-white dark:text-white",
                selectedCount === 0
                  ? "bg-gray-100 dark:bg-neutral-800"
                  : "hover:bg-gray-100 dark:hover:bg-neutral-800",
              )}
              onClick={selectAll}
            >
              <span className="flex h-4 w-4 shrink-0 items-center justify-center">
                {selectedCount === 0 && <Check size={14} />}
              </span>
              {placeholder}
            </li>
          )}
          {options.map((option) => {
            const selected = value.includes(option.value);
            return (
              <li
                key={option.value}
                role="option"
                aria-selected={selected}
                className={clsx(
                  "flex cursor-pointer items-center gap-2 border-b border-gray-200 px-3 py-2.5 text-sm last:border-b-0 dark:border-white dark:text-white",
                  selected
                    ? "bg-gray-100 dark:bg-neutral-800"
                    : "hover:bg-gray-100 dark:hover:bg-neutral-800",
                )}
                onClick={() => toggleOption(option.value)}
              >
                <span className="flex h-4 w-4 shrink-0 items-center justify-center">
                  {selected && <Check size={14} />}
                </span>
                {option.label}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default MultiSelect;
