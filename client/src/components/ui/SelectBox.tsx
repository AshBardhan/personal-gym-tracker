import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import clsx from "clsx";

export interface SelectOption {
  value: string;
  label: string;
  searchTerms?: string[];
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
  required?: boolean;
  /** When true, a search field is rendered at the top of the open list. */
  searchable?: boolean;
}

const matchesQuery = (option: SelectOption, query: string): boolean => {
  const needle = query.toLowerCase();
  return (
    option.label.toLowerCase().includes(needle) ||
    option.value.toLowerCase().includes(needle) ||
    Boolean(
      option.searchTerms?.some((term) => term.toLowerCase().includes(needle)),
    )
  );
};

const SelectBox = ({
  label,
  value,
  onChange,
  onBlur,
  options,
  placeholder = "Select option",
  hasError = false,
  errorMessage,
  id,
  maxVisibleOptions = 10,
  allowCustomValue = true,
  required = false,
  searchable = false,
}: SelectBoxProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedOption = options.find((option) => option.value === value);
  const displayLabel = selectedOption?.label ?? (value || "");

  const filteredOptions =
    searchable && searchQuery.trim()
      ? options.filter((option) => matchesQuery(option, searchQuery.trim()))
      : options;

  const visibleOptions = filteredOptions.slice(0, maxVisibleOptions);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchQuery("");
        setSelectedIndex(-1);
        onBlur?.();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        setSearchQuery("");
        setSelectedIndex(-1);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onBlur]);

  useEffect(() => {
    if (isOpen && searchable) {
      searchInputRef.current?.focus();
    }
  }, [isOpen, searchable]);

  const closeList = () => {
    setIsOpen(false);
    setSearchQuery("");
    setSelectedIndex(-1);
  };

  const openList = () => {
    setIsOpen(true);
    setSearchQuery("");
    setSelectedIndex(-1);
  };

  const handleSelectOption = (option: SelectOption) => {
    onChange(option.value);
    closeList();
    triggerRef.current?.focus();
  };

  const commitCustomValue = () => {
    if (!allowCustomValue || !searchable) return;
    const next = searchQuery.trim();
    if (!next) return;
    onChange(next);
    closeList();
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setSelectedIndex(-1);
  };

  const handleListKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < visibleOptions.length - 1 ? prev + 1 : prev,
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && visibleOptions[selectedIndex]) {
          handleSelectOption(visibleOptions[selectedIndex]);
        } else if (visibleOptions.length === 1) {
          handleSelectOption(visibleOptions[0]);
        } else {
          commitCustomValue();
        }
        break;
    }
  };

  const handleTriggerKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (isOpen) {
        closeList();
      } else {
        openList();
      }
    }
  };

  const showError = hasError;
  const showList = isOpen;

  return (
    <div className="relative w-full" ref={wrapperRef}>
      {label && (
        <Label
          htmlFor={id}
          required={required}
          hasError={showError}
          className="mb-2"
        >
          {label}
        </Label>
      )}
      <button
        ref={triggerRef}
        type="button"
        id={id}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-required={required}
        onClick={() => (isOpen ? closeList() : openList())}
        onKeyDown={handleTriggerKeyDown}
        className={clsx(
          "flex w-full cursor-pointer items-center justify-between gap-2 rounded border text-left transition-colors",
          "px-3 py-3 text-base focus:outline-none",
          showError &&
            "border-red-600 bg-red-50 text-gray-900 focus:border-red-700 focus:ring-2 focus:ring-red-200 dark:bg-red-950 dark:text-white dark:focus:ring-red-800",
          !showError &&
            "border-gray-300 bg-white text-gray-900 focus:border-blue-500 dark:border-white dark:bg-black dark:text-white",
        )}
      >
        <span
          className={clsx(
            "truncate",
            !displayLabel && "text-gray-400 dark:text-gray-400",
          )}
        >
          {displayLabel || placeholder}
        </span>
        <ChevronDown
          size={16}
          aria-hidden
          className={clsx(
            "shrink-0 text-gray-400 transition-transform dark:text-gray-300",
            isOpen && "rotate-180",
          )}
        />
      </button>
      {showList && (
        <div
          className={clsx(
            "absolute top-full left-0 right-0 z-[1000] mt-1",
            "rounded border border-gray-300 bg-white shadow-lg dark:border-white dark:bg-black",
          )}
        >
          {searchable && (
            <div className="border-b border-gray-200 p-2 dark:border-white">
              <Input
                ref={searchInputRef}
                type="text"
                inputSize="small"
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyDown={handleListKeyDown}
                placeholder="Search..."
                autoComplete="off"
                showErrorOnBlur={false}
                aria-label={label ? `Search ${label}` : "Search options"}
              />
            </div>
          )}
          <ul
            role="listbox"
            tabIndex={searchable ? -1 : 0}
            onKeyDown={handleListKeyDown}
            className={clsx(
              "mb-0 max-h-80 list-none overflow-y-auto p-0",
              "[&::-webkit-scrollbar]:w-2",
              "[&::-webkit-scrollbar-track]:rounded [&::-webkit-scrollbar-track]:bg-gray-100 dark:[&::-webkit-scrollbar-track]:bg-neutral-900",
              "[&::-webkit-scrollbar-thumb]:rounded [&::-webkit-scrollbar-thumb]:bg-gray-400 hover:[&::-webkit-scrollbar-thumb]:bg-gray-500 dark:[&::-webkit-scrollbar-thumb]:bg-gray-500",
            )}
          >
            {visibleOptions.length === 0 ? (
              <li className="cursor-default px-4 py-3 text-sm text-gray-500 dark:text-gray-300">
                No results
              </li>
            ) : (
              <>
                {visibleOptions.map((option, index) => (
                  <li
                    key={option.value}
                    role="option"
                    aria-selected={option.value === value}
                    className={clsx(
                      "cursor-pointer border-b border-gray-200 px-4 py-3 last:border-b-0 transition-[background-color] dark:border-white dark:text-white",
                      index === selectedIndex &&
                        "bg-gray-100 dark:bg-neutral-800",
                      index !== selectedIndex &&
                        option.value === value &&
                        "bg-blue-50 dark:bg-blue-950",
                      index !== selectedIndex &&
                        option.value !== value &&
                        "hover:bg-gray-100 dark:hover:bg-neutral-800",
                    )}
                    onClick={() => handleSelectOption(option)}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    {option.label}
                  </li>
                ))}
                {filteredOptions.length > maxVisibleOptions && (
                  <li className="cursor-default py-2 text-center text-sm italic text-gray-500 hover:bg-transparent dark:text-gray-300">
                    +{filteredOptions.length - maxVisibleOptions} more
                    results...
                  </li>
                )}
              </>
            )}
          </ul>
        </div>
      )}
      {showError && errorMessage && (
        <span className="block text-red-600 text-sm mt-1">{errorMessage}</span>
      )}
    </div>
  );
};

export default SelectBox;
