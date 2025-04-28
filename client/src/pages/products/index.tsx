import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/lib/config";
import { Product } from "@shared/schema";
import ProductCard from "@/components/products/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, ShoppingCart } from "lucide-react";

const ProductsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data, isLoading, error } = useQuery({
    queryKey: [API_ENDPOINTS.PRODUCTS],
  });

  const products = data?.products || [];

  // Filter products based on search query
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const productCategories = [
    "Fire Trucks",
    "Ambulances",
    "Electric Buses",
    "Rescue Equipment",
    "Spare Parts",
    "Custom Solutions"
  ];

  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 font-montserrat">
            Our Products
          </h1>
          <p className="mt-4 text-lg text-gray-500 max-w-3xl mx-auto">
            Discover our range of emergency vehicles, electric buses, and specialized parts designed for reliability and performance.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search products..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex-shrink-0">
            <Button variant="outline" className="border-gray-300">
              <Filter className="h-4 w-4 mr-2" /> Filter
            </Button>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-10 overflow-x-auto">
          <div className="flex space-x-2 min-w-max pb-2">
            <Button variant="secondary" className="rounded-full">
              All Products
            </Button>
            {productCategories.map((category) => (
              <Button 
                key={category} 
                variant="outline" 
                className="rounded-full hover:bg-secondary hover:text-white"
              >
                {category}
              </Button>
            ))}
          </div>
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
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Products Found</h3>
            <p className="text-gray-500 mb-4">
              {searchQuery 
                ? `No products matching "${searchQuery}"`
                : "No products are currently available in this category."}
            </p>
            {searchQuery && (
              <Button onClick={() => setSearchQuery("")}>Clear Search</Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
