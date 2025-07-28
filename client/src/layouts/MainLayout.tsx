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
    <div className="min-h-screen flex flex-col">
      {/* Fixed Navbar - top, left, right */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>
      
      {/* Main content with horizontal scroll and zoom capability */}
      <main className="pt-16 flex-grow overflow-x-auto overflow-y-auto">
        <div className="min-w-full" style={{ minWidth: '100vw' }}>
          {children}
        </div>
      </main>
      
      {/* Footer - fixed width but normal flow (not fixed to bottom) */}
      <div className="w-full">
        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;
