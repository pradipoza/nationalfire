import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/lib/config";
import { Product } from "@shared/schema";
import ProductCard from "@/components/products/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShoppingCart, Search, X } from "lucide-react";

const ProductsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data, isLoading, error } = useQuery({
    queryKey: [API_ENDPOINTS.PRODUCTS],
  });

  const products = data?.products || [];

  // Filter products based on search term
  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) {
      return products;
    }
    return products.filter((product: Product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase().trim())
    );
  }, [products, searchTerm]);

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  return (
    <div className="py-12 bg-gray-50 min-w-fit">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-w-fit">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 font-montserrat">
            Our Products
          </h1>
          <p className="mt-4 text-lg text-gray-500 max-w-3xl mx-auto">
            Discover our range of emergency vehicles, electric buses, and specialized parts designed for reliability and performance.
          </p>
        </div>

        {/* Search Section */}
        <div className="mb-8 max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search products by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-10 h-12 text-base"
            />
            {searchTerm && (
              <button
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
          {searchTerm && (
            <p className="mt-2 text-sm text-gray-600 text-center">
              {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found for "{searchTerm}"
            </p>
          )}
        </div>



        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg overflow-hidden shadow-md">
                <Skeleton className="w-full h-56" />
                <div className="p-6">
                  <Skeleton className="h-7 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-6" />
                  <div className="flex space-x-3">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <div className="text-red-500 mb-4">Failed to load products. Please try again later.</div>
            <Button onClick={() => window.location.reload()}>Refresh</Button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <ShoppingCart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {searchTerm ? "No Products Found" : "No Products Available"}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm 
                ? `No products match your search for "${searchTerm}". Try a different search term.`
                : "No products are currently available."
              }
            </p>
            {searchTerm && (
              <Button onClick={handleClearSearch} variant="outline">
                Clear Search
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product: Product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
