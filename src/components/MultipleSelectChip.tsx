"use client";
import React, {
  useState,
  useEffect,
  useRef,
  MouseEvent as ReactMouseEvent,
} from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
      <label htmlFor="multiple-chip" className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-1">
        {label}
      </label>
      <div className="relative mt-1" ref={dropdownRef}>
        <Button
          variant="outline"
          className="w-full p-2 flex justify-start items-center h-auto min-h-10 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl"
          onClick={handleButtonClick}
        >
          {selectedTags.length === 0 ? (
            <span className="text-xs text-zinc-400 font-semibold pl-1">Select tags...</span>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {selectedTags.map((value) => (
                <Badge key={value} variant="secondary" className="bg-primary/10 text-primary border-transparent hover:bg-primary/20 text-[10px] font-bold px-2 py-0.5 rounded-md">
                  {value}
                </Badge>
              ))}
            </div>
          )}
        </Button>
        {dropdownOpen && (
          <ul className="absolute left-0 right-0 mt-1.5 max-h-40 overflow-y-auto border border-zinc-200 dark:border-zinc-800 rounded-xl z-30 bg-white dark:bg-zinc-950 shadow-md p-1.5 space-y-0.5">
            {tags.map((name) => (
              <li
                key={name}
                data-value={name}
                onClick={handleChange}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg cursor-pointer transition-colors ${
                  selectedTags.includes(name)
                    ? "text-primary bg-primary/10"
                    : "hover:text-primary hover:bg-primary/10 text-zinc-700 dark:text-zinc-300"
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
