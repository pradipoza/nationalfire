import React from "react";
import BlogManager from "@/components/admin/BlogManager";

const AdminBlogs: React.FC = () => {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Blog Management</h1>
        <p className="text-gray-500">Create, edit, and manage your blog posts</p>
      </div>
      
      <BlogManager />
    </div>
  );
};

export default AdminBlogs;
