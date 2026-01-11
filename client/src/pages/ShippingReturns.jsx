export default function ShippingReturns() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900">
          Shipping & Returns
        </h1>

        <div className="mt-8 space-y-8">
          
          <section className="bg-white p-6 rounded-2xl shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">
              Shipping
            </h2>
            <p className="mt-2 text-gray-600 text-sm">
              We ship all orders within 24–48 hours. Delivery usually takes
              3–5 business days depending on your location.
            </p>
          </section>

          <section className="bg-white p-6 rounded-2xl shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">
              Returns
            </h2>
            <p className="mt-2 text-gray-600 text-sm">
              If you’re not satisfied with your purchase, you can return
              it within 7 days of delivery.
            </p>
            <ul className="mt-3 list-disc list-inside text-sm text-gray-600 space-y-1">
              <li>Item must be unused</li>
              <li>Original packaging required</li>
              <li>Return shipping paid by customer</li>
            </ul>
          </section>

          <section className="bg-white p-6 rounded-2xl shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">
              Refunds
            </h2>
            <p className="mt-2 text-gray-600 text-sm">
              Refunds are processed within 5–7 business days after
              inspection.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
