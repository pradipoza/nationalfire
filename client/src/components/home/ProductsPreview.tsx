import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ChevronRight } from "lucide-react";
import { API_ENDPOINTS } from "@/lib/config";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/products/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";

const ProductsPreview: React.FC = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: [API_ENDPOINTS.PRODUCTS],
  });

  const products = data?.products || [];
  const displayProducts = products.slice(0, 3); // Show only first 3 products

  return (
    <section id="products" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 font-montserrat">
            Our Premium Products
          </h2>
          <p className="mt-4 text-lg text-gray-500 max-w-3xl mx-auto">
            Discover our range of emergency vehicles, electric buses, and specialized parts
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
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
          <div className="text-center py-6 text-red-500">
            Failed to load products. Please try again later.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link href="/products">
            <Button
              variant="outline"
              className="border-2 border-secondary text-secondary hover:bg-secondary hover:text-white font-semibold text-base px-6 py-3"
            >
              View All Products <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductsPreview;
