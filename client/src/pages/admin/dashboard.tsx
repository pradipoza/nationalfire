import React from "react";
import DashboardStats from "@/components/admin/DashboardStats";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BellRing, Info } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Welcome back, {user?.username || "Admin"}</h1>
          <p className="text-gray-500">Here's what's happening with your website today.</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Badge variant="outline" className="text-sm bg-green-50 text-green-700 border-green-200">
            Last updated: {new Date().toLocaleString()}
          </Badge>
        </div>
      </div>

      <Alert className="mb-6">
        <Info className="h-4 w-4" />
        <AlertTitle>Quick tip</AlertTitle>
        <AlertDescription>
          Use the navigation menu on the left to manage your website content. All changes will be immediately reflected on your site.
        </AlertDescription>
      </Alert>

      <DashboardStats />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Recent Updates</CardTitle>
            <CardDescription>Latest changes to your website</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-4 items-start">
                <div className="rounded-full p-2 bg-blue-100 text-blue-600">
                  <BellRing className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium">New product management features</p>
                  <p className="text-sm text-gray-500">You can now upload multiple images for each product and arrange them in your preferred order.</p>
                </div>
              </div>
              
              <div className="flex gap-4 items-start">
                <div className="rounded-full p-2 bg-green-100 text-green-600">
                  <BellRing className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium">Blog editor improvements</p>
                  <p className="text-sm text-gray-500">Better photo placement options in blog posts - choose between top, middle, and bottom positions.</p>
                </div>
              </div>
              
              <div className="flex gap-4 items-start">
                <div className="rounded-full p-2 bg-amber-100 text-amber-600">
                  <BellRing className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium">Analytics dashboard updates</p>
                  <p className="text-sm text-gray-500">View detailed statistics about your visitors and the most popular pages on your website.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks for website management</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                className="h-24 flex flex-col items-center justify-center space-y-2"
                onClick={() => navigate('/admin/products')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14"/>
                  <path d="M12 5v14"/>
                </svg>
                <span>Add New Product</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-24 flex flex-col items-center justify-center space-y-2"
                onClick={() => navigate('/admin/blogs')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20h9"/>
                  <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>
                </svg>
                <span>Create New Blog</span>
              </Button>
              
              <Button variant="outline" className="h-24 flex flex-col items-center justify-center space-y-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
                  <circle cx="12" cy="13" r="3"/>
                </svg>
                <span>Upload Gallery Image</span>
              </Button>
              
              <Button variant="outline" className="h-24 flex flex-col items-center justify-center space-y-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"/>
                  <path d="M21 9V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2"/>
                </svg>
                <span>View Inquiries</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
