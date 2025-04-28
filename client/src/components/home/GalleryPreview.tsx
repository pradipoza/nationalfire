import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Images } from "lucide-react";
import { API_ENDPOINTS } from "@/lib/config";
import { Button } from "@/components/ui/button";
import GalleryItem from "@/components/gallery/GalleryItem";
import GalleryModal from "@/components/gallery/GalleryModal";
import { Skeleton } from "@/components/ui/skeleton";

const GalleryPreview: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<{
    photo: string;
    description: string;
  } | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: [API_ENDPOINTS.GALLERY],
  });

  const gallery = data?.gallery || [];
  const displayItems = gallery.slice(0, 4); // Show only first 4 gallery items

  const openGalleryModal = (photo: string, description: string) => {
    setSelectedImage({ photo, description });
  };

  const closeGalleryModal = () => {
    setSelectedImage(null);
  };

  return (
    <section id="gallery" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 font-montserrat">
            Our Gallery
          </h2>
          <p className="mt-4 text-lg text-gray-500 max-w-3xl mx-auto">
            Explore our collection of emergency vehicles and projects
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-lg" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-6 text-red-500">
            Failed to load gallery. Please try again later.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {displayItems.map((item) => (
              <GalleryItem
                key={item.id}
                item={item}
                onClick={() => openGalleryModal(item.photo, item.description)}
              />
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link href="/gallery">
            <Button
              variant="outline"
              className="border-2 border-secondary text-secondary hover:bg-secondary hover:text-white font-semibold text-base px-6 py-3"
            >
              View Full Gallery <Images className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>

      {selectedImage && (
        <GalleryModal
          image={selectedImage.photo}
          description={selectedImage.description}
          onClose={closeGalleryModal}
        />
      )}
    </section>
  );
};

export default GalleryPreview;
