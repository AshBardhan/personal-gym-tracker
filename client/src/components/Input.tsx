import { useState, InputHTMLAttributes } from "react";
import "./Input.css";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  validate?: (value: string | number) => boolean;
  errorMessage?: string;
  showErrorOnBlur?: boolean;
}

const Input = ({
  label,
  validate,
  errorMessage = "This field is required",
  showErrorOnBlur = true,
  className = "",
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
    <div className="input-wrapper">
      {label && <label htmlFor={props.id}>{label}</label>}
      <input
        {...props}
        className={`${className} ${showError ? "input--error" : ""}`.trim()}
        onBlur={handleBlur}
        onChange={handleChange}
      />
      {showError && errorMessage && (
        <span className="input-error-message">{errorMessage}</span>
      )}
    </div>
  );
};

export default Input;
