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
  const [activeImage, setActiveImage] = useState(0);
  const [showInquiryForm, setShowInquiryForm] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: [API_ENDPOINTS.PRODUCT(id)],
  });

  const product = data?.product;

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
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <Skeleton className="w-full aspect-[4/3] rounded-lg" />
            <div className="mt-4 grid grid-cols-4 gap-2">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="aspect-square rounded-md" />
              ))}
            </div>
          </div>
          
          <div>
            <Skeleton className="h-10 w-3/4 mb-3" />
            <Skeleton className="h-5 w-full mb-2" />
            <Skeleton className="h-5 w-full mb-2" />
            <Skeleton className="h-5 w-3/4 mb-6" />
            
            <div className="flex space-x-4 mt-8">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-14" />
            </div>
          </div>
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
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <div className="overflow-hidden rounded-lg bg-gray-100">
            <img
              src={product.photos[activeImage] || product.photos[0]}
              alt={product.name}
              className="w-full object-cover aspect-[4/3]"
            />
          </div>
          
          {product.photos.length > 1 && (
            <div className="mt-4 grid grid-cols-4 gap-2">
              {product.photos.map((photo, index) => (
                <div
                  key={index}
                  className={`overflow-hidden rounded-md cursor-pointer border-2 ${
                    activeImage === index
                      ? "border-primary"
                      : "border-transparent"
                  }`}
                  onClick={() => setActiveImage(index)}
                >
                  <img
                    src={photo}
                    alt={`${product.name} - view ${index + 1}`}
                    className="w-full h-full object-cover aspect-square"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-montserrat mb-4">
            {product.name}
          </h1>
          
          <div className="prose max-w-none mb-6">
            <p className="text-gray-600 whitespace-pre-line">
              {product.description}
            </p>
          </div>

          {/* Sub-Products Section */}
          {subProducts.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 font-montserrat">
                Available Models
              </h2>
              <div className="space-y-4">
                {subProducts.map((subProduct) => (
                  <Card key={subProduct.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <img
                          src={subProduct.photo}
                          alt={subProduct.name}
                          className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                        />
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {subProduct.name}
                          </h3>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                            {subProduct.description}
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setLocation(`/sub-products/${subProduct.id}`)}
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex space-x-4 mt-8">
            <Button
              onClick={() => setShowInquiryForm(true)}
              className="flex-1 bg-primary hover:bg-primary/90 text-white"
              size="lg"
            >
              Inquiry Now
            </Button>
            <Button
              onClick={shareProduct}
              variant="outline"
              size="lg"
              className="border-gray-300"
            >
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
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
