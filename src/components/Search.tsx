"use client";
import React from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { SearchIcon } from "lucide-react";

const Search = ({ placeholder }: { placeholder: string }) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="w-full flex items-center border border-primary">
      <input
        type="text"
        placeholder={placeholder}
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        defaultValue={searchParams.get("query")?.toString()}
        className="w-full focus:outline-none h-10 py-2 px-3 bg-transparent text-sm"
      />
      <button className="bg-primary text-white h-full px-7">
        <SearchIcon size={18} />
      </button>
    </div>
  );
};

export default Search;
