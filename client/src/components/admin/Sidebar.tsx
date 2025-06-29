import React, { useState } from "react";
import { useLocation, Link } from "wouter";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  ShoppingCart,
  FileText,
  Image,
  PhoneCall,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  ChevronUp,
  Building2,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

const SidebarLink: React.FC<{
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
}> = ({ href, icon, children, onClick }) => {
  const [location] = useLocation();
  const isActive = location === href;

  return (
    <Link 
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
        isActive
          ? "bg-sidebar-accent text-sidebar-accent-foreground"
          : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
      )}
      onClick={onClick}
    >
      {icon}
      <span>{children}</span>
    </Link>
  );
};

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Create avatar initials from username
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      {/* Mobile menu button */}
      {isMobile && (
        <div className="fixed top-4 left-4 z-50">
          <Button
            variant="outline"
            size="icon"
            className="bg-white shadow-md"
            onClick={toggleSidebar}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "bg-sidebar border-r border-sidebar-border h-screen flex flex-col transition-all duration-300 z-40",
          isMobile
            ? isOpen
              ? "fixed inset-y-0 left-0 w-64"
              : "fixed inset-y-0 -left-64 w-64"
            : "w-64 sticky top-0"
        )}
      >
        {/* Mobile close button */}
        {isMobile && isOpen && (
          <div className="absolute top-4 right-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
            >
              <X className="h-5 w-5 text-sidebar-foreground" />
            </Button>
          </div>
        )}

        {/* Sidebar header */}
        <div className="p-6 border-b border-sidebar-border flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary flex items-center justify-center rounded-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white"
              >
                <path d="M12 2c.5 0 .9 0 1.4.1a4 4 0 0 1 3.5 3.5c.2 1 .1 2.2-.3 3.4a4 4 0 0 1 2.1 2.1c1.2-.4 2.3-.5 3.4-.3a4 4 0 0 1 3.5 3.5c.4 2.7-2.1 5.8-6.5 7.8-1.3.6-2.8 1-4.1 1.1-1.3.1-2.6 0-3.7-.4A4 4 0 0 1 9 21c-1.1.4-2.4.5-3.7.4-1.3-.1-2.8-.5-4.1-1.1-4.4-2-6.9-5.1-6.5-7.8a4 4 0 0 1 3.5-3.5c1.1-.2 2.3-.1 3.4.3a4 4 0 0 1 2.1-2.1c-.4-1.2-.5-2.3-.3-3.4a4 4 0 0 1 3.5-3.5c.5-.1.9-.1 1.4-.1Z" />
                <path d="M12 7c1.5 0 2.3.8 2.7 1.7" />
                <path d="M9.3 8.7c.4-.9 1.2-1.7 2.7-1.7" />
                <path d="M7.8 15.1c-1.1 0-2-.9-2-2 0-1.2.9-2 2-2h8.4c1.1 0 2 .9 2 2 0 1.1-.9 2-2 2" />
                <path d="M12 7v10" />
                <path d="M4.5 13a2.5 2.5 0 0 0 0-5" />
                <path d="M19.5 13a2.5 2.5 0 0 1 0-5" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-sidebar-foreground">
                National Fire
              </h1>
              <p className="text-xs text-sidebar-foreground/60">Admin Dashboard</p>
            </div>
          </div>

          <div className="relative">
            <div
              className="flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-sidebar-accent/10"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <Avatar>
                <AvatarFallback>
                  {user?.username ? getInitials(user.username) : "AD"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 overflow-hidden">
                <p className="font-medium text-sidebar-foreground truncate">
                  {user?.username || "Admin"}
                </p>
                <p className="text-xs text-sidebar-foreground/60 truncate">
                  {user?.email || "admin@example.com"}
                </p>
              </div>
              {showUserMenu ? (
                <ChevronUp className="h-4 w-4 text-sidebar-foreground/60" />
              ) : (
                <ChevronDown className="h-4 w-4 text-sidebar-foreground/60" />
              )}
            </div>

            {/* User dropdown menu */}
            {showUserMenu && (
              <div className="absolute left-0 right-0 mt-1 p-2 bg-sidebar-accent rounded-md shadow-lg border border-sidebar-border">
                <Link 
                  href="/admin/settings"
                  className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-sidebar-background text-sidebar-foreground"
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-red-100 text-red-600 mt-1"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar content */}
        <div className="flex-1 overflow-y-auto p-4">
          <nav className="flex flex-col gap-1">
            <SidebarLink
              href="/admin"
              icon={<LayoutDashboard className="h-5 w-5" />}
              onClick={() => isMobile && setIsOpen(false)}
            >
              Dashboard
            </SidebarLink>
            <SidebarLink
              href="/admin/products"
              icon={<ShoppingCart className="h-5 w-5" />}
              onClick={() => isMobile && setIsOpen(false)}
            >
              Products
            </SidebarLink>
            <SidebarLink
              href="/admin/brands"
              icon={<Building2 className="h-5 w-5" />}
              onClick={() => isMobile && setIsOpen(false)}
            >
              Brands
            </SidebarLink>
            <SidebarLink
              href="/admin/blogs"
              icon={<FileText className="h-5 w-5" />}
              onClick={() => isMobile && setIsOpen(false)}
            >
              Blogs
            </SidebarLink>
            <SidebarLink
              href="/admin/gallery"
              icon={<Image className="h-5 w-5" />}
              onClick={() => isMobile && setIsOpen(false)}
            >
              Gallery
            </SidebarLink>
            <SidebarLink
              href="/admin/portfolio"
              icon={<FileText className="h-5 w-5" />}
              onClick={() => isMobile && setIsOpen(false)}
            >
              Portfolio
            </SidebarLink>
            <SidebarLink
              href="/admin/customers"
              icon={<Users className="h-5 w-5" />}
              onClick={() => isMobile && setIsOpen(false)}
            >
              Customers
            </SidebarLink>
            <SidebarLink
              href="/admin/contact"
              icon={<PhoneCall className="h-5 w-5" />}
              onClick={() => isMobile && setIsOpen(false)}
            >
              Contact Info
            </SidebarLink>
            <SidebarLink
              href="/admin/settings"
              icon={<Settings className="h-5 w-5" />}
              onClick={() => isMobile && setIsOpen(false)}
            >
              Settings
            </SidebarLink>
          </nav>
        </div>

        {/* Sidebar footer */}
        <div className="p-4 border-t border-sidebar-border">
          <Button
            variant="destructive"
            className="w-full"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Backdrop overlay for mobile */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};

export default Sidebar;
