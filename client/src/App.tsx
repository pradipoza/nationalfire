import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { AuthProvider } from "@/context/AuthContext";
import { useEffect } from "react";

// Layouts
import MainLayout from "@/layouts/MainLayout";
import AdminLayout from "@/layouts/AdminLayout";

// Public Pages
import Home from "@/pages/home";
import ProductsPage from "@/pages/products/index";
import ProductDetail from "@/pages/products/[id]";
import BlogsPage from "@/pages/blogs/index";
import BlogDetail from "@/pages/blogs/[id]";
import GalleryPage from "@/pages/gallery";
import BrandsPage from "@/pages/brands/index";
import BrandProductsPage from "@/pages/brands/[id]";
import PortfolioPage from "@/pages/portfolio";
import PortfolioDetailPage from "@/pages/portfolio/[id]";
import AboutPage from "@/pages/about";
import ContactPage from "@/pages/contact";

// Admin Pages
import AdminLogin from "@/pages/admin/login";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminProducts from "@/pages/admin/products";
import AdminSubProducts from "@/pages/admin/sub-products";
import AdminBrands from "@/pages/admin/brands";
import AdminBlogs from "@/pages/admin/blogs";
import AdminGallery from "@/pages/admin/gallery";
import AdminPortfolio from "@/pages/admin/portfolio";
import AdminCustomers from "@/pages/admin/customers";
import AdminContact from "@/pages/admin/contact";
import AdminSettings from "@/pages/admin/settings";

function ScrollToTop() {
  const [location] = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  
  return null;
}

function Router() {
  return (
    <>
      <ScrollToTop />
      <Switch>
        {/* Public Routes */}
      <Route path="/">
        {() => (
          <MainLayout>
            <Home />
          </MainLayout>
        )}
      </Route>
      <Route path="/products">
        {() => (
          <MainLayout>
            <ProductsPage />
          </MainLayout>
        )}
      </Route>
      <Route path="/products/:id">
        {(params) => (
          <MainLayout>
            <ProductDetail id={params.id} />
          </MainLayout>
        )}
      </Route>
      <Route path="/blogs">
        {() => (
          <MainLayout>
            <BlogsPage />
          </MainLayout>
        )}
      </Route>
      <Route path="/blogs/:id">
        {(params) => (
          <MainLayout>
            <BlogDetail id={params.id} />
          </MainLayout>
        )}
      </Route>
      <Route path="/gallery">
        {() => (
          <MainLayout>
            <GalleryPage />
          </MainLayout>
        )}
      </Route>
      <Route path="/brands">
        {() => (
          <MainLayout>
            <BrandsPage />
          </MainLayout>
        )}
      </Route>
      <Route path="/brands/:id">
        {(params) => (
          <MainLayout>
            <BrandProductsPage id={params.id} />
          </MainLayout>
        )}
      </Route>
      <Route path="/about">
        {() => (
          <MainLayout>
            <AboutPage />
          </MainLayout>
        )}
      </Route>
      <Route path="/portfolio">
        {() => (
          <MainLayout>
            <PortfolioPage />
          </MainLayout>
        )}
      </Route>
      <Route path="/portfolio/:id">
        {(params) => (
          <MainLayout>
            <PortfolioDetailPage />
          </MainLayout>
        )}
      </Route>
      <Route path="/contact">
        {() => (
          <MainLayout>
            <ContactPage />
          </MainLayout>
        )}
      </Route>
      
      {/* Admin Routes */}
      <Route path="/admin/login">
        <AdminLogin />
      </Route>
      <Route path="/admin">
        {() => (
          <AdminLayout>
            <AdminDashboard />
          </AdminLayout>
        )}
      </Route>
      <Route path="/admin/products">
        {() => (
          <AdminLayout>
            <AdminProducts />
          </AdminLayout>
        )}
      </Route>
      <Route path="/admin/sub-products">
        {() => (
          <AdminLayout>
            <AdminSubProducts />
          </AdminLayout>
        )}
      </Route>
      <Route path="/admin/brands">
        <AdminLayout>
          <AdminBrands />
        </AdminLayout>
      </Route>
      <Route path="/admin/blogs">
        {() => (
          <AdminLayout>
            <AdminBlogs />
          </AdminLayout>
        )}
      </Route>
      <Route path="/admin/gallery">
        {() => (
          <AdminLayout>
            <AdminGallery />
          </AdminLayout>
        )}
      </Route>
      <Route path="/admin/portfolio">
        {() => (
          <AdminLayout>
            <AdminPortfolio />
          </AdminLayout>
        )}
      </Route>
      <Route path="/admin/customers">
        {() => (
          <AdminLayout>
            <AdminCustomers />
          </AdminLayout>
        )}
      </Route>
      <Route path="/admin/contact">
        {() => (
          <AdminLayout>
            <AdminContact />
          </AdminLayout>
        )}
      </Route>
      <Route path="/admin/settings">
        {() => (
          <AdminLayout>
            <AdminSettings />
          </AdminLayout>
        )}
      </Route>
      
      {/* Fallback to 404 */}
      <Route>
        <NotFound />
      </Route>
      </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
