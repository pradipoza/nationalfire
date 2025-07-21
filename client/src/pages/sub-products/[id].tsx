import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { API_ENDPOINTS } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { RichTextDisplay } from "@/components/RichTextDisplay";
import { ChevronLeft, AlertCircle, Package, Calendar, Hash } from "lucide-react";
import type { SubProduct } from "@shared/schema";

interface SubProductDetailProps {
  id: string;
}

const SubProductDetail: React.FC<SubProductDetailProps> = ({ id }) => {
  const [, setLocation] = useLocation();

  const { data, isLoading, error } = useQuery<{ subProduct: SubProduct }>({
    queryKey: [API_ENDPOINTS.SUB_PRODUCT(id)],
  });

  // Get parent product for proper back navigation
  const { data: parentProductData } = useQuery({
    queryKey: [`/api/sub-products/${id}/parent-product`],
    enabled: !!id,
  });

  const subProduct = data?.subProduct;
  const parentProduct = parentProductData?.product;

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
            onClick={() => setLocation('/products')}
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

  const formatDate = (date: Date | string | null) => {
    if (!date) return "Unknown";
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleDateString("en-US", { 
      year: "numeric", 
      month: "long", 
      day: "numeric" 
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (parentProduct) {
                  setLocation(`/products/${parentProduct.id}`);
                } else {
                  setLocation('/products');
                }
              }}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Products
            </Button>
            <div className="text-sm text-gray-500">
              <span>Products</span> / <span>Sub-Products</span> / 
              <span className="text-gray-900 font-medium">{subProduct.name}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Product Image */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <img
                  src={subProduct.photo}
                  alt={subProduct.name}
                  className="w-full h-96 object-cover"
                />
              </div>
              
              {/* Product Info Card */}
              <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <Package className="h-5 w-5 mr-2" />
                  Product Information
                </h3>
                <div className="space-y-3">
                  {subProduct.modelNumber && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 flex items-center">
                        <Hash className="h-4 w-4 mr-1" />
                        Model Number
                      </span>
                      <Badge variant="secondary">{subProduct.modelNumber}</Badge>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Added
                    </span>
                    <span className="text-sm text-gray-900">
                      {formatDate(subProduct.createdAt)}
                    </span>
                  </div>
                  {subProduct.updatedAt && subProduct.updatedAt !== subProduct.createdAt && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Updated
                      </span>
                      <span className="text-sm text-gray-900">
                        {formatDate(subProduct.updatedAt)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm">
              {/* Header */}
              <div className="p-6 border-b">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {subProduct.name}
                </h1>
                {subProduct.modelNumber && (
                  <p className="text-gray-600 text-lg">
                    Model: {subProduct.modelNumber}
                  </p>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Product Details & Specifications
                </h2>
                <Separator className="mb-6" />
                
                <div className="prose-container">
                  <RichTextDisplay 
                    content={subProduct.content || ""} 
                    className="max-w-none"
                  />
                </div>

                {(!subProduct.content || subProduct.content.trim() === "") && (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No Details Available
                    </h3>
                    <p className="text-gray-600">
                      Detailed product specifications and information will be added soon.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubProductDetail;