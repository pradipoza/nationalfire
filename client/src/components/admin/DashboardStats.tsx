import React from "react";
import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/lib/config";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ShoppingCart,
  FileText,
  Image,
  MessageSquare,
  Eye,
} from "lucide-react";

const DashboardStats: React.FC = () => {
  // Fetch analytics data
  const { data: analyticsData, isLoading: isLoadingAnalytics } = useQuery({
    queryKey: [API_ENDPOINTS.ANALYTICS],
  });

  // Fetch products count
  const { data: productsData, isLoading: isLoadingProducts } = useQuery({
    queryKey: [API_ENDPOINTS.PRODUCTS],
  });

  // Fetch blogs count
  const { data: blogsData, isLoading: isLoadingBlogs } = useQuery({
    queryKey: [API_ENDPOINTS.BLOGS],
  });

  // Fetch gallery count
  const { data: galleryData, isLoading: isLoadingGallery } = useQuery({
    queryKey: [API_ENDPOINTS.GALLERY],
  });

  // Fetch inquiries count
  const { data: inquiriesData, isLoading: isLoadingInquiries } = useQuery({
    queryKey: [API_ENDPOINTS.INQUIRIES],
  });

  const isLoading =
    isLoadingAnalytics ||
    isLoadingProducts ||
    isLoadingBlogs ||
    isLoadingGallery ||
    isLoadingInquiries;

  // Prepare data for charts
  const preparePageViewsData = () => {
    if (!analyticsData?.visitsPerPage) return [];

    return Object.entries(analyticsData.visitsPerPage).map(([page, count]) => ({
      page: page.replace("/api/", ""),
      views: count,
    }));
  };

  const preparePieChartData = () => {
    if (!productsData?.products || !blogsData?.blogs || !galleryData?.gallery) {
      return [];
    }

    return [
      { name: "Products", value: productsData.products.length, fill: "hsl(var(--chart-1))" },
      { name: "Blogs", value: blogsData.blogs.length, fill: "hsl(var(--chart-2))" },
      { name: "Gallery", value: galleryData.gallery.length, fill: "hsl(var(--chart-3))" },
    ];
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Products Count */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingProducts ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">
                {productsData?.products?.length || 0}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Blogs Count */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Blogs</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingBlogs ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">
                {blogsData?.blogs?.length || 0}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Gallery Count */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Gallery Items</CardTitle>
            <Image className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingGallery ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">
                {galleryData?.gallery?.length || 0}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Inquiries Count */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Inquiries</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingInquiries ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">
                {inquiriesData?.inquiries?.length || 0}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Page Views Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Page Views
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            {isLoadingAnalytics ? (
              <div className="flex items-center justify-center h-full">
                <Skeleton className="h-full w-full" />
              </div>
            ) : analyticsData?.visitsPerPage ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={preparePageViewsData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="page" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="views" name="Views" fill="hsl(var(--chart-2))" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                No analytics data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Content Distribution Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Content Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <Skeleton className="h-full w-full" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={preparePieChartData()}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={(entry) => entry.name}
                  />
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Visits */}
      <Card>
        <CardHeader className="flex flex-row items-center">
          <CardTitle className="text-lg font-semibold">Recent Page Visits</CardTitle>
          <Eye className="h-5 w-5 text-muted-foreground ml-2" />
        </CardHeader>
        <CardContent>
          {isLoadingAnalytics ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, index) => (
                <Skeleton key={index} className="h-8 w-full" />
              ))}
            </div>
          ) : analyticsData?.recentVisits && analyticsData.recentVisits.length > 0 ? (
            <div className="space-y-1">
              {analyticsData.recentVisits.slice(0, 5).map((visit, index) => (
                <div
                  key={visit.id}
                  className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                >
                  <div className="flex items-center">
                    <div className="bg-secondary/20 text-secondary rounded-full w-8 h-8 flex items-center justify-center mr-3">
                      {index + 1}
                    </div>
                    <span className="font-medium">{visit.pageVisited}</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(visit.timestamp).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              No recent visits data available
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;
