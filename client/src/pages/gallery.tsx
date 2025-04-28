import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/lib/config";
import { Gallery } from "@shared/schema";
import GalleryItem from "@/components/gallery/GalleryItem";
import GalleryModal from "@/components/gallery/GalleryModal";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Image, RefreshCw } from "lucide-react";

const GalleryPage: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<{
    photo: string;
    description: string;
  } | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: [API_ENDPOINTS.GALLERY],
  });

  const galleryItems = data?.gallery || [];

  const openGalleryModal = (photo: string, description: string) => {
    setSelectedImage({ photo, description });
  };

  const closeGalleryModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 font-montserrat">
            Our Gallery
          </h1>
          <p className="mt-4 text-lg text-gray-500 max-w-3xl mx-auto">
            Explore our collection of emergency vehicles and projects showcasing our commitment to quality and innovation
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(12)].map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-lg" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <div className="text-red-500 mb-4">Failed to load gallery. Please try again later.</div>
            <Button onClick={() => window.location.reload()}>
              <RefreshCw className="mr-2 h-4 w-4" /> Refresh
            </Button>
          </div>
        ) : galleryItems.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <Image className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Gallery Items</h3>
            <p className="text-gray-500">
              There are no images in the gallery at the moment. Check back later!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {galleryItems.map((item) => (
              <GalleryItem
                key={item.id}
                item={item}
                onClick={() => openGalleryModal(item.photo, item.description)}
              />
            ))}
          </div>
        )}
      </div>

      {selectedImage && (
        <GalleryModal
          image={selectedImage.photo}
          description={selectedImage.description}
          onClose={closeGalleryModal}
        />
      )}
    </div>
  );
};

export default GalleryPage;
