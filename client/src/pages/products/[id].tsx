import React from "react";
import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/lib/config";
import ProductDetail from "@/components/products/ProductDetail";

interface ProductDetailPageProps {
  id: string;
}

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ id }) => {
  return (
    <div className="py-12">
      <ProductDetail id={id} />
    </div>
  );
};

export default ProductDetailPage;
