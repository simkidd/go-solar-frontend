"use client";
import { SearchIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";

const Search = ({ placeholder }: { placeholder: string }) => {
  const router = useRouter();
  const search = useSearchParams();
  const [term, setTerm] = useState<string | null>(
    search ? search.get("q") : ""
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (typeof term !== "string") {
      return;
    }

    if (term.trim()) {
      const params = new URLSearchParams();
      params.set("q", term.trim());
      router.push(`/search?${params.toString()}`);
      setTerm("");
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      className="w-full flex items-center border border-primary"
    >
      <input
        type="text"
        placeholder={placeholder}
        value={term || ""}
        onChange={(e) => setTerm(e.target.value)}
        className="w-full focus:outline-none h-9 lg:h-10 py-2 px-3 bg-transparent text-sm"
      />
      <button type="submit" className="bg-primary text-white h-9 lg:h-10 lg:px-7 px-6">
        <SearchIcon size={18} />
      </button>
    </form>
  );
};

export default Search;
