import { useState, InputHTMLAttributes, RefObject } from "react";
import clsx from "clsx";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  validate?: (value: string | number) => boolean;
  errorMessage?: string;
  showErrorOnBlur?: boolean;
  ref?: RefObject<HTMLInputElement | null>;
}

const Input = ({
  label,
  validate,
  errorMessage = "This field is required",
  showErrorOnBlur = true,
  className = "",
  ref,
  ...props
}: InputProps) => {
  const [touched, setTouched] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (showErrorOnBlur) {
      setTouched(true);
      if (validate) {
        setHasError(!validate(e.target.value));
      }
    }
    if (props.onBlur) {
      props.onBlur(e);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Clear error when user starts typing
    if (touched && validate) {
      setHasError(!validate(e.target.value));
    }
    if (props.onChange) {
      props.onChange(e);
    }
  };

  const showError = touched && hasError;

  return (
    <div className="flex-1">
      {label && (
        <label htmlFor={props.id} className="mb-1">
          {label}
        </label>
      )}
      <input
        {...props}
        ref={ref}
        className={clsx(
          "w-full px-3 py-3 border rounded text-base transition-colors box-border",
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
        <span className="block text-red-600 text-sm mt-1">{errorMessage}</span>
      )}
    </div>
  );
};

export default Input;
