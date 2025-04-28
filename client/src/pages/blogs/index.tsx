import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/lib/config";
import { Blog } from "@shared/schema";
import BlogCard from "@/components/blogs/BlogCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, FileText } from "lucide-react";

const BlogsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data, isLoading, error } = useQuery({
    queryKey: [API_ENDPOINTS.BLOGS],
  });

  const blogs = data?.blogs || [];

  // Filter blogs based on search query
  const filteredBlogs = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    blog.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 font-montserrat">
            Industry Insights
          </h1>
          <p className="mt-4 text-lg text-gray-500 max-w-3xl mx-auto">
            Stay informed with our expert analysis and news from the emergency vehicle sector
          </p>
        </div>

        {/* Search */}
        <div className="mb-8 max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search articles..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg overflow-hidden shadow-md">
                <Skeleton className="w-full h-48" />
                <div className="p-6">
                  <Skeleton className="h-4 w-1/3 mb-2" />
                  <Skeleton className="h-7 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3 mb-6" />
                  <Skeleton className="h-6 w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <div className="text-red-500 mb-4">Failed to load blogs. Please try again later.</div>
            <Button onClick={() => window.location.reload()}>Refresh</Button>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Articles Found</h3>
            <p className="text-gray-500 mb-4">
              {searchQuery 
                ? `No articles matching "${searchQuery}"`
                : "No articles are currently available."}
            </p>
            {searchQuery && (
              <Button onClick={() => setSearchQuery("")}>Clear Search</Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBlogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogsPage;
