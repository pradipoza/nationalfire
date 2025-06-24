import React from "react";
import { Link } from "wouter";
import { Brand } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface BrandCardProps {
  brand: Brand;
}

const BrandCard: React.FC<BrandCardProps> = ({ brand }) => {
  return (
    <Link href={`/brands/${brand.id}`}>
      <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white border border-gray-200">
        <CardContent className="p-6">
          <div className="flex flex-col items-center text-center">
            {/* Brand Logo */}
            <div className="w-20 h-20 mb-4 flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200">
              <img
                src={brand.logo}
                alt={brand.name}
                className="max-w-full max-h-full object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.parentElement!.innerHTML = `
                    <div class="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400">
                        <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
                        <circle cx="9" cy="9" r="2"/>
                        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                      </svg>
                    </div>
                  `;
                }}
              />
            </div>

            {/* Brand Name */}
            <h3 className="text-xl font-semibold text-gray-900 font-montserrat mb-2">
              {brand.name}
            </h3>

            {/* Brand Description */}
            {brand.description && (
              <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                {brand.description}
              </p>
            )}

            {/* View Products Badge */}
            <Badge variant="secondary" className="text-xs">
              View Products
            </Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default BrandCard;