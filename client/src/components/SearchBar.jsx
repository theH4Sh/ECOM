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
    <form onSubmit={handleSearch} className="flex gap-3">
      <input
        type="text"
        placeholder="Search products..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-1 px-4 py-2 border rounded-lg"
      />

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="px-3 py-2 border rounded-lg"
      >
        <option value="">All</option>
        <option value="mobiles">Mobiles</option>
        <option value="laptops">Laptops</option>
        <option value="clothes">Clothes</option>
      </select>

      <button
        type="submit"
        className="px-6 py-2 bg-black text-white rounded-lg"
      >
        Search
      </button>
    </form>
  );
}
