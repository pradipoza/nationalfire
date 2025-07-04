import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { API_ENDPOINTS } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Package } from "lucide-react";
import type { SubProduct } from "@shared/schema";

interface SubProductDetailProps {
  id: string;
}

const SubProductDetail: React.FC<SubProductDetailProps> = ({ id }) => {
  const [, setLocation] = useLocation();

  const { data, isLoading, error } = useQuery({
    queryKey: [API_ENDPOINTS.SUB_PRODUCT(id)],
  });

  const subProduct: SubProduct | undefined = data?.subProduct;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Skeleton className="h-10 w-32 mb-4" />
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Skeleton className="h-96 w-full rounded-lg" />
            <div className="space-y-4">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !subProduct) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Sub-Product Not Found</h1>
            <p className="text-gray-500 mb-8">
              The sub-product you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => setLocation("/products")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Products
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => window.history.back()}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 font-montserrat">
            {subProduct.name}
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            {subProduct.description}
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Image */}
          <div className="space-y-4">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <img
                  src={subProduct.photo}
                  alt={subProduct.name}
                  className="w-full h-96 object-cover"
                />
              </CardContent>
            </Card>
          </div>

          {/* Content */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4 font-montserrat">
                  Product Details
                </h2>
                <div className="prose prose-gray max-w-none">
                  <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                    {subProduct.content}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Info */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Need More Information?
                </h3>
                <p className="text-gray-600 mb-4">
                  Contact our experts for detailed specifications, pricing, and availability.
                </p>
                <Button 
                  onClick={() => setLocation("/contact")}
                  className="w-full"
                >
                  Get Quote & More Info
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Related Actions */}
        <Card className="bg-gray-100">
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Interested in Our Complete Range?
            </h3>
            <p className="text-gray-600 mb-4">
              Explore our full catalog of emergency vehicles and safety equipment.
            </p>
            <div className="space-x-4">
              <Button 
                variant="outline"
                onClick={() => setLocation("/products")}
              >
                View All Products
              </Button>
              <Button 
                onClick={() => setLocation("/contact")}
              >
                Contact Sales Team
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SubProductDetail;