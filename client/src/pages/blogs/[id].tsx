import React from "react";
import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/lib/config";
import BlogDetail from "@/components/blogs/BlogDetail";

interface BlogDetailPageProps {
  id: string;
}

const BlogDetailPage: React.FC<BlogDetailPageProps> = ({ id }) => {
  return (
    <div className="py-12">
      <BlogDetail id={id} />
    </div>
  );
};

export default BlogDetailPage;
