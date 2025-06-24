import React, { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { config } from "@/lib/config";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when location changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const isActive = (path: string) => location === path;

  return (
    <nav
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled ? "bg-white shadow-md" : "bg-white/95 shadow-sm"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-primary flex items-center justify-center rounded-md mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-white"
                  >
                    <path d="M12 2c.5 0 .9 0 1.4.1a4 4 0 0 1 3.5 3.5c.2 1 .1 2.2-.3 3.4a4 4 0 0 1 2.1 2.1c1.2-.4 2.3-.5 3.4-.3a4 4 0 0 1 3.5 3.5c.4 2.7-2.1 5.8-6.5 7.8-1.3.6-2.8 1-4.1 1.1-1.3.1-2.6 0-3.7-.4A4 4 0 0 1 9 21c-1.1.4-2.4.5-3.7.4-1.3-.1-2.8-.5-4.1-1.1-4.4-2-6.9-5.1-6.5-7.8a4 4 0 0 1 3.5-3.5c1.1-.2 2.3-.1 3.4.3a4 4 0 0 1 2.1-2.1c-.4-1.2-.5-2.3-.3-3.4a4 4 0 0 1 3.5-3.5c.5-.1.9-.1 1.4-.1Z" />
                    <path d="M12 7c1.5 0 2.3.8 2.7 1.7" />
                    <path d="M9.3 8.7c.4-.9 1.2-1.7 2.7-1.7" />
                    <path d="M7.8 15.1c-1.1 0-2-.9-2-2 0-1.2.9-2 2-2h8.4c1.1 0 2 .9 2 2 0 1.1-.9 2-2 2" />
                    <path d="M12 7v10" />
                    <path d="M4.5 13a2.5 2.5 0 0 0 0-5" />
                    <path d="M19.5 13a2.5 2.5 0 0 1 0-5" />
                  </svg>
                </div>
                <span className="text-xl font-bold text-gray-900 font-montserrat">
                  NATIONAL FIRE PVT LTD
                </span>
              </div>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
              aria-expanded={isOpen}
            >
              <span className="sr-only">
                {isOpen ? "Close menu" : "Open menu"}
              </span>
              {isOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link 
              href="/"
              className={cn(
                "px-3 py-2 rounded-md text-sm font-medium transition",
                isActive("/")
                  ? "text-gray-900"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
              )}
            >
              Home
            </Link>
            <Link 
              href="/products"
              className={cn(
                "px-3 py-2 rounded-md text-sm font-medium transition",
                isActive("/products")
                  ? "text-gray-900"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
              )}
            >
              Products
            </Link>
            <Link 
              href="/blogs"
              className={cn(
                "px-3 py-2 rounded-md text-sm font-medium transition",
                isActive("/blogs")
                  ? "text-gray-900"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
              )}
            >
              Blogs
            </Link>
            <Link 
              href="/gallery"
              className={cn(
                "px-3 py-2 rounded-md text-sm font-medium transition",
                isActive("/gallery")
                  ? "text-gray-900"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
              )}
            >
              Gallery
            </Link>
            <Link 
              href="/brands"
              className={cn(
                "px-3 py-2 rounded-md text-sm font-medium transition",
                isActive("/brands")
                  ? "text-gray-900"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
              )}
            >
              Brands
            </Link>
            <Link 
              href="/about"
              className={cn(
                "px-3 py-2 rounded-md text-sm font-medium transition",
                isActive("/about")
                  ? "text-gray-900"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
              )}
            >
              About Us
            </Link>
            <Link href="/contact">
              <Button
                variant="default"
                size="sm"
                className="ml-2 bg-primary hover:bg-primary/90"
              >
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "md:hidden bg-white border-t transition-all",
          isOpen ? "block" : "hidden"
        )}
      >
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link 
            href="/"
            className={cn(
              "block px-3 py-2 rounded-md text-base font-medium",
              isActive("/")
                ? "text-gray-900"
                : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
            )}
          >
            Home
          </Link>
          <Link 
            href="/products"
            className={cn(
              "block px-3 py-2 rounded-md text-base font-medium",
              isActive("/products")
                ? "text-gray-900"
                : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
            )}
          >
            Products
          </Link>
          <Link 
            href="/blogs"
            className={cn(
              "block px-3 py-2 rounded-md text-base font-medium",
              isActive("/blogs")
                ? "text-gray-900"
                : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
            )}
          >
            Blogs
          </Link>
          <Link 
            href="/gallery"
            className={cn(
              "block px-3 py-2 rounded-md text-base font-medium",
              isActive("/gallery")
                ? "text-gray-900"
                : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
            )}
          >
            Gallery
          </Link>
          <Link 
            href="/brands"
            className={cn(
              "block px-3 py-2 rounded-md text-base font-medium",
              isActive("/brands")
                ? "text-gray-900"
                : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
            )}
          >
            Brands
          </Link>
          <Link 
            href="/about"
            className={cn(
              "block px-3 py-2 rounded-md text-base font-medium",
              isActive("/about")
                ? "text-gray-900"
                : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
            )}
          >
            About Us
          </Link>
          <Link 
            href="/contact"
            className="block px-3 py-2 rounded-md text-base font-medium bg-primary text-white hover:bg-primary/90"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
