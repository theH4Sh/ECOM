const faqs = [
  {
    q: "How long does shipping take?",
    a: "Orders are usually delivered within 3–5 business days."
  },
  {
    q: "Can I cancel my order?",
    a: "You can cancel your order before it has been shipped."
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept cards, bank transfers, and cash on delivery."
  },
  {
    q: "Do you offer returns?",
    a: "Yes, returns are accepted within 7 days of delivery."
  },
];

export default function FAQ() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900">
          Frequently Asked Questions
        </h1>

        <div className="mt-8 space-y-4">
          {faqs.map((faq, i) => (
            <details
              key={i}
              className="bg-white rounded-xl shadow-sm p-5 group"
            >
              <summary className="cursor-pointer font-medium text-gray-900 flex justify-between items-center">
                {faq.q}
                <span className="text-gray-400 group-open:rotate-180 transition">
                  ▼
                </span>
              </summary>
              <p className="mt-3 text-gray-600 text-sm">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
