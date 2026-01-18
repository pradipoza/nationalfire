import React, { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { config, API_ENDPOINTS } from "@/lib/config";
import { useQuery } from "@tanstack/react-query";
import type { SiteSettings } from "@shared/schema";
import defaultLogoImg from "@assets/image_1768730169464.png";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();

  const { data: siteSettingsData } = useQuery<{ siteSettings: SiteSettings | null }>({
    queryKey: [API_ENDPOINTS.SITE_SETTINGS],
  });

  const siteSettings = siteSettingsData?.siteSettings;
  const logoFromSettings = siteSettings?.logo;
  const isValidLogo = logoFromSettings && (
    logoFromSettings.startsWith("data:image/") || 
    logoFromSettings.startsWith("http")
  );
  const logoSrc = isValidLogo ? logoFromSettings : defaultLogoImg;
  const companyName = siteSettings?.companyName || "National Fire Safe Pvt Ltd";

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const isActive = (path: string) => location === path;

  return (
    <nav
      className={cn(
        "w-full transition-all duration-300 bg-white shadow-md"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <img 
                src={logoSrc} 
                alt={companyName} 
                className="h-12 w-auto mr-2"
              />
              <span className="text-xl font-bold text-gray-900 font-montserrat">
                {companyName}
              </span>
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
              href="/portfolio"
              className={cn(
                "px-3 py-2 rounded-md text-sm font-medium transition",
                isActive("/portfolio")
                  ? "text-gray-900"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
              )}
            >
              Portfolio
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
            href="/portfolio"
            className={cn(
              "block px-3 py-2 rounded-md text-base font-medium",
              isActive("/portfolio")
                ? "text-gray-900"
                : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
            )}
          >
            Portfolio
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
