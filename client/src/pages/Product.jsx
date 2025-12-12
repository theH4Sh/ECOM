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
   
    const params = useParams()
    const { data, loading, error } = useFetch(import.meta.env.VITE_API + "product/" + params.id);
    const { reviews, loading: reviewsLoading, error: reviewsError } = useReviews(params.id);

    // send review
    const { sendReview, loading: sendingReview, data: reviewData } = usePostReview(params.id);

    const [quantity, setQuantity] = useState(1);

    const items = {
        product: params.id,
        quantity: quantity
    };

    return ( 
        <div className="max-w-6xl mx-auto p-6 ">
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error.message}</p>}
            {data && (
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* LEFT — Image */}
                    <div className="w-full lg:w-1/2">
                        <img
                            src={`http://localhost:8000/images/${data.image}`}
                            alt={data.name}
                            className="w-full h-72 md:h-96 lg:h-[450px] lg:w-[550px] object-cover rounded"
                        />
                    </div>

                    {/* RIGHT — Details */}
                    <div className="w-full lg:w-1/2 flex flex-col items-start gap-3">
                        <h2 className="text-3xl font-bold">{data.name}</h2>
                        <p className="text-gray-700">{data.description}</p>

                        <p className="text-4xl font-bold">
                            {data.price}
                            <span className="text-gray-600 text-lg ml-1">PKR</span>
                        </p>

                        <QuantityCounter initial={1} max={data.quantity} onChange={setQuantity} />

                        <div className="flex flex-col gap-3 mt-6 w-full">
                            <button
                                onClick={() => dispatch(addToCart({
                                            product: params.id,
                                            quantity: quantity,
                                            name: data.name,
                                            image: data.image,
                                            price: data.price
                                        }))}
                                className="flex items-center justify-center gap-2 w-full bg-[#0B7C56] text-white py-3 font-semibold rounded-lg hover:bg-[#095c40] transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
                                    <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
                                </svg>
                                <span>Add to Cart</span>
                            </button>

                            <button className="w-full bg-white border border-gray-300 text-[#0B7C56] py-3 font-semibold rounded-lg hover:bg-[#0B7C56] hover:text-white transition-colors">
                                Buy Now
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="my-20">
                <ReviewForm onSubmit={async (review) => {
                    try {
                        await sendReview(review);
                        toast.success("Review submitted successfully");
                    } catch (err) {
                        toast.error("Failed to submit review: " + err.message);
                    }
                }} />
            </div>

            {/* Display Reviews */}
            <div className="my-10 max-w-xl">
                <h3 className="text-2xl font-bold mb-4">Customer Reviews</h3>
                {reviewsLoading && <p>Loading reviews...</p>}
                {reviewsError && <p>Error loading reviews: {reviewsError.message}</p>}
                {reviews.length === 0 && <p>No reviews yet.</p>}

                {reviews.map(r => (
                <div key={r._id} className="border rounded p-4 mb-3">
                    <p className="font-semibold">{r.user.name || r.user.username}</p>
                    <p>{"★".repeat(r.rating) + "☆".repeat(5 - r.rating)}</p>
                    <p>{r.comment}</p>
                </div>
                ))}
            </div>
        </div>
     );
}
 
export default Product;