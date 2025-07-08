import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { API_ENDPOINTS } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, AlertCircle } from "lucide-react";
import type { SubProduct } from "@shared/schema";

interface SubProductDetailProps {
  id: string;
}

const SubProductDetail: React.FC<SubProductDetailProps> = ({ id }) => {
  const [, setLocation] = useLocation();

  const { data, isLoading, error } = useQuery<{ subProduct: SubProduct }>({
    queryKey: [API_ENDPOINTS.SUB_PRODUCT(id)],
  });

  const subProduct = data?.subProduct;

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Skeleton className="h-8 w-32 mb-6" />
        <Skeleton className="h-12 w-96 mb-4" />
        <Skeleton className="h-64 w-full mb-6" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    );
  }

  if (error || !subProduct) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-500 hover:text-gray-700"
            onClick={() => setLocation(-1)}
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Back
          </Button>
        </div>
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Sub-Product Not Found</h2>
          <p className="text-gray-600">The sub-product you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-500 hover:text-gray-700"
          onClick={() => setLocation(-1)}
        >
          <ChevronLeft className="h-4 w-4 mr-1" /> Back
        </Button>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-blue-600 font-montserrat mb-2">
          {subProduct.name}
        </h1>
        {subProduct.modelNumber && (
          <p className="text-lg text-red-600 font-medium">
            Model: {subProduct.modelNumber}
          </p>
        )}
      </div>

      <div className="mb-8">
        <img
          src={subProduct.photo}
          alt={subProduct.name}
          className="w-full max-w-2xl mx-auto rounded-lg shadow-lg"
        />
      </div>

      {/* Blank content area - ready for hardcoding */}
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <h3 className="text-lg font-semibold text-gray-600 mb-2">Content Area</h3>
        <p className="text-gray-500">
          This page is ready for hardcoded content specific to "{subProduct.name}".
        </p>
      </div>
    </div>
  );
};

export default SubProductDetail;