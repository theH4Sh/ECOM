import { useState } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useFetch } from "../../hooks/useFetch";

const AdminProducts = () => {
    const [showAddModal, setShowAddModal] = useState(false);
    const token = useSelector((state) => state.auth.token);
    
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        quantity: '',
        image: null
    });

    const { data: products, loading, error } = useFetch('http://localhost:8000/api/product');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        setFormData(prev => ({
            ...prev,
            image: e.target.files[0]
        }));
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        
        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name);
        formDataToSend.append('description', formData.description);
        formDataToSend.append('price', formData.price);
        formDataToSend.append('quantity', formData.quantity);
        formDataToSend.append('productImage', formData.image);

        try {
            const response = await fetch('http://localhost:8000/api/product', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formDataToSend
            });

            if (response.ok) {
                toast.success("Product added successfully!");
                setShowAddModal(false);
                setFormData({
                    name: '',
                    description: '',
                    price: '',
                    quantity: '',
                    image: null
                });
                fetchProducts();
            } else {
                const error = await response.json();
                toast.error(error.error || "Failed to add product");
            }
        } catch (error) {
            toast.error("Failed to add product");
            console.error(error);
        }
    };

    const handleDeleteProduct = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:8000/api/product/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                toast.success("Product deleted successfully!");
                fetchProducts();
            } else {
                const error = await response.json();
                toast.error(error.error || "Failed to delete product");
            }
        } catch (error) {
            toast.error("Failed to delete product");
            console.error(error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-xl text-gray-600">Loading products...</div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Products</h1>
                    <p className="text-gray-600 mt-2">Manage your product inventory</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-[#0B7C56] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#096347] transition-all flex items-center gap-2"
                >
                    <span className="text-xl">+</span>
                    Add Product
                </button>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                    <div key={product._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all">
                        <img 
                            src={`http://localhost:8000/images/${product.image}`} 
                            alt={product.name}
                            className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                            <h3 className="font-bold text-lg text-gray-800 mb-2">{product.name}</h3>
                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xl font-bold text-[#0B7C56]">${product.price}</span>
                                <span className="text-sm text-gray-600">Stock: {product.quantity}</span>
                            </div>
                            <button
                                onClick={() => handleDeleteProduct(product._id)}
                                className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-all font-medium"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {products.length === 0 && (
                <div className="text-center py-16">
                    <p className="text-gray-500 text-lg">No products found. Add your first product!</p>
                </div>
            )}

            {/* Add Product Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Product</h2>
                        <form onSubmit={handleAddProduct}>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-medium mb-2">Product Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0B7C56]"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-medium mb-2">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0B7C56]"
                                    rows="3"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-medium mb-2">Price</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0B7C56]"
                                    step="0.01"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-medium mb-2">Quantity</label>
                                <input
                                    type="number"
                                    name="quantity"
                                    value={formData.quantity}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0B7C56]"
                                    required
                                />
                            </div>
                            <div className="mb-6">
                                <label className="block text-gray-700 font-medium mb-2">Product Image</label>
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    accept="image/*"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0B7C56]"
                                    required
                                />
                            </div>
                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-all font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-[#0B7C56] text-white py-2 rounded-lg hover:bg-[#096347] transition-all font-medium"
                                >
                                    Add Product
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

