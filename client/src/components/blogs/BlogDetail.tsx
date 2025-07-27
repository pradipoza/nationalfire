import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { API_ENDPOINTS } from "@/lib/config";
import { ChevronLeft, Calendar, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import DOMPurify from 'dompurify';

interface BlogDetailProps {
  id: string;
}

const BlogDetail: React.FC<BlogDetailProps> = ({ id }) => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data, isLoading, error } = useQuery({
    queryKey: [API_ENDPOINTS.BLOG(id)],
  });

  const blog = data?.blog;

  const shareBlog = () => {
    if (navigator.share) {
      navigator
        .share({
          title: blog?.title,
          text: blog?.content.slice(0, 100) + "...",
          url: window.location.href,
        })
        .then(() => console.log("Shared successfully"))
        .catch((error) => console.log("Error sharing:", error));
    } else {
      // Fallback for browsers that don't support navigator.share
      navigator.clipboard.writeText(window.location.href).then(() => {
        toast({
          title: "Link copied!",
          description: "Blog link copied to clipboard",
        });
      });
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center mb-6">
          <Skeleton className="h-9 w-32" />
        </div>
        <Skeleton className="h-10 w-3/4 mb-2" />
        <div className="flex items-center mb-6">
          <Skeleton className="h-5 w-32" />
        </div>
        <Skeleton className="w-full h-[300px] mb-8" />
        <div className="space-y-4">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-3/4" />
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Blog Not Found
          </h2>
          <p className="text-gray-500 mb-6">
            The blog post you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/blogs">
            <Button>View All Blogs</Button>
          </Link>
        </div>
      </div>
    );
  }

  const formattedDate = format(new Date(blog.createdAt), "MMMM d, yyyy");

  // Organize photos by position
  const topPhotos = blog.photos.filter(photo => photo.position === "top");
  const middlePhotos = blog.photos.filter(photo => photo.position === "middle");
  const bottomPhotos = blog.photos.filter(photo => photo.position === "bottom");

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-500"
          onClick={() => setLocation("/blogs")}
        >
          <ChevronLeft className="h-4 w-4 mr-1" /> Back to Blogs
        </Button>
      </div>

      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 font-montserrat mb-4">
        {blog.title}
      </h1>

      <div className="flex items-center text-gray-500 mb-8">
        <Calendar className="h-4 w-4 mr-2" />
        <span>{formattedDate}</span>
        <Button
          variant="ghost"
          size="sm"
          className="ml-auto"
          onClick={shareBlog}
        >
          <Share2 className="h-4 w-4 mr-1" /> Share
        </Button>
      </div>

      <div className="prose max-w-none">
        {/* Top Photos */}
        {topPhotos.length > 0 && (
          <div className="mb-6">
            {topPhotos.map((photo, index) => (
              <img
                key={index}
                src={photo.url}
                alt={`${blog.title} - image ${index + 1}`}
                className="w-full rounded-lg object-cover mb-2"
              />
            ))}
          </div>
        )}

        {/* First part of content */}
        {middlePhotos.length > 0 ? (
          <div>
            <div className="mb-6 whitespace-pre-line">
              {blog.content.slice(0, Math.floor(blog.content.length / 2))}
            </div>

            {/* Middle Photos */}
            <div className="my-6">
              {middlePhotos.map((photo, index) => (
                <img
                  key={index}
                  src={photo.url}
                  alt={`${blog.title} - image ${topPhotos.length + index + 1}`}
                  className="w-full rounded-lg object-cover mb-2"
                />
              ))}
            </div>

            {/* Second part of content */}
            <div className="whitespace-pre-line">
              {blog.content.slice(Math.floor(blog.content.length / 2))}
            </div>
          </div>
        ) : (
          <div className="whitespace-pre-line">{blog.content}</div>
        )}

        {/* Bottom Photos */}
        {bottomPhotos.length > 0 && (
          <div className="mt-6">
            {bottomPhotos.map((photo, index) => (
              <img
                key={index}
                src={photo.url}
                alt={`${blog.title} - image ${
                  topPhotos.length + middlePhotos.length + index + 1
                }`}
                className="w-full rounded-lg object-cover mb-2"
              />
            ))}
          </div>
        )}
      </div>

      <div className="mt-12 border-t border-gray-200 pt-6">
        <div className="flex justify-between">
          <Button
            variant="ghost"
            className="text-gray-500"
            onClick={() => setLocation("/blogs")}
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Back to all blogs
          </Button>
          <Button
            variant="outline"
            className="text-secondary border-secondary hover:bg-secondary hover:text-white"
            onClick={shareBlog}
          >
            <Share2 className="h-4 w-4 mr-1" /> Share this article
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
