import clsx from "clsx";

interface MetricProps {
  direction?: "row" | "column";
  label: string;
  value: string | number;
  size?: "sm" | "md" | "lg";
  reverse?: boolean;
  className?: string;
}

const labelSizeClasses = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
};

const valueSizeClasses = {
  sm: "text-base",
  md: "text-lg",
  lg: "text-xl",
};

const Metric = ({
  direction = "column",
  label,
  value,
  size = "md",
  reverse = false,
  className,
}: MetricProps) => {
  const formatValue = (val: string | number) => {
    if (typeof val === "number") {
      return val.toLocaleString();
    }
    return val;
  };

  return (
    <div
      className={clsx(
        "flex",
        direction === "row" ? "flex-row items-baseline gap-1" : "flex-col",
        className,
      )}
    >
      <div
        className={clsx(
          "text-gray-500",
          labelSizeClasses[size],
          reverse && "order-2",
        )}
      >
        {label}
      </div>
      <div
        className={clsx(
          "font-semibold text-gray-900 leading-none",
          valueSizeClasses[size],
        )}
      >
        {formatValue(value)}
      </div>
    </div>
  );
};

export default Metric;
