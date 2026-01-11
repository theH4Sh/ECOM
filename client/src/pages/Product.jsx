import { useParams } from "react-router";
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
  const params = useParams();

  const { data, loading, error } = useFetch(
    import.meta.env.VITE_API + "product/" + params.id
  );

  const { reviews, loading: reviewsLoading, error: reviewsError } =
    useReviews(params.id);

  const { sendReview } = usePostReview(params.id);

  const [quantity, setQuantity] = useState(1);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}

      {data && (
        <>
          {/* PRODUCT SECTION */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Image */}
            <div className="bg-gray-100 rounded-xl overflow-hidden">
              <img
                src={`http://localhost:8000/images/${data.image}`}
                alt={data.name}
                className="w-full h-[450px] object-cover"
              />
            </div>

            {/* Details */}
            <div className="flex flex-col gap-4">
              <h1 className="text-3xl font-bold">{data.name}</h1>

              <p className="text-gray-600 leading-relaxed">
                {data.description}
              </p>

              <p className="text-4xl font-bold text-gray-900">
                PKR {data.price}
              </p>

            {/* Stock Info */}
            <div className="mt-2 flex items-center gap-2">
              {data.quantity === 0 ? (
                <span className="flex items-center gap-1 bg-red-100 text-red-800 px-3 py-1 rounded-full font-semibold">
                  ❌ Out of Stock
                </span>
              ) : data.quantity <= 3 ? (
                <span className="flex items-center gap-1 bg-orange-100 text-orange-800 px-3 py-1 rounded-full font-semibold animate-pulse">
                  ⚠️ Only {data.quantity} left!
                </span>
              ) : (
                <span className="flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1 rounded-full font-semibold">
                  ✅ In Stock
                </span>
              )}
            </div>


              <QuantityCounter
                initial={1}
                max={data.quantity}
                onChange={setQuantity}
              />

              <div className="flex flex-col gap-3 mt-6">
                <button
                  onClick={() =>
                    dispatch(
                      addToCart({
                        product: params.id,
                        quantity,
                        name: data.name,
                        image: data.image,
                        price: data.price,
                      })
                    )
                  }
                  className="w-full bg-[#0B7C56] text-white py-3 rounded-lg font-semibold hover:bg-[#095c40] transition"
                >
                  Add to Cart
                </button>

                <button className="w-full border border-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
                  Buy Now
                </button>
              </div>
            </div>
          </div>

          {/* REVIEWS SECTION */}
          <div className="mt-20 border-t border-gray-400 pt-12 flex flex-col items-center place-content-center">
            <h2 className="text-3xl font-bold mb-6">Customer Reviews</h2>

            {/* Review Form */}
            <div className="mb-12 w-[400px] md:w-[800px]">
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

            <div className="space-y-4 w-[400px] md:w-[800px]">
              {reviews.map((r) => (
                <div
                  key={r._id}
                  className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold">
                      {r.user?.name || r.user?.username}
                    </p>

                    <p className="text-yellow-500 text-xl">
                      {"★".repeat(r.rating)}
                      <span className="text-gray-300">
                        {"☆".repeat(5 - r.rating)}
                      </span>
                    </p>
                  </div>

                  <p className="text-gray-700">{r.comment}</p>
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
