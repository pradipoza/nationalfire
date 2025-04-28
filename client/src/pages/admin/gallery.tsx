import React from "react";
import GalleryManager from "@/components/admin/GalleryManager";

const AdminGallery: React.FC = () => {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Gallery Management</h1>
        <p className="text-gray-500">Upload, organize, and manage your gallery photos</p>
      </div>
      
      <GalleryManager />
    </div>
  );
};

export default AdminGallery;
