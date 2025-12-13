import { FaStar } from "react-icons/fa";

const Card = ({ image, name, description, price, averageRating = 0, reviewCount = 0 }) => {
  return (
    <div className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300">
      
      {/* IMAGE */}
      <div className="relative h-56 bg-gray-100 overflow-hidden">
        <img
          src={`http://localhost:8000/images/${image}`}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* CONTENT */}
      <div className="p-4 flex flex-col gap-2">
        
        <h2 className="font-semibold text-lg text-gray-900 line-clamp-1">
          {name}
        </h2>

        <p className="text-sm text-gray-500 line-clamp-2">
          {description}
        </p>

        {/* RATING */}
        <div className="flex items-center gap-1 text-sm mt-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <FaStar
              key={i}
              size={14}
              className={
                i <= Math.round(averageRating)
                  ? "text-[#0B7C56]"
                  : "text-gray-300"
              }
            />
          ))}
          <span className="text-gray-500 ml-1">
            ({reviewCount})
          </span>
        </div>

        {/* PRICE */}
        <div className="flex items-center justify-between mt-4">
          <p className="text-xl font-bold text-gray-900">
            PKR {price}
          </p>

          <span className="text-sm font-semibold text-[#0B7C56] group-hover:underline">
            View →
          </span>
        </div>
      </div>
    </div>
  );
};

export default Card;
