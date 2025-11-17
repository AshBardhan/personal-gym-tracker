import { useState, useRef, useEffect } from "react";
import Input from "./Input";
import "./SelectBox.css";

export interface SelectOption {
  value: string;
  label: string;
  searchTerms?: string[]; // Additional terms to search by (e.g., categories, tags)
}

interface SelectBoxProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  options: SelectOption[];
  placeholder?: string;
  hasError?: boolean;
  errorMessage?: string;
  id?: string;
  maxVisibleOptions?: number;
  allowCustomValue?: boolean;
}

const SelectBox = ({
  label,
  value,
  onChange,
  onBlur,
  options,
  placeholder = "Search or select...",
  hasError = false,
  errorMessage,
  id,
  maxVisibleOptions = 10,
  allowCustomValue = true,
}: SelectBoxProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(value);
  const [filteredOptions, setFilteredOptions] =
    useState<SelectOption[]>(options);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [touched, setTouched] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSearchQuery(value);
  }, [value]);

  useEffect(() => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const results = options.filter((option) => {
        const labelMatch = option.label.toLowerCase().includes(query);
        const valueMatch = option.value.toLowerCase().includes(query);
        const searchTermsMatch = option.searchTerms?.some((term) =>
          term.toLowerCase().includes(query),
        );
        return labelMatch || valueMatch || searchTermsMatch;
      });
      setFilteredOptions(results);
    } else {
      setFilteredOptions(options);
    }
    setSelectedIndex(-1);
  }, [searchQuery, options]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setTouched(true);
        if (onBlur) onBlur();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onBlur]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchQuery(newValue);

    if (allowCustomValue) {
      onChange(newValue);
    }

    setIsOpen(true);
  };

  const handleSelectOption = (option: SelectOption) => {
    setSearchQuery(option.label);
    onChange(option.value);
    setIsOpen(false);
    setTouched(true);
    inputRef.current?.blur();
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const handleInputBlur = () => {
    setTouched(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "Enter") {
        setIsOpen(true);
        e.preventDefault();
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < Math.min(filteredOptions.length, maxVisibleOptions) - 1
            ? prev + 1
            : prev,
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && filteredOptions[selectedIndex]) {
          handleSelectOption(filteredOptions[selectedIndex]);
        } else if (filteredOptions.length === 1) {
          handleSelectOption(filteredOptions[0]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        inputRef.current?.blur();
        break;
    }
  };

  const showError = touched && hasError;

  return (
    <div className="select-box" ref={wrapperRef}>
      {label && <label htmlFor={id}>{label}</label>}
      <div className="select-box-input-wrapper">
        <Input
          ref={inputRef}
          type="text"
          id={id}
          value={searchQuery}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={showError ? "input--error" : ""}
          autoComplete="off"
          showErrorOnBlur={false}
        />
      </div>
      {isOpen && filteredOptions.length > 0 && (
        <ul className="select-box-dropdown">
          {filteredOptions.slice(0, maxVisibleOptions).map((option, index) => (
            <li
              key={option.value}
              className={index === selectedIndex ? "selected" : ""}
              onClick={() => handleSelectOption(option)}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              {option.label}
            </li>
          ))}
          {filteredOptions.length > maxVisibleOptions && (
            <li className="more-results">
              +{filteredOptions.length - maxVisibleOptions} more results...
            </li>
          )}
        </ul>
      )}
      {showError && errorMessage && (
        <span className="select-box-error-message">{errorMessage}</span>
      )}
    </div>
  );
};

export default SelectBox;
