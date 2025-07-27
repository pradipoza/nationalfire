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
import DOMPurify from 'dompurify';

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
      {/* Back button - always visible at top-left */}
      <div className="fixed top-4 left-4 z-50">
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
          className="bg-white/80 backdrop-blur-sm border border-gray-200 hover:bg-white/90 shadow-sm"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
      </div>

      {subProduct.htmlContent && subProduct.htmlContent.trim() !== '' ? (
        // Show ONLY the custom-designed visual page builder content - complete control over entire page
        <div className="w-full">
          <style dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(subProduct.cssContent || '', { ALLOWED_TAGS: ['style'], ALLOWED_ATTR: [] }) }} />
          <style>{`
            /* Mobile-First Responsive Template for Admin Content */
            @media (max-width: 768px) {
              * {
                box-sizing: border-box !important;
              }
              
              body, html {
                overflow-x: hidden !important;
                width: 100% !important;
              }
              
              /* Layout fixes */
              div, section, article, main, header, footer {
                max-width: 100% !important;
                width: 100% !important;
                overflow-x: hidden !important;
                padding-left: 16px !important;
                padding-right: 16px !important;
              }
              
              .gjs-row, .row, [class*="col"], [class*="grid"] {
                width: 100% !important;
                flex-direction: column !important;
                display: block !important;
                margin: 0 !important;
                padding: 8px !important;
              }
              
              /* Typography */
              h1 { 
                font-size: 24px !important; 
                line-height: 1.3 !important; 
                margin: 16px 0 !important;
                text-align: center !important;
              }
              h2 { font-size: 20px !important; margin: 14px 0 !important; }
              h3 { font-size: 18px !important; margin: 12px 0 !important; }
              h4, h5, h6 { font-size: 16px !important; margin: 10px 0 !important; }
              
              p, div, span {
                font-size: 14px !important;
                line-height: 1.5 !important;
                margin: 8px 0 !important;
                word-wrap: break-word !important;
              }
              
              /* Images */
              img {
                max-width: 100% !important;
                width: auto !important;
                height: auto !important;
                display: block !important;
                margin: 10px auto !important;
              }
              
              /* Tables */
              table {
                width: 100% !important;
                font-size: 12px !important;
                border-collapse: collapse !important;
                margin: 16px 0 !important;
                display: block !important;
                overflow-x: auto !important;
              }
              
              table th, table td {
                padding: 8px 4px !important;
                font-size: 11px !important;
                border: 1px solid #e5e7eb !important;
                word-wrap: break-word !important;
              }
              
              /* Buttons */
              button, .btn {
                width: 100% !important;
                max-width: 300px !important;
                padding: 12px 16px !important;
                font-size: 16px !important;
                margin: 8px auto !important;
                display: block !important;
              }
              
              /* Forms */
              input, select, textarea {
                width: 100% !important;
                padding: 12px !important;
                font-size: 16px !important;
                margin: 8px 0 !important;
              }
              
              /* Flexbox and Grid fixes */
              [style*="display: flex"], .flex {
                flex-direction: column !important;
                gap: 16px !important;
              }
              
              [style*="display: grid"], .grid {
                grid-template-columns: 1fr !important;
                gap: 16px !important;
              }
              
              /* Cards and containers */
              .card, .container, .content {
                margin: 16px 8px !important;
                padding: 16px !important;
                border-radius: 8px !important;
              }
              
              /* Fixed positioning fixes */
              [style*="position: absolute"], [style*="position: fixed"] {
                position: relative !important;
                top: auto !important;
                left: auto !important;
              }
              
              /* Width constraints */
              [style*="width"][style*="px"] {
                max-width: 100% !important;
              }
            }
            
            @media (max-width: 576px) {
              h1 { font-size: 22px !important; }
              h2 { font-size: 18px !important; }
              h3 { font-size: 16px !important; }
              
              table th, table td {
                font-size: 10px !important;
                padding: 6px 3px !important;
              }
            }
          `}</style>
          <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(subProduct.htmlContent) }} />
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