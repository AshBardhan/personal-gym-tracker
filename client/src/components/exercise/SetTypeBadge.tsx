import { SetType } from "@/types/entities";
import { getSetTypeThemeClass } from "@/utils/exerciseUtils";
import clsx from "clsx";

interface SetTypeBadgeProps {
  type: SetType;
  size?: "small" | "medium";
  children: React.ReactNode;
}

export const SetTypeBadge = ({
  type,
  size = "medium",
  children,
}: SetTypeBadgeProps) => (
  <div
    className={clsx(
      "flex items-center justify-center gap-0.5 rounded-full font-semibold text-xs",
      size === "small"
        ? "h-6 min-w-6 text-xs px-1"
        : "h-8 min-w-8 text-sm px-2",
      getSetTypeThemeClass(type),
    )}
  >
    {children}
  </div>
);
