import { ButtonHTMLAttributes, ReactNode } from "react";
import "./Button.css";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "positive" | "icon-only";
  children: ReactNode;
}

const Button = ({
  variant = "primary",
  className = "",
  children,
  ...props
}: ButtonProps) => {
  return (
    <button {...props} className={`btn btn-${variant} ${className}`.trim()}>
      {children}
    </button>
  );
};

export default Button;
