import React from "react";
import { Gallery } from "@shared/schema";

interface GalleryItemProps {
  item: Gallery;
  onClick: () => void;
}

const GalleryItem: React.FC<GalleryItemProps> = ({ item, onClick }) => {
  return (
    <div 
      className="relative overflow-hidden rounded-lg aspect-square cursor-pointer group"
      onClick={onClick}
    >
      <img 
        src={item.photo} 
        alt={item.description} 
        className="w-full h-full object-cover transition duration-300 group-hover:scale-110" 
      />
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center transition duration-300">
        <p className="text-white opacity-0 group-hover:opacity-100 text-center p-4 font-medium">
          {item.description}
        </p>
      </div>
    </div>
  );
};

export default GalleryItem;
