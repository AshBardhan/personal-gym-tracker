import clsx from "clsx";

interface SkeletonProps {
  variant?: "rectangular" | "circular";
  width?: string | number;
  height?: string | number;
  className?: string;
  animate?: boolean;
}

const Skeleton = ({
  variant = "rectangular",
  width,
  height,
  className = "",
  animate = true,
}: SkeletonProps) => {
  const getSkeletonHeight = () => {
    const defaultHeight = height || "20px";
    return typeof defaultHeight === "number"
      ? `${defaultHeight}px`
      : defaultHeight;
  };

  const getSkeletonWidth = () => {
    const defaultWidth = width || (variant === "circular" ? "20px" : "100%");
    return typeof defaultWidth === "number"
      ? `${defaultWidth}px`
      : defaultWidth;
  };

  const styles = {
    width: getSkeletonWidth(),
    height: getSkeletonHeight(),
  };

  return (
    <div
      className={clsx(
        "bg-gray-200 dark:bg-neutral-800",
        animate && "animate-pulse",
        variant === "rectangular" && "rounded-md",
        variant === "circular" && "rounded-full",
        className,
      )}
      style={styles}
      aria-busy="true"
      aria-live="polite"
    />
  );
};

export default Skeleton;
