// components/Header.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Container from "./Container";
import Logo from "./Logo";
import SearchInput from "./SearchInput";
import { FiShoppingCart, FiUser, FiMenu, FiX, FiHome } from "react-icons/fi";
import { useAuthStore } from "@/store/useAuthStore";
import { useCartStore } from "@/store/useCartStore";
import { signOut } from "@/lib/firebase/auth";
import Button from "./ui/Button";

const Header = () => {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const { getTotalItems } = useCartStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // This ensures we only show cart count after the component has mounted on the client
  useEffect(() => {
    setMounted(true);
  }, []);

  const cartItemCount = getTotalItems();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsUserMenuOpen(false);

      router.push("/");
      router.refresh(); // Force a refresh of the current page
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <header className="w-full h-20 bg-white border-b border-gray-200 sticky top-0 z-40">
      <Container className="flex items-center justify-between h-full">
        <Logo />

        <SearchInput />

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {/* Home Link */}
          <Link
            href="/"
            className={`text-sm font-medium transition-colors hover:text-indigo-700 ${
              pathname === "/" ? "text-indigo-700" : "text-black"
            }`}
          >
            Home
          </Link>

          {/* Admin Link if user is logged in */}
          {user && (
            <Link
              href="/admin/products"
              className={`text-sm font-medium transition-colors hover:text-indigo-700 ${
                pathname === "/admin/products"
                  ? "text-indigo-700"
                  : "text-black"
              }`}
            >
              Manage Products
            </Link>
          )}

          {/* Cart Icon with Count */}
          <Link
            href="/cart"
            className="relative p-2"
            aria-label="Shopping cart"
          >
            <FiShoppingCart className="h-6 w-6" />
            {mounted && cartItemCount > 0 && (
              <span className="absolute top-0 right-0 h-5 w-5 bg-indigo-700 text-white text-xs rounded-full flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </Link>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={toggleUserMenu}
              className="flex items-center space-x-1"
              aria-label="User menu"
            >
              <FiUser className="h-6 w-6" />
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-1 z-50 border border-gray-200">
                {user ? (
                  <>
                    <div className="px-4 py-2 text-sm text-gray-500 border-b border-gray-100">
                      {user.email}
                    </div>
                    <Link
                      href="/admin/products"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Manage Products
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/signin"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/signup"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Create Account
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="p-2 md:hidden"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? (
            <FiX className="h-6 w-6" />
          ) : (
            <FiMenu className="h-6 w-6" />
          )}
        </button>
      </Container>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-white md:hidden pt-20">
          <Container className="py-6 space-y-6">
            <div className="space-y-3">
              {/* Home Link */}
              <Link
                href="/"
                className="flex items-center py-2 text-lg font-medium hover:text-indigo-700"
                onClick={toggleMenu}
              >
                <FiHome className="mr-2 h-5 w-5" />
                Home
              </Link>

              {/* Cart Link */}
              <Link
                href="/cart"
                className="flex items-center py-2 text-lg font-medium hover:text-indigo-700"
                onClick={toggleMenu}
              >
                <FiShoppingCart className="mr-2 h-5 w-5" />
                Cart {mounted && cartItemCount > 0 && ` (${cartItemCount})`}
              </Link>

              {/* Admin Link */}
              {user && (
                <Link
                  href="/admin/products"
                  className="flex items-center py-2 text-lg font-medium hover:text-indigo-700"
                  onClick={toggleMenu}
                >
                  Manage Products
                </Link>
              )}
            </div>

            <div className="pt-6 border-t border-gray-200">
              {user ? (
                <>
                  <div className="text-sm text-gray-500 mb-3">
                    Signed in as: {user.email}
                  </div>
                  <Button
                    onClick={() => {
                      handleSignOut();
                      toggleMenu();
                    }}
                    variant="outline"
                    className="mt-4"
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <div className="flex flex-col space-y-4">
                  <Link href="/signin" onClick={toggleMenu}>
                    <Button variant="outline" className="w-full">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/signup" onClick={toggleMenu}>
                    <Button className="w-full">Create Account</Button>
                  </Link>
                </div>
              )}
            </div>
          </Container>
        </div>
      )}
    </header>
  );
};

export default Header;
