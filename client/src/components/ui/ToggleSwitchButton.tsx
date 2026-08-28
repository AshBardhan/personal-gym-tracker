import { ReactNode } from "react";
import clsx from "clsx";

interface ToggleOption {
  value: string;
  label?: string;
  icon?: ReactNode;
  ariaLabel?: string;
}

interface ToggleSwitchButtonProps {
  options: ToggleOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  size?: "small" | "medium";
  "aria-label"?: string;
}

/**
 * Segmented toggle control for switching between discrete options
 * (e.g. Grid / List view).
 */
const ToggleSwitchButton = ({
  options,
  value,
  onChange,
  className = "",
  size = "medium",
  "aria-label": ariaLabel = "Toggle view",
}: ToggleSwitchButtonProps) => {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={clsx(
        "inline-flex items-center rounded-lg border border-gray-300 bg-gray-100 p-0.5",
        className,
      )}
    >
      {options.map((option) => {
        const isActive = option.value === value;

        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={isActive}
            aria-label={option.ariaLabel ?? option.label ?? option.value}
            title={option.ariaLabel ?? option.label ?? option.value}
            onClick={() => onChange(option.value)}
            className={clsx(
              "inline-flex items-center justify-center gap-1.5 rounded-md border-none cursor-pointer font-medium transition-colors",
              size === "small" && "px-2 py-1.5 text-xs",
              size === "medium" && "px-3 py-2 text-sm",
              isActive
                ? "bg-white text-gray-900 shadow-sm"
                : "bg-transparent text-gray-500 hover:text-gray-700",
            )}
          >
            {option.icon}
            {option.label && <span>{option.label}</span>}
          </button>
        );
      })}
    </div>
  );
};

export default ToggleSwitchButton;
