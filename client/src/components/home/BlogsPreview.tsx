import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ChevronRight, Calendar } from "lucide-react";
import { API_ENDPOINTS } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import BlogCard from "@/components/blogs/BlogCard";
import { Skeleton } from "@/components/ui/skeleton";

const BlogsPreview: React.FC = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: [API_ENDPOINTS.BLOGS],
  });

  const blogs = data?.blogs || [];
  const displayBlogs = blogs.slice(0, 3); // Show only first 3 blogs

  return (
    <section id="blogs" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 font-montserrat">
            Latest Industry Insights
          </h2>
          <p className="mt-4 text-lg text-gray-500 max-w-3xl mx-auto">
            Stay informed with our expert analysis and news from the emergency vehicle sector
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
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
          <div className="text-center py-6 text-red-500">
            Failed to load blogs. Please try again later.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayBlogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} preview />
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link href="/blogs">
            <Button
              variant="outline"
              className="border-2 border-secondary text-secondary hover:bg-secondary hover:text-white font-semibold text-base px-6 py-3"
            >
              Read All Articles <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogsPreview;
