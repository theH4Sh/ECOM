import { Link, useNavigate, useParams } from "react-router";
import { useFetch } from "../hooks/useFetch";
import QuantityCounter from "../components/QuantityCounter";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../slice/cartSlice";
import ReviewForm from "../components/ReviewForm";
import toast from "react-hot-toast";
import { usePostReview } from "../hooks/usePostReview";
import { useReviews } from "../hooks/useReviews";

const Product = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();

  const { data, loading, error } = useFetch(
    import.meta.env.VITE_API + "product/" + params.id
  );

  const { reviews, loading: reviewsLoading, error: reviewsError } =
    useReviews(params.id);

  const { sendReview } = usePostReview(params.id);

  const [quantity, setQuantity] = useState(1);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-10">
      {loading && <p className="text-center text-lg">Loading...</p>}
      {error && <p className="text-center text-red-500">{error.message}</p>}

      {data && (
        <>
          {/* PRODUCT SECTION */}
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* Image */}
            <div className="flex-1 bg-gray-100 rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
              <img
                src={`http://localhost:8000/images/${data.image}`}
                alt={data.name}
                className="w-full h-[400px] sm:h-[450px] object-cover rounded-2xl"
              />
            </div>

            {/* Details */}
            <div className="flex-1 flex flex-col gap-4">
              <h1 className="text-2xl sm:text-3xl font-bold">{data.name}</h1>

              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                {data.description}
              </p>

              <p className="text-2xl sm:text-4xl font-bold text-gray-900">
                PKR {data.price}
              </p>

              {/* Stock Info */}
              <div className="mt-2 flex flex-wrap gap-2 items-center">
                {data.quantity === 0 ? (
                  <span className="flex items-center gap-2 bg-red-100 text-red-800 px-4 py-2 rounded-full font-semibold text-sm sm:text-base shadow-sm">
                    ❌ Out of Stock
                  </span>
                ) : data.quantity <= 3 ? (
                  <span className="flex items-center gap-2 bg-orange-100 text-orange-800 px-4 py-2 rounded-full font-semibold text-sm sm:text-base shadow-md animate-pulse">
                    ⚠️ Only {data.quantity} left!
                  </span>
                ) : (
                  <span className="flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full font-semibold text-sm sm:text-base shadow-sm">
                    ✅ In Stock
                  </span>
                )}
              </div>

              {/* Quantity Selector */}
              <QuantityCounter
                initial={1}
                max={data.quantity}
                onChange={setQuantity}
              />

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <button
                  onClick={() => {
                    dispatch(
                      addToCart({
                        product: params.id,
                        quantity,
                        name: data.name,
                        image: data.image,
                        price: data.price,
                      })
                    )
                    toast.success("Added to cart");
                  }}
                  disabled={data.quantity === 0}
                  className={`flex-1 py-3 rounded-lg font-semibold text-white transition-transform transform hover:scale-105 ${
                    data.quantity === 0
                      ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                      : "bg-[#0B7C56] hover:bg-[#095c40] shadow-md cursor-pointer "
                  }`}
                >
                  Add to Cart
                </button>
                  
                <button
                  onClick={() => {
                    if (data.quantity === 0) return; // prevent out-of-stock purchases

                    // Add product to cart
                    dispatch(
                      addToCart({
                        product: data._id,
                        quantity,
                        name: data.name,
                        image: data.image,
                        price: data.price,
                      })
                    );

                    // Show a quick toast
                    toast.success(`${data.name} added to cart`);

                    // Navigate to checkout
                    navigate("/checkout");
                  }}
                  disabled={data.quantity === 0}
                  className={`flex-1 py-3 rounded-lg font-semibold transition-transform transform hover:scale-105 ${
                    data.quantity === 0
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "border border-gray-300 hover:bg-gray-100 shadow-sm cursor-pointer"
                  }`}
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>

          {/* REVIEWS SECTION */}
          <div className="mt-16 border-t border-gray-300 pt-12 flex flex-col items-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6">Customer Reviews</h2>

            {/* Review Form */}
            <div className="mb-12 w-full sm:w-[500px] md:w-[700px] lg:w-[800px]">
              <ReviewForm
                onSubmit={async (review) => {
                  try {
                    await sendReview(review);
                    toast.success("Review submitted successfully");
                  } catch (err) {
                    toast.error("Failed to submit review");
                  }
                }}
              />
            </div>

            {/* Review List */}
            {reviewsLoading && <p>Loading reviews...</p>}
            {reviewsError && <p>Error loading reviews</p>}
            {reviews.length === 0 && (
              <p className="text-gray-500">No reviews yet.</p>
            )}

            <div className="space-y-4 w-full sm:w-[500px] md:w-[700px] lg:w-[800px]">
              {reviews.map((r) => (
                <div
                  key={r._id}
                  className="border border-gray-200 rounded-2xl p-5 bg-white shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold">
                      {r.user?.name || r.user?.username}
                    </p>

                    <p className="text-yellow-500 text-lg sm:text-xl">
                      {"★".repeat(r.rating)}
                      <span className="text-gray-300">
                        {"☆".repeat(5 - r.rating)}
                      </span>
                    </p>
                  </div>

                  <p className="text-gray-700 text-sm sm:text-base">{r.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Product;
