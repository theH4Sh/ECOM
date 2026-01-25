import { useState } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useFetch } from "../../hooks/useFetch";
import SkeletonCard from "../../components/SkeletonCard";

const LIMIT = 8;

const CATEGORIES = [
  { label: "Men", value: "men" },
  { label: "Women", value: "women" },
  { label: "Kids", value: "kids" },
];

const AdminProducts = () => {
  const token = useSelector((state) => state.auth.token);

  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    category: "",
    image: null,
  });

  const { data: products = [], loading, error } = useFetch(
    `http://localhost:8000/api/product?page=${page}&limit=${LIMIT}`
  );

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      quantity: "",
      category: "",
      image: null,
    });
    setEditingProduct(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (p) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      description: p.description,
      price: p.price,
      quantity: p.quantity,
      category: p.category,
      image: null,
    });
    setShowModal(true);
  };

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData((prev) => ({
        ...prev,
        [name]: files ? files[0] : value,
        }));
    };

    const reload = () => setPage((p) => p);

    const handleSubmit = async (e) => {
    e.preventDefault();

    const body = new FormData();

    Object.entries(formData).forEach(([k, v]) => {
        if (k === "image") {
        if (v) body.append(k, v); // only append if a new file was selected
        } else {
        if (v !== null && v !== "") body.append(k, v);
        }
    });

    const url = editingProduct
        ? `http://localhost:8000/api/product/${editingProduct._id}`
        : "http://localhost:8000/api/product";

    const method = editingProduct ? "PUT" : "POST";

    try {
        const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body,
        });

        if (!res.ok) throw new Error();

        toast.success(editingProduct ? "Product updated" : "Product added");
        setShowModal(false);
        resetForm();
        reload();
    } catch {
        toast.error("Something went wrong");
    }
    };


  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;

    try {
      const res = await fetch(
        `http://localhost:8000/api/product/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error();

      toast.success("Product deleted");
      reload();
    } catch {
      toast.error("Delete failed");
    }
  };

  if (loading) return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
  if (error) return <p className="text-red-500">Failed to load products</p>;

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-gray-500">Manage inventory</p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-[#0B7C56] text-white px-5 py-2.5 rounded-lg font-semibold"
        >
          + Add Product
        </button>
      </div>

     {/* GRID */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((p) => (
                <div
                key={p._id}
                className="group bg-white shadow-xs rounded-xl overflow-hidden hover:shadow-xl transition"
                >
                {/* IMAGE */}
                <div className="relative h-48 bg-gray-100 overflow-hidden">
                    <img
                    src={`http://localhost:8000/images/${p.image}`}
                    alt={p.name}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* CATEGORY BADGE */}
                    <span className="absolute top-3 left-3 text-xs px-2 py-1 rounded-full bg-white/90 text-gray-700 shadow">
                    {p.category}
                    </span>
                </div>

                {/* CONTENT */}
                <div className="p-4 flex flex-col gap-3">
                    <div>
                    <h3 className="font-semibold text-sm leading-tight line-clamp-1">
                        {p.name}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-2 mt-1">
                        {p.description}
                    </p>
                    </div>

                    {/* PRICE + STOCK */}
                    <div className="flex items-center justify-between text-sm">
                    <span className="font-bold text-[#0B7C56]">
                        PKR {p.price}
                    </span>
                    <span
                        className={`text-xs px-2 py-1 rounded-full ${
                        p.quantity > 0
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                    >
                        {p.quantity > 0 ? `Stock: ${p.quantity}` : "Out of stock"}
                    </span>
                    </div>

                    {/* ACTIONS */}
                    <div className="flex gap-2 pt-2">
                    <button
                        onClick={() => openEditModal(p)}
                        className="flex-1 text-sm border border-[#0B7C56] text-[#0B7C56] py-1.5 rounded-lg hover:bg-[#0B7C56] hover:text-white transition"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => handleDelete(p._id)}
                        className="flex-1 text-sm bg-red-500 text-white py-1.5 rounded-lg hover:bg-red-600 transition"
                    >
                        Delete
                    </button>
                    </div>
                </div>
                </div>
            ))}
        </div>


      {/* PAGINATION */}
      <div className="flex items-center justify-center gap-4">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span className="font-semibold">Page {page}</span>
        <button
          disabled={products.length < LIMIT}
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* MODAL – FIXED UI */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4">
            <div className="bg-white w-full max-w-3xl rounded-xl shadow-2xl overflow-hidden">
            
            {/* HEADER */}
            <div className="flex items-center justify-between px-6 py-4 border-b">
                <div>
                <h2 className="text-xl font-semibold text-gray-800">
                    {editingProduct ? "Edit Product" : "Add Product"}
                </h2>
                <p className="text-sm text-gray-500">
                    Manage product information
                </p>
                </div>
                <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                >
                ×
                </button>
            </div>

            {/* BODY */}
            <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* LEFT – IMAGE + CATEGORY */}
                <div className="space-y-5">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Image
                    </label>
                    <div className="border-2 border-dashed rounded-lg p-4 text-center">
                    <input
                        name="image"
                        type="file"
                        onChange={handleChange}
                        accept="image/*"
                        className="text-sm"
                    />
                    <p className="text-xs text-gray-400 mt-2">
                        JPG, PNG up to 5MB
                    </p>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                    </label>
                    <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full rounded-lg border px-3 py-2.5 focus:ring-2 focus:ring-[#0B7C56]"
                    required
                    >
                    <option value="">Select category</option>
                    {CATEGORIES.map((c) => (
                        <option key={c.value} value={c.value}>
                        {c.label}
                        </option>
                    ))}
                    </select>
                </div>
                </div>

                {/* RIGHT – DETAILS */}
                <div className="md:col-span-2 space-y-5">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name
                    </label>
                    <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full rounded-lg border px-4 py-2.5 focus:ring-2 focus:ring-[#0B7C56]"
                    required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                    </label>
                    <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full rounded-lg border px-4 py-2.5 h-28 resize-none focus:ring-2 focus:ring-[#0B7C56]"
                    required
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price (PKR)
                    </label>
                    <input
                        name="price"
                        type="number"
                        value={formData.price}
                        onChange={handleChange}
                        className="w-full rounded-lg border px-4 py-2.5 focus:ring-2 focus:ring-[#0B7C56]"
                        required
                    />
                    </div>

                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Quantity
                    </label>
                    <input
                        name="quantity"
                        type="number"
                        value={formData.quantity}
                        onChange={handleChange}
                        className="w-full rounded-lg border px-4 py-2.5 focus:ring-2 focus:ring-[#0B7C56]"
                        required
                    />
                    </div>
                </div>
                </div>

                {/* FOOTER */}
                <div className="md:col-span-3 flex justify-end gap-3 pt-4 border-t">
                <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-5 py-2.5 rounded-lg border text-gray-700 hover:bg-gray-100"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-6 py-2.5 rounded-lg bg-[#0B7C56] text-white font-semibold hover:bg-[#095c40]"
                >
                    {editingProduct ? "Update Product" : "Add Product"}
                </button>
                </div>
            </form>
            </div>
        </div>
        )}

    </div>
  );
};

export default AdminProducts;
