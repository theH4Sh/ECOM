const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-200 py-10">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Logo / About */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white">ShopName</h2>
          <p className="text-gray-400 text-sm">
            Your go-to shop for Men, Women & Kids fashion. Quality products, delivered fast.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold text-white mb-3">Quick Links</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li><a href="/" className="hover:text-white transition">Home</a></li>
            <li><a href="/category/men" className="hover:text-white transition">Men</a></li>
            <li><a href="/category/women" className="hover:text-white transition">Women</a></li>
            <li><a href="/category/kids" className="hover:text-white transition">Kids</a></li>
          </ul>
        </div>

        {/* Customer Service */}
        <div>
          <h3 className="font-semibold text-white mb-3">Customer Service</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li><a href="/contact" className="hover:text-white transition">Contact Us</a></li>
            <li><a href="/faq" className="hover:text-white transition">FAQ</a></li>
            <li><a href="/shipping" className="hover:text-white transition">Shipping & Returns</a></li>
          </ul>
        </div>

        {/* Social / Newsletter */}
        <div className="space-y-3">
          <h3 className="font-semibold text-white mb-3">Follow Us</h3>
          <div className="flex justify-center gap-3">
            <a href="#" className="hover:text-white transition">📘</a>
            <a href="#" className="hover:text-white transition">🐦</a>
            <a href="#" className="hover:text-white transition">📸</a>
          </div>
          <div className="mt-4">
            <h3 className="font-semibold text-white mb-2 text-sm">Subscribe</h3>
            <input 
              type="email" 
              placeholder="Your email" 
              className="w-full px-3 py-2 rounded-lg text-gray-900 text-sm focus:outline-none"
            />
          </div>
        </div>

      </div>

      <div className="mt-10 border-t border-gray-700 pt-4 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} ShopName. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
