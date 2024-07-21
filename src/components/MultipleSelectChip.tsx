"use client";
import { Button, Chip } from "@nextui-org/react";
import React, {
  useState,
  useEffect,
  useRef,
  MouseEvent as ReactMouseEvent,
} from "react";

interface SelectProps {
  tags: string[];
  label: string;
  selectedTags: string[];
  onTagChange: (tags: string[]) => void;
}

const MultipleSelectChip: React.FC<SelectProps> = ({
  tags,
  label,
  selectedTags,
  onTagChange,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleChange = (event: ReactMouseEvent<HTMLLIElement>) => {
    const value = event.currentTarget.getAttribute("data-value");
    if (value) {
      const newSelection = [...selectedTags];
      const index = newSelection.indexOf(value);
      if (index > -1) {
        newSelection.splice(index, 1);
      } else {
        newSelection.push(value);
      }
      onTagChange(newSelection);
    }
  };

  const handleButtonClick = (e: ReactMouseEvent) => {
    e.preventDefault();
    setDropdownOpen((prev) => !prev);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full">
      <label htmlFor="multiple-chip" className="text-sm">
        {label}
      </label>
      <div className="relative mt-1" ref={dropdownRef}>
        <Button
          variant="flat"
          className="w-full p-2 flex justify-start"
          onClick={handleButtonClick}
        >
          {selectedTags.length === 0 ? (
            <span className="text-sm">Select...</span>
          ) : (
            <div className="flex flex-wrap gap-2">
              {selectedTags.map((value) => (
                // <div
                //   key={value}
                //   className="inline-flex items-center px-2 py-1 text-primary bg-primary bg-opacity-10 rounded-full text-sm"
                // >
                //   {value}
                // </div>
                <Chip key={value} variant="flat" size="sm" color="primary">
                  {value}
                </Chip>
              ))}
            </div>
          )}
        </Button>
        {dropdownOpen && (
          <ul className="absolute left-0 right-0 mt-1 max-h-40 overflow-y-auto border rounded z-30 bg-white dark:bg-[#222327]">
            {tags.map((name) => (
              <li
                key={name}
                data-value={name}
                onClick={handleChange}
                className={`px-2 py-1 cursor-pointer ${
                  selectedTags.includes(name)
                    ? "text-primary bg-primary bg-opacity-10"
                    : "hover:text-primary hover:bg-primary hover:bg-opacity-10"
                }`}
              >
                {name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MultipleSelectChip;
