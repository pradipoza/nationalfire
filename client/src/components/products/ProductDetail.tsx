import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { API_ENDPOINTS } from "@/lib/config";
import { ChevronLeft, Share2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import ProductInquiry from "./ProductInquiry";
import type { SubProduct } from "@shared/schema";

interface ProductDetailProps {
  id: string;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ id }) => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [showInquiryForm, setShowInquiryForm] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: [API_ENDPOINTS.PRODUCT(id)],
  });

  const product = (data as { product: any } | undefined)?.product;

  // Fetch sub-products if product has subProductIds  
  const { data: subProductsData, isLoading: subProductsLoading } = useQuery({
    queryKey: ["/api/sub-products/by-ids", product?.subProductIds],
    queryFn: async () => {
      if (!product?.subProductIds || product.subProductIds.length === 0) {
        return { subProducts: [] };
      }
      
      const response = await fetch("/api/sub-products/by-ids", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids: product.subProductIds }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch sub-products");
      }
      
      return response.json();
    },
    enabled: !!product?.subProductIds && product.subProductIds.length > 0,
  });

  const subProducts: SubProduct[] = subProductsData?.subProducts || [];

  const shareProduct = () => {
    if (navigator.share) {
      navigator
        .share({
          title: product?.name,
          text: product?.description,
          url: window.location.href,
        })
        .then(() => console.log("Shared successfully"))
        .catch((error) => console.log("Error sharing:", error));
    } else {
      // Fallback for browsers that don't support navigator.share
      navigator.clipboard.writeText(window.location.href).then(() => {
        toast({
          title: "Link copied!",
          description: "Product link copied to clipboard",
        });
      });
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-500"
            onClick={() => setLocation("/products")}
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Back to Products
          </Button>
        </div>
        
        {/* Product Header Loading */}
        <div className="mb-12">
          <Skeleton className="h-12 w-2/3 mb-6" />
          <Skeleton className="h-6 w-full mb-2" />
          <Skeleton className="h-6 w-full mb-2" />
          <Skeleton className="h-6 w-3/4 mb-8" />
        </div>

        {/* Available Models Loading */}
        <div className="mb-12">
          <Skeleton className="h-10 w-1/3 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-6">
                <Skeleton className="w-full h-48 rounded-lg mb-4" />
                <Skeleton className="h-6 w-3/4 mb-2 mx-auto" />
                <Skeleton className="h-4 w-1/2 mb-4 mx-auto" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        </div>
        
        {/* Inquiry Section Loading */}
        <div className="flex justify-center space-x-4">
          <Skeleton className="h-12 w-32" />
          <Skeleton className="h-12 w-12" />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Product Not Found
          </h2>
          <p className="text-gray-500 mb-6">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/products">
            <Button>View All Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center mb-4">
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-500 hover:text-gray-700"
          onClick={() => setLocation("/products")}
        >
          <ChevronLeft className="h-4 w-4 mr-1" /> Back to Products
        </Button>
      </div>
      
      {/* Product Header - Name and Description Only */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-blue-600 font-montserrat mb-4">
          {product.name}
        </h1>
        
        <div className="max-w-none mb-6">
          <p className="text-base md:text-lg text-gray-700 whitespace-pre-line leading-relaxed font-inter">
            {product.description}
          </p>
        </div>
      </div>

      {/* Available Models Section */}
      {subProducts.length > 0 ? (
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 font-montserrat">
            Available Models
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subProducts.map((subProduct) => (
              <Card 
                key={subProduct.id} 
                className="hover:shadow-lg transition-all duration-300 border border-gray-200 cursor-pointer"
                onClick={() => {
                  setLocation(`/sub-products/${encodeURIComponent(subProduct.name)}`);
                }}
              >
                <CardContent className="p-6">
                  <div className="mb-4">
                    <img
                      src={subProduct.photo}
                      alt={subProduct.name}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                  
                  <div className="text-left">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 font-montserrat">
                      {subProduct.name}
                    </h3>
                    
                    {/* Model number in red color without "Model:" prefix */}
                    <p className="text-sm text-red-600 font-medium">
                      {subProduct.modelNumber}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 font-montserrat">
            Available Models
          </h2>
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500 text-lg">
              No models available for this product yet.
            </p>
          </div>
        </div>
      )}
      
      {/* Inquiry Section */}
      <div className="flex justify-center space-x-4 mt-8">
        <Button
          onClick={() => setShowInquiryForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-base font-medium"
          size="lg"
        >
          Inquiry Now
        </Button>
        <Button
          onClick={shareProduct}
          variant="outline"
          size="lg"
          className="border-gray-300 hover:border-gray-400 px-6 py-3"
        >
          <Share2 className="h-4 w-4" />
        </Button>
      </div>
      
      {showInquiryForm && (
        <ProductInquiry
          productId={parseInt(id)}
          productName={product.name}
          onClose={() => setShowInquiryForm(false)}
        />
      )}
    </div>
  );
};

export default ProductDetail;
