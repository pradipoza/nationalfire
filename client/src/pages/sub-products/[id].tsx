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
    <div className="min-h-screen">
      {subProduct.htmlContent && subProduct.htmlContent.trim() !== '' ? (
        // Show ONLY the custom-designed visual page builder content - complete control over entire page
        <div className="w-full">
          <style dangerouslySetInnerHTML={{ __html: subProduct.cssContent || '' }} />
          <div dangerouslySetInnerHTML={{ __html: subProduct.htmlContent }} />
        </div>
      ) : (
        // Completely blank page if no content designed in editor - no default layout, no navigation, nothing
        <div className="w-full h-screen bg-white flex items-center justify-center">
          <div className="text-center text-gray-400">
            <div className="w-24 h-24 mx-auto mb-6 opacity-20">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21,15 16,10 5,21"/>
              </svg>
            </div>
            <p className="text-lg font-light mb-2">No content designed</p>
            <p className="text-sm opacity-60">This page will display content created in the admin panel</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubProductDetail;