const STATUS_STYLES = {
  pending: {
    label: "Pending",
    classes: "bg-yellow-500/10 text-yellow-700",
  },
  confirmed: {
    label: "Confirmed",
    classes: "bg-blue-500/10 text-blue-700",
  },
  shipped: {
    label: "Shipped",
    classes: "bg-purple-500/10 text-purple-700",
  },
  delivered: {
    label: "Delivered",
    classes: "bg-green-500/10 text-green-700",
  },
  cancelled: {
    label: "Cancelled",
    classes: "bg-red-500/10 text-red-700",
  },
};

const OrderCard = ({ orders }) => {
  return (
    <div className="space-y-6">
      {orders.map((order) => {
        const status = STATUS_STYLES[order.orderStatus];

        return (
          <div
            key={order._id}
            className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-100"
          >
            {/* HEADER (stacked on mobile) */}
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span
                  className={`px-3 py-1 text-xs font-medium rounded-full ${status.classes}`}
                >
                  {status.label}
                </span>

                <span className="text-xs text-gray-400">
                  {new Date(order.createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>

              <p className="font-mono text-xs text-gray-500 truncate">
                {order._id}
              </p>
            </div>

            {/* ITEMS */}
            <div className="px-4 space-y-4">
              {order.items.map((item) => (
                <div
                  key={item.product._id}
                  className="flex items-center gap-3"
                >
                  {/* Image */}
                  <div className="relative shrink-0">
                    <img
                      src={`http://localhost:8000/images/${item.product.image}`}
                      alt={item.product.name}
                      className="w-14 h-14 rounded-xl object-cover"
                    />
                    <span className="absolute -top-1.5 -right-1.5 bg-gray-900 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                      {item.quantity}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-gray-900 truncate">
                      {item.product.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      PKR {item.price.toLocaleString()}
                    </p>
                  </div>

                  {/* Line total (mobile-friendly) */}
                  <div className="text-sm font-semibold text-gray-900">
                    PKR {(item.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            {/* FOOTER */}
            <div className="mt-4 px-4 py-4 bg-gray-50 rounded-b-2xl flex items-center justify-between">
              <span className="text-sm text-gray-500">
                Total
              </span>
              <span className="text-lg font-semibold text-gray-900">
                PKR {order.totalAmount.toLocaleString()}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OrderCard;
