import React from "react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronRight } from "lucide-react";
import { Blog } from "@shared/schema";
import { format } from "date-fns";

interface BlogCardProps {
  blog: Blog;
  preview?: boolean;
}

const BlogCard: React.FC<BlogCardProps> = ({ blog, preview = false }) => {
  // Find top image if available
  const topImage = blog.photos.find((photo) => photo.position === "top");
  const displayImage = topImage ? topImage.url : blog.photos[0]?.url;
  
  // Format the date
  const formattedDate = format(new Date(blog.createdAt), "MMMM d, yyyy");
  
  // Create a truncated preview of content
  const truncatedContent = blog.content.slice(0, 150) + (blog.content.length > 150 ? "..." : "");

  return (
    <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      <div className="h-48 overflow-hidden">
        <img
          src={displayImage || "https://images.unsplash.com/photo-1471039497385-b6d6ba609f9c?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"}
          alt={blog.title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <CardContent className="p-6">
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <Calendar className="h-4 w-4 mr-2" />
          <span>{formattedDate}</span>
        </div>
        <h3 className="text-xl font-bold text-gray-900 font-montserrat mb-2">
          {blog.title}
        </h3>
        <p className="text-gray-500 line-clamp-3">
          {truncatedContent}
        </p>
        <div className="mt-4">
          <Link href={`/blogs/${blog.id}`}>
            <Button
              variant="link"
              className="p-0 text-secondary font-medium hover:text-secondary/90"
            >
              Show More <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default BlogCard;
