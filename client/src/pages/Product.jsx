import { Link, useNavigate, useParams } from "react-router";
import { useFetch } from "../hooks/useFetch";
import QuantityCounter from "../components/QuantityCounter";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../slice/cartSlice";
import ReviewForm from "../components/ReviewForm";
import toast from "react-hot-toast";
import { usePostReview } from "../hooks/usePostReview";
import { useReviews } from "../hooks/useReviews";
import { getErrorMessage } from "../lib/api";
import { useBreadcrumbLabel } from "../context/BreadcrumbContext";

const Product = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const { username, token, isAuthenticated } = useSelector((state) => state.auth);

  const { data, loading, error } = useFetch(
    import.meta.env.VITE_API + "product/" + params.id
  );

  useBreadcrumbLabel(data?.name);

  const { reviews, loading: reviewsLoading, error: reviewsError, addReview, removeReview } =
    useReviews(params.id);

  const { sendReview } = usePostReview(params.id);

  const [quantity, setQuantity] = useState(1);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [deletingReviewId, setDeletingReviewId] = useState(null);

  const isOwnReview = (review) =>
    isAuthenticated && review.user?.username === username;

  const handleDeleteReview = async (reviewId) => {
    if (!token) {
      toast.error("You must be logged in to delete a review");
      return;
    }

    setDeletingReviewId(reviewId);
    try {
      const res = await fetch(`${import.meta.env.VITE_API}reviews/${reviewId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(getErrorMessage(data, "Failed to delete review"));
      }

      removeReview(reviewId);
      setConfirmDeleteId(null);
      toast.success("Review deleted");
    } catch (err) {
      toast.error(err.message || "Failed to delete review");
    } finally {
      setDeletingReviewId(null);
    }
  };

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
                    const newReview = await sendReview(review);
                    addReview(newReview);
                    toast.success("Review submitted successfully");
                  } catch (err) {
                    toast.error(err.message || "Failed to submit review");
                  }
                }}
              />
            </div>

            {/* Review List */}
            {reviewsLoading && <p>Loading reviews...</p>}
            {reviewsError && <p className="text-red-500">{reviewsError}</p>}
            {!reviewsLoading && !reviewsError && reviews.length === 0 && (
              <p className="text-gray-500">No reviews yet.</p>
            )}

            <div className="space-y-4 w-full sm:w-[500px] md:w-[700px] lg:w-[800px]">
              {reviews.map((r) => (
                <div
                  key={r._id}
                  className="border border-gray-200 rounded-2xl p-5 bg-white shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <p className="font-semibold">
                      {r.user?.name || r.user?.username}
                    </p>

                    <div className="flex items-center gap-3 shrink-0">
                      <p className="text-yellow-500 text-lg sm:text-xl">
                        {"★".repeat(r.rating)}
                        <span className="text-gray-300">
                          {"☆".repeat(5 - r.rating)}
                        </span>
                      </p>

                      {isOwnReview(r) && (
                        confirmDeleteId === r._id ? (
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-gray-500">Delete?</span>
                            <button
                              type="button"
                              onClick={() => handleDeleteReview(r._id)}
                              disabled={deletingReviewId === r._id}
                              className="text-red-600 font-medium hover:underline disabled:opacity-50"
                            >
                              {deletingReviewId === r._id ? "..." : "Yes"}
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(null)}
                              disabled={deletingReviewId === r._id}
                              className="text-gray-600 hover:underline disabled:opacity-50"
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(r._id)}
                            aria-label="Delete review"
                            title="Delete review"
                            className="p-1.5 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-50 transition"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-5 h-5"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                              />
                            </svg>
                          </button>
                        )
                      )}
                    </div>
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
