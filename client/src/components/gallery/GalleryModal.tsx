import React, { useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";

interface GalleryModalProps {
  image: string;
  description: string;
  onClose: () => void;
}

const GalleryModal: React.FC<GalleryModalProps> = ({
  image,
  description,
  onClose,
}) => {
  // Close on escape key
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden bg-transparent border-none shadow-none">
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-10 p-2 bg-black/40 text-white rounded-full hover:bg-black/60 transition"
          >
            <X className="h-6 w-6" />
          </button>
          <div className="bg-black/90 p-2 md:p-4 rounded-lg">
            <div className="overflow-hidden rounded-lg">
              <img
                src={image}
                alt={description}
                className="max-h-[80vh] mx-auto object-contain"
              />
            </div>
            {description && (
              <div className="mt-4 text-white text-center p-2">
                <p className="font-medium text-lg">{description}</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GalleryModal;
