import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { API_ENDPOINTS } from "@/lib/config";
import { Product, Brand } from "@shared/schema";
import ProductCard from "@/components/products/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Building2, ShoppingCart } from "lucide-react";
import { Link } from "wouter";

interface BrandProductsPageProps {
  id: string;
}

const BrandProductsPage: React.FC<BrandProductsPageProps> = ({ id }) => {
  const brandId = parseInt(id || "0");

  const { data: brandData, isLoading: brandLoading } = useQuery({
    queryKey: [`/api/brands/${brandId}`],
  });

  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: [`/api/brands/${brandId}/products`],
  });

  const brand = brandData?.brand;
  const products = productsData?.products || [];
  const isLoading = brandLoading || productsLoading;

  if (isLoading) {
    return (
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Skeleton className="h-10 w-32 mb-4" />
            <div className="bg-white rounded-lg p-8 shadow-sm mb-8">
              <div className="flex items-center space-x-6">
                <Skeleton className="w-24 h-24" />
                <div className="flex-1">
                  <Skeleton className="h-8 w-48 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            </div>
          </div>
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
        </div>
      </div>
    );
  }

  if (!brand) {
    return (
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <Building2 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Brand Not Found</h3>
            <p className="text-gray-500 mb-4">
              The requested brand could not be found.
            </p>
            <Link href="/brands">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Brands
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-8">
          <Link href="/brands">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Brands
            </Button>
          </Link>

          {/* Brand Header */}
          <div className="bg-white rounded-lg p-8 shadow-sm mb-8">
            <div className="flex items-center space-x-6">
              <div className="flex-shrink-0">
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="w-24 h-24 object-contain rounded-lg border border-gray-200"
                />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 font-montserrat mb-2">
                  {brand.name}
                </h1>
                {brand.description && (
                  <p className="text-lg text-gray-600">
                    {brand.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 font-montserrat mb-6">
            Products from {brand.name}
          </h2>

          {products.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <ShoppingCart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Products Available</h3>
              <p className="text-gray-500 mb-4">
                No products are currently available from this brand.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product: Product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrandProductsPage;