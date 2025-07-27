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
            /* Balanced Mobile Responsive CSS for Admin Content */
            @media (max-width: 768px) {
              /* Prevent horizontal scrolling without being too restrictive */
              body, html {
                overflow-x: hidden;
                width: 100%;
              }
              
              /* Basic container adjustments - less aggressive */
              div, section, article, main {
                max-width: 100%;
                overflow-x: hidden;
                padding-left: 12px;
                padding-right: 12px;
              }
              
              /* Grid and flex layout improvements */
              .gjs-row, .row, [class*="col-"] {
                width: 100% !important;
                flex-direction: column !important;
                margin-bottom: 16px;
              }
              
              /* Typography - readable but not overly large */
              h1 { 
                font-size: 26px !important; 
                line-height: 1.3 !important; 
                margin: 20px 0 16px 0 !important;
                text-align: center !important;
              }
              h2 { 
                font-size: 22px !important; 
                line-height: 1.3 !important; 
                margin: 18px 0 14px 0 !important; 
              }
              h3 { 
                font-size: 20px !important; 
                line-height: 1.3 !important; 
                margin: 16px 0 12px 0 !important; 
              }
              h4, h5, h6 { 
                font-size: 18px !important; 
                line-height: 1.3 !important; 
                margin: 14px 0 10px 0 !important; 
              }
              
              /* Body text - comfortable reading size */
              p, div, span, li {
                font-size: 15px !important;
                line-height: 1.6 !important;
                margin: 10px 0 !important;
                word-wrap: break-word !important;
              }
              
              /* Images - responsive but maintain aspect ratio */
              img {
                max-width: 100% !important;
                width: auto !important;
                height: auto !important;
                display: block !important;
                margin: 16px auto !important;
                border-radius: 8px;
              }
              
              /* Tables - horizontal scroll for specs */
              table {
                width: 100% !important;
                font-size: 13px !important;
                border-collapse: collapse !important;
                margin: 20px 0 !important;
                display: block !important;
                overflow-x: auto !important;
                white-space: nowrap !important;
                -webkit-overflow-scrolling: touch !important;
              }
              
              table thead {
                display: block !important;
                background: #f8f9fa !important;
              }
              
              table tbody {
                display: block !important;
                max-height: none !important;
              }
              
              table tr {
                display: table !important;
                width: 100% !important;
                table-layout: fixed !important;
              }
              
              table th, table td {
                padding: 10px 8px !important;
                font-size: 12px !important;
                border: 1px solid #dee2e6 !important;
                word-wrap: break-word !important;
                min-width: 80px !important;
              }
              
              /* Buttons - touch friendly */
              button, .btn, input[type="button"], input[type="submit"] {
                min-width: 280px !important;
                max-width: 100% !important;
                padding: 14px 20px !important;
                font-size: 16px !important;
                margin: 12px auto !important;
                display: block !important;
                border-radius: 8px !important;
                text-align: center !important;
              }
              
              /* Forms */
              form {
                width: 100% !important;
                padding: 20px 16px !important;
              }
              
              input, select, textarea {
                width: 100% !important;
                padding: 14px !important;
                font-size: 16px !important;
                margin: 10px 0 !important;
                border-radius: 6px !important;
                border: 1px solid #ced4da !important;
                box-sizing: border-box !important;
              }
              
              /* Flexbox adjustments - less aggressive */
              .flex, [style*="display: flex"] {
                flex-direction: column !important;
                align-items: stretch !important;
                gap: 20px !important;
              }
              
              /* Grid adjustments */
              .grid, [style*="display: grid"] {
                grid-template-columns: 1fr !important;
                gap: 20px !important;
              }
              
              /* Cards and content blocks */
              .card, .content, [class*="container"] {
                margin: 20px 12px !important;
                padding: 20px !important;
                border-radius: 12px !important;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1) !important;
              }
              
              /* Lists */
              ul, ol {
                padding-left: 24px !important;
                margin: 16px 0 !important;
              }
              
              li {
                margin: 8px 0 !important;
                font-size: 15px !important;
                line-height: 1.6 !important;
              }
              
              /* Width constraints for large elements */
              [style*="width: "][style*="px"] {
                max-width: 100% !important;
              }
              
              /* Specification tables special handling */
              .specifications, .tech-specs, [class*="spec"] {
                overflow-x: auto !important;
                -webkit-overflow-scrolling: touch !important;
                margin: 20px 0 !important;
              }
              
              .specifications table, .tech-specs table {
                min-width: 400px !important;
                font-size: 11px !important;
              }
              
              /* Product showcase elements */
              .product-header, .product-title {
                text-align: center !important;
                padding: 24px 16px !important;
                background: #f8f9fa !important;
                border-radius: 12px !important;
                margin: 20px 0 !important;
              }
              
              .feature-grid, .specs-grid {
                display: grid !important;
                grid-template-columns: 1fr !important;
                gap: 16px !important;
                margin: 24px 0 !important;
              }
            }
            
            /* Extra small screens (less than 480px) */
            @media (max-width: 480px) {
              div, section, article {
                padding-left: 8px !important;
                padding-right: 8px !important;
              }
              
              h1 { font-size: 24px !important; }
              h2 { font-size: 20px !important; }
              h3 { font-size: 18px !important; }
              
              p, div, span, li {
                font-size: 14px !important;
              }
              
              table th, table td {
                font-size: 11px !important;
                padding: 8px 6px !important;
                min-width: 70px !important;
              }
              
              .specifications table {
                font-size: 10px !important;
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