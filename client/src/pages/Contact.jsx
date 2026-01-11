export default function Contact() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900">
          Contact Us
        </h1>
        <p className="text-gray-500 mt-2">
          Have a question or need help? We usually reply within 24 hours.
        </p>

        <form className="mt-8 space-y-5 bg-white p-6 rounded-2xl shadow-sm">
          <input
            type="text"
            placeholder="Your name"
            className="w-full rounded-xl border-gray-200 focus:ring-black focus:border-black"
          />

          <input
            type="email"
            placeholder="Email address"
            className="w-full rounded-xl border-gray-200 focus:ring-black focus:border-black"
          />

          <textarea
            rows="4"
            placeholder="Your message"
            className="w-full rounded-xl border-gray-200 focus:ring-black focus:border-black resize-none"
          />

          <button className="w-full py-3 rounded-xl bg-black text-white font-medium hover:bg-gray-900 transition">
            Send Message
          </button>
        </form>

        <div className="mt-8 text-sm text-gray-500 space-y-1">
          <p>Email: support@yourstore.com</p>
          <p>Phone: +92 XXX XXXXXXX</p>
        </div>
      </div>
    </div>
  );
}
