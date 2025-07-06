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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
          
          {/* Product Name and Model */}
          <div className="text-left mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-black font-montserrat mb-2">
              {subProduct.name}
            </h1>
            <p className="text-lg text-red-600 font-medium">
              {subProduct.modelNumber}
            </p>
          </div>
        </div>

        {/* Main Content - Image and Specifications */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Image */}
          <div>
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

          {/* Specifications Table */}
          <div>
            {subProduct.specifications && subProduct.specifications.length > 0 ? (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4 font-montserrat">
                    Specifications
                  </h2>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                      <tbody>
                        {subProduct.specifications.map((spec, index) => (
                          <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                            <td className="border border-gray-300 px-4 py-3 font-medium text-gray-900">
                              {spec.key}
                            </td>
                            <td className="border border-gray-300 px-4 py-3 text-gray-700">
                              {spec.value}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-gray-500">No specifications available for this product.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Description Section - Full Width */}
        <div className="mb-12">
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 font-montserrat">
                Description
              </h2>
              <div className="prose prose-gray max-w-none">
                <div className="whitespace-pre-wrap text-gray-700 leading-relaxed text-lg">
                  {subProduct.description}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features Section - Full Width */}
        {subProduct.features && subProduct.features.length > 0 && (
          <div className="mb-12">
            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6 font-montserrat">
                  Features
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {subProduct.features.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-700 leading-relaxed">{feature}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Contact Section */}
        <Card className="bg-primary/5">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4 font-montserrat">
              Need More Information?
            </h3>
            <p className="text-gray-600 mb-6 text-lg">
              Contact our experts for detailed specifications, pricing, and availability.
            </p>
            <div className="space-x-4">
              <Button 
                onClick={() => setLocation("/contact")}
                size="lg"
                className="px-8"
              >
                Get Quote & More Info
              </Button>
              <Button 
                variant="outline"
                onClick={() => setLocation("/products")}
                size="lg"
                className="px-8"
              >
                View All Products
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SubProductDetail;