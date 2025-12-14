// components/Footer.tsx
export default function Footer() {
  return (
    <footer className="w-full bg-gray-100 dark:bg-black border-t border-gray-200 dark:border-white/10 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-2xl font-serif text-gray-900 dark:text-[#DFDFD6] mb-4">Hangart</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Discover original art from emerging global artists. Curated collections of paintings, photography, sculpture and more.
            </p>
            
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-[#DFDFD6] mb-4 uppercase tracking-wider">Shop</h4>
            <ul className="space-y-2">
              <li><a href="/gallery" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-[#DFDFD6] transition-colors">All Artworks</a></li>
              <li><a href="/gallery?category=painting" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-[#DFDFD6] transition-colors">Paintings</a></li>
              <li><a href="/gallery?category=photography" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-[#DFDFD6] transition-colors">Photography</a></li>
              <li><a href="/gallery?category=sculpture" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-[#DFDFD6] transition-colors">Sculpture</a></li>
              <li><a href="/artists" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-[#DFDFD6] transition-colors">Featured Artists</a></li>
              <li><a href="/collections" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-[#DFDFD6] transition-colors">Collections</a></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-[#DFDFD6] mb-4 uppercase tracking-wider">Customer Service</h4>
            <ul className="space-y-2">
              <li><a href="/about" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-[#DFDFD6] transition-colors">About Us</a></li>
              <li><a href="/contact" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-[#DFDFD6] transition-colors">Contact</a></li>
              <li><a href="/shipping" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-[#DFDFD6] transition-colors">Shipping & Returns</a></li>
              <li><a href="/faq" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-[#DFDFD6] transition-colors">FAQ</a></li>
              <li><a href="/contact" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-[#DFDFD6] transition-colors">Support</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-white/10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © {new Date().getFullYear()} HangartGallery. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="/privacy" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-[#DFDFD6] transition-colors">
                Privacy Policy
              </a>
              <a href="/terms" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-[#DFDFD6] transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}