import React from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <Card className="overflow-hidden shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="h-56 overflow-hidden">
        <img
          src={product.photos[0] || "https://images.unsplash.com/photo-1516550893885-985da0253db1?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <CardContent className="p-6">
        <h3 className="text-xl font-bold text-gray-900 font-montserrat">
          {product.name}
        </h3>
        <p className="mt-2 text-gray-500 line-clamp-2">
          {product.description}
        </p>
        <div className="mt-6 flex space-x-3">
          <Link href={`/products/${product.id}`}>
            <Button
              variant="outline"
              className="flex-1 border-secondary text-secondary hover:bg-secondary hover:text-white"
            >
              See Details
            </Button>
          </Link>
          <Link href={`/contact?product=${product.id}`}>
            <Button
              variant="default"
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              Inquiry Now
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
