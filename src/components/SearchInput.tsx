"use client";
// FIX: Import from 'next/navigation' instead of 'next/router' for App Router compatibility
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";

const SearchInput = () => {
  const [search, setSearch] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    if (search.trim()) {
      router.replace(`/search?q=${encodeURIComponent(search.trim())}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="w-full hidden md:inline-flex flex-1 h-12 px-4 relative">
      <FaSearch className="text-xl absolute left-6 top-3.5" />
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={handleKeyDown}
        aria-label="Search products"
        className="flex-1 h-full outline-none border rounded-xl pl-8 pr-14"
        placeholder="Search products..."
      />
      {search && (
        <IoMdClose
          onClick={() => setSearch("")}
          className="absolute right-25 top-3.5 text-2xl  rounded-full  cursor-pointer text-red-500 "
        />
      )}
      <button
        onClick={handleSearch}
        type="button"
        role="search"
        className="absolute right-6.5 top-2.5 px-3 py-1  text-sm border border-white bg-black text-white rounded-xl hover:border-black hover:bg-indigo-700  cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 active:scale-90"
      >
        <span className="font-semibold">Search</span>
      </button>
    </div>
  );
};

export default SearchInput;
