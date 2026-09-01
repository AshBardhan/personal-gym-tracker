import {
  ChangeEvent,
  FocusEvent,
  forwardRef,
  InputHTMLAttributes,
  useState,
} from "react";
import clsx from "clsx";
import Label from "@/components/ui/Label";

interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  label?: string;
  validate?: (value: string | number) => boolean;
  errorMessage?: string;
  showErrorOnBlur?: boolean;
  forceShowError?: boolean;
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
      forceShowError = false,
      className = "",
      type = "text",
      inputSize = "normal",
      required,
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

    const isInvalid = validate
      ? !validate(props.value as string | number)
      : hasError;
    const showError = (touched && hasError) || (forceShowError && isInvalid);

    return (
      <div className="flex-1 space-y-1">
        {label && (
          <Label
            htmlFor={props.id}
            required={required}
            hasError={showError}
            size={inputSize}
          >
            {label}
          </Label>
        )}
        <input
          {...props}
          required={required}
          aria-required={required}
          type={type}
          ref={ref}
          className={clsx(
            "w-full border rounded transition-colors box-border",
            inputSize === "normal" && "px-3 py-3 text-base",
            inputSize === "small" && "px-2 py-2 text-sm",
            "focus:outline-none",
            showError &&
              "border-red-600 bg-red-50 focus:border-red-700 focus:ring-2 focus:ring-red-200 dark:bg-red-950 dark:text-white dark:focus:ring-red-800",
            !showError &&
              "border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:border-blue-500 dark:border-white dark:bg-black dark:text-white dark:placeholder:text-gray-400",
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
