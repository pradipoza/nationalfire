import React from "react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import ZoomControls from "@/components/ui/ZoomControls";
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
      
      {/* Main content with horizontal scroll and zoom */}
      <main 
        id="main-content" 
        className="pt-16 flex-grow overflow-x-auto overflow-y-auto zoom-container"
      >
        <div className="min-w-fit w-full zoom-content">
          {children}
        </div>
      </main>
      
      {/* Footer - fixed width but normal flow (not fixed to bottom) */}
      <div className="w-full">
        <Footer />
      </div>
      
      {/* Zoom Controls */}
      <ZoomControls />
    </div>
  );
};

export default MainLayout;
