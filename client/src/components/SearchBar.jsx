import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();

    const params = new URLSearchParams();
    if (query) params.append("q", query);
    if (category) params.append("category", category);

    navigate(`/search?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="flex items-center gap-3 bg-white rounded-full px-4 py-2 shadow-sm w-full max-w-2xl"
    >
      {/* Search Icon + Input */}
      <div className="flex items-center flex-1 gap-2">
        {/* Magnifying Glass */}
        <svg
          className="w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-4.35-4.35m1.6-5.15a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>

        <input
          type="text"
          placeholder="Search for products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full outline-none bg-transparent text-sm"
        />
      </div>

      {/* Category */}
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="border-l pl-3 pr-2 py-1 text-sm outline-none bg-transparent text-gray-600"
      >
        <option value="">All</option>
        <option value="Men">Men</option>
        <option value="Women">Women</option>
        <option value="Kids">Kids</option>
      </select>

      {/* Search Button */}
      <button
        type="submit"
        className="ml-2 bg-[#0B7C56] cursor-pointer text-white px-5 py-2 rounded-full hover:bg-[#0A6B4A] transition"
      >
        Search
      </button>
    </form>
  );
}
