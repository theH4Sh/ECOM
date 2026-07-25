import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SearchBar({
  defaultQuery = "",
  defaultCategory = "",
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

    if (trimmedQuery) params.append("q", trimmedQuery);
    if (category) params.append("category", category);
    params.set("page", "1");

    navigate(`/search?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="flex items-center gap-3 bg-white rounded-full px-4 py-2 shadow-sm w-full max-w-2xl"
    >
      <div className="flex items-center flex-1 gap-2">
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

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="border-l pl-3 pr-2 py-1 text-sm outline-none bg-transparent text-gray-600"
      >
        <option value="">All</option>
        <option value="men">Men</option>
        <option value="women">Women</option>
        <option value="kids">Kids</option>
      </select>

      <button
        type="submit"
        className="ml-2 bg-[#0B7C56] cursor-pointer text-white px-5 py-2 rounded-full hover:bg-[#0A6B4A] transition"
      >
        Search
      </button>
    </form>
  );
}
