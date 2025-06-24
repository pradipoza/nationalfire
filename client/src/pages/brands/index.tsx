import React from "react";
import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/lib/config";
import { Brand } from "@shared/schema";
import BrandCard from "@/components/brands/BrandCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Building2 } from "lucide-react";

const BrandsPage: React.FC = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: [API_ENDPOINTS.BRANDS],
  });

  const brands = data?.brands || [];

  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 font-montserrat">
            Our Brands
          </h1>
          <p className="mt-4 text-lg text-gray-500 max-w-3xl mx-auto">
            Discover the trusted brands we partner with to deliver high-quality emergency vehicles and equipment.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg overflow-hidden shadow-md p-6">
                <Skeleton className="w-full h-32 mb-4" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <div className="text-red-500 mb-4">Failed to load brands. Please try again later.</div>
            <Button onClick={() => window.location.reload()}>Refresh</Button>
          </div>
        ) : brands.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <Building2 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Brands Found</h3>
            <p className="text-gray-500 mb-4">
              No brands are currently available.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {brands.map((brand: Brand) => (
              <BrandCard key={brand.id} brand={brand} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BrandsPage;