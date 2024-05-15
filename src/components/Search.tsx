"use client";
import React, { useState } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { SearchIcon } from "lucide-react";

const Search = ({ placeholder }: { placeholder: string }) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [term, setTerm] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("q", term);
    } else {
      params.delete("q");
    }
    router.push(`/search?${params.toString()}`);
    setTerm("")
  };

  return (
    <form
      onSubmit={handleSearch}
      className="w-full flex items-center border border-primary"
    >
      <input
        type="text"
        placeholder={placeholder}
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        className="w-full focus:outline-none h-10 py-2 px-3 bg-transparent text-sm"
      />
      <button type="submit" className="bg-primary text-white h-full px-7">
        <SearchIcon size={18} />
      </button>
    </form>
  );
};

export default Search;
