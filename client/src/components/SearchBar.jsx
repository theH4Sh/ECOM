import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SearchBar({
  defaultQuery = "",
  defaultCategory = "",
  className = "",
}) {
  const [query, setQuery] = useState(defaultQuery);
  const [category, setCategory] = useState(defaultCategory);
  const navigate = useNavigate();

  useEffect(() => {
    setQuery(defaultQuery);
    setCategory(defaultCategory);
  }, [defaultQuery, defaultCategory]);

  const handleSearch = (e) => {
    e.preventDefault();

    const params = new URLSearchParams();
    const trimmedQuery = query.trim();

    if (trimmedQuery) params.set("q", trimmedQuery);
    if (category) params.set("category", category);
    params.set("page", "1");

    navigate(`/search?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className={`flex flex-col sm:flex-row sm:items-center gap-3 bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-200 w-full ${className}`}
    >
      <div className="flex items-center flex-1 gap-3 min-w-0">
        <svg
          className="w-5 h-5 text-gray-400 shrink-0"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          aria-hidden="true"
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
          className="w-full outline-none bg-transparent text-sm text-gray-900 placeholder:text-gray-400"
        />
      </div>

      <div className="flex items-center gap-3 sm:border-l sm:pl-3">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="flex-1 sm:flex-none py-2 px-3 text-sm outline-none bg-gray-50 rounded-lg text-gray-700 border border-gray-200"
        >
          <option value="">All categories</option>
          <option value="men">Men</option>
          <option value="women">Women</option>
          <option value="kids">Kids</option>
        </select>

        <button
          type="submit"
          className="bg-[#0B7C56] cursor-pointer text-white px-5 py-2.5 rounded-xl hover:bg-[#095c40] transition font-medium text-sm whitespace-nowrap"
        >
          Search
        </button>
      </div>
    </form>
  );
}
