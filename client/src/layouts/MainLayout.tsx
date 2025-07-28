import React from "react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/lib/config";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  // Track page visit for analytics
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '/';
  
  return (
    <div className="min-h-screen">
      {/* Fixed Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>
      
      {/* Main content with proper spacing */}
      <main className="pt-16 pb-96 min-h-screen overflow-x-hidden">
        {children}
      </main>
      
      {/* Fixed Footer */}
      <div className="fixed bottom-0 left-0 right-0 z-40">
        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;
