import React, { useState, MouseEvent } from "react";

const tags = [
  "Oliver Hansen",
  "Van Henry",
  "April Tucker",
  "Ralph Hubbard",
  "Omar Alexander",
  "Carlos Abbott",
  "Miriam Wagner",
  "Bradley Wilkerson",
  "Virginia Andrews",
  "Kelly Snyder",
];

const MultipleSelectChip: React.FC = () => {
  const [tagName, setTagName] = useState<string[]>([]);

  const handleChange = (event: MouseEvent<HTMLLIElement>) => {
    const value = event.currentTarget.getAttribute("data-value");
    if (value) {
      const newSelection = [...tagName];
      const index = newSelection.indexOf(value);
      if (index > -1) {
        newSelection.splice(index, 1);
      } else {
        newSelection.push(value);
      }
      setTagName(newSelection);
    }
  };

  return (
    <div className="m-4 w-72">
      <label htmlFor="multiple-chip" className="block mb-2 text-gray-700">
        Chip
      </label>
      <div className="relative">
        <button
          className="w-full p-2 text-left border border-gray-300 rounded bg-white"
          onClick={(e) => {
            e.preventDefault();
            const dropdown = e.currentTarget.nextSibling as HTMLElement;
            dropdown.style.display =
              dropdown.style.display === "block" ? "none" : "block";
          }}
        >
          {tagName.length === 0 ? (
            "Select..."
          ) : (
            <div className="flex flex-wrap gap-2">
              {tagName.map((value) => (
                <div
                  key={value}
                  className="inline-flex items-center px-2 py-1 bg-gray-200 rounded-full"
                >
                  {value}
                </div>
              ))}
            </div>
          )}
        </button>
        <ul className="absolute left-0 right-0 mt-1 max-h-48 overflow-y-auto border border-gray-300 rounded bg-white z-10 hidden">
          {tags.map((name) => (
            <li
              key={name}
              data-value={name}
              onClick={handleChange}
              className={`p-2 cursor-pointer ${
                tagName.includes(name) ? "bg-gray-200" : "hover:bg-gray-100"
              }`}
            >
              {name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MultipleSelectChip;
