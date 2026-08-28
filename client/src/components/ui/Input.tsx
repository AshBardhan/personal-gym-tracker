import {
  ChangeEvent,
  FocusEvent,
  forwardRef,
  InputHTMLAttributes,
  useState,
} from "react";
import clsx from "clsx";

interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  label?: string;
  validate?: (value: string | number) => boolean;
  errorMessage?: string;
  showErrorOnBlur?: boolean;
  type?: "text" | "number" | "date" | "password" | "email";
  inputSize?: "small" | "normal";
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      validate,
      errorMessage = "This field is required",
      showErrorOnBlur = true,
      className = "",
      type = "text",
      inputSize = "normal",
      ...props
    },
    ref,
  ) => {
    const [touched, setTouched] = useState(false);
    const [hasError, setHasError] = useState(false);

    const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
      if (showErrorOnBlur) {
        setTouched(true);
        if (validate) {
          setHasError(!validate(e.target.value));
        }
      }
      props.onBlur?.(e);
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      if (touched && validate) {
        setHasError(!validate(e.target.value));
      }
      props.onChange?.(e);
    };

    const showError = touched && hasError;

    return (
      <div className="flex-1 space-y-1">
        {label && (
          <label
            htmlFor={props.id}
            className={clsx(
              "cursor-pointer font-medium",
              showError && "text-red-600",
              !showError && "text-gray-800",
              inputSize === "small" && "text-xs",
              inputSize === "normal" && "text-sm",
            )}
          >
            {label}
          </label>
        )}
        <input
          {...props}
          type={type}
          ref={ref}
          className={clsx(
            "w-full border rounded transition-colors box-border",
            inputSize === "normal" && "px-3 py-3 text-base",
            inputSize === "small" && "px-2 py-2 text-sm",
            "focus:outline-none",
            showError &&
              "border-red-600 bg-red-50 focus:border-red-700 focus:ring-2 focus:ring-red-200",
            !showError && "border-gray-300 focus:border-blue-500",
            className,
          )}
          onBlur={handleBlur}
          onChange={handleChange}
        />
        {showError && errorMessage && (
          <span className="block text-red-600 text-sm mt-1">
            {errorMessage}
          </span>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
