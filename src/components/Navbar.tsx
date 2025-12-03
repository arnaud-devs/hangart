// components/Navbar.tsx
import ThemeToggle from "./ThemeToggle";
import LanguageSwitcher from "./LanguageSwitcher";
import MobileSearch from "./MobileSearch";
import UserMenu from "./UserMenu";
import CartButton from "./CartButton";

export default function Navbar() {
  return (
    <nav className="w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-6">
          {/* Left - Logo */}
          <div className="flex items-center gap-4">
            <a href="/" className="text-3xl font-serif text-[#3C3C43] dark:text-[#DFDFD6] leading-none">Hangart</a>
          </div>

          {/* Center - Search (kept responsive) */}
          <div className="hidden md:flex flex-1 justify-center px-4">
            <div className="w-full max-w-xl">
              <input
                type="search"
                placeholder="Search for arts product"
                className="w-full rounded-full border border-transparent bg-gray-100/50 dark:bg-gray-700/30 px-4 py-3 text-sm shadow-sm focus:outline-none text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>

          {/* Right - actions */}
          <div className="flex items-center gap-2 md:gap-4">
            <div className="md:hidden">
              <MobileSearch />
            </div>

            <div className="block">
              <LanguageSwitcher />
            </div>

            <ThemeToggle />

            <UserMenu />
            {/* Cart button (client) - shows count and opens drawer */}
            <div className="hidden sm:block">
              <CartButton />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}