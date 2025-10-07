"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { RiMenu5Fill } from "react-icons/ri";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import ProfileMobileSideBar from "./MobileSideBar";
import { authService } from "@/services/auth";
import { toastService } from "@/services/toast";

const profileRoutes = [
  { label: "Profile", path: "/profile", icon: "👤" },
  { label: "My Orders", path: "/profile/orders", icon: "📦" },
  { label: "My Wishlist", path: "/profile/wishlist", icon: "❤️" },
  { label: "Quiz Results", path: "/profile/quiz-results", icon: "📋" },
];

interface ProfileLayoutProps {
  children: React.ReactNode;
}

const LoadingProfile: React.FC = () => {
  return (
    <div className="flex justify-center items-center min-h-[50vh] bg-[#f7ede1]">
      <p className="text-xl text-gray-700">Loading your profile...</p>
    </div>
  );
};

export default function ProfileLayout({ children }: ProfileLayoutProps) {
  const [hoveredRoute, setHoveredRoute] = useState<string>();
  const [isSideBar, setIsSideBar] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Check if current route should be protected
  const isProtectedRoute = () => {
    // Allow access to order details page for email links
    if (pathname.match(/^\/profile\/orders\/[^\/]+$/)) {
      return false;
    }
    // All other profile routes are protected
    return pathname.startsWith('/profile');
  };

  // Route protection effect
  useEffect(() => {
    if (isProtectedRoute()) {
      const isRegisteredUser = authService.isAuthenticated() && authService.isRegistered();

      if (!isRegisteredUser) {
        toastService.error("Let's get you an account so you can begin managing your profile");
        // Redirect to signup page after a short delay
        setTimeout(() => {
          router.push('/auth/register');
        }, 2000);
        return;
      }
    }
  }, [pathname, router]);

  // Prevent rendering protected content for unauthorized users
  if (isProtectedRoute()) {
    const isRegisteredUser = authService.isAuthenticated() && authService.isRegistered();

    if (!isRegisteredUser) {
      return (
        <div className="min-h-screen bg-white flex flex-col">
          <AnnouncementBar message="The wait is over. Shop Prime & Premium perfumes—now in 8ml!" />
          <Navbar />
          <div className="flex justify-center items-center min-h-[50vh] bg-[#f7ede1]">
            <p className="text-xl text-gray-700">Redirecting you to create an account...</p>
          </div>
          <Footer />
        </div>
      );
    }
  }

  const onCloseSideBar = () => setIsSideBar(false);

  const onClickRoute = (path: string) => {
    if (path === pathname) return;
    
    setIsLoading(true);
    router.push(path);
    setIsSideBar(false);
  };

  useEffect(() => {
    setIsLoading(false);
  }, [pathname]);

  const getCurrentPageTitle = () => {
    // Handle order details pages
    if (pathname.startsWith('/profile/orders')) {
      return "My Orders";
    }
    const currentRoute = profileRoutes.find(route => route.path === pathname);
    return currentRoute?.label || "Profile";
  };

  const isRouteActive = (routePath: string) => {
    // Special handling for orders route to include order details pages
    if (routePath === '/profile/orders') {
      return pathname.startsWith('/profile/orders');
    }
    return pathname === routePath;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <AnnouncementBar message="The wait is over. Shop Prime & Premium perfumes—now in 8ml!" />
        <Navbar />
        <LoadingProfile />
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <AnnouncementBar message="The wait is over. Shop Prime & Premium perfumes—now in 8ml!" />
      <Navbar />
      
      <div className="bg-[#f7ede1] p-5 md:p-8 lg:p-12 flex flex-col gap-5 flex-grow">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between">
          <div className="flex items-center gap-3">
            <RiMenu5Fill
              className="text-[#8B0000] cursor-pointer text-xl"
              onClick={() => setIsSideBar(true)}
            />
            <h1 className="text-xl font-semibold text-black">{getCurrentPageTitle()}</h1>
          </div>
        </div>

        {/* Mobile Sidebar */}
        <ProfileMobileSideBar
          isOpen={isSideBar}
          onClose={onCloseSideBar}
          dirs={profileRoutes.map(route => route.label)}
          view={getCurrentPageTitle()}
          onClickView={(label) => {
            const route = profileRoutes.find(r => r.label === label);
            if (route) onClickRoute(route.path);
          }}
          hoveredDir={hoveredRoute}
          setHoveredDir={setHoveredRoute}
        />

        {/* Main Content */}
        <div className="flex items-start justify-between gap-8">
          {/* Desktop Sidebar */}
          <div className="hidden lg:flex flex-col gap-5 w-[20%]">
            <p className="text-xl lg:text-2xl text-black font-semibold">Hello {authService.getUser()?.firstName} 👋</p>
            <div className="flex flex-col gap-4">
              {profileRoutes.map((route, index) => (
                <div
                  className="flex items-center gap-3 cursor-pointer"
                  key={index}
                  onClick={() => onClickRoute(route.path)}
                  onMouseEnter={() => setHoveredRoute(route.path)}
                  onMouseLeave={() => setHoveredRoute(undefined)}
                >
                  <div
                    className={`h-7 ${
                      isRouteActive(route.path) || hoveredRoute === route.path
                        ? "opacity-100"
                        : "opacity-0"
                    } ease-in-out duration-500 border-2 rounded-full border-[#C8102E]`}
                  />
                  <p
                    className={`px-3 w-full py-2 text-black hover:bg-white ease-in-out ${
                      isRouteActive(route.path) ? "bg-white font-medium border border-gray-100" : ""
                    } duration-500 rounded-lg`}
                  >
                    {route.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className="flex flex-col gap-5 w-full lg:w-[75%] bg-white rounded-xl p-6 min-h-[500px]">
            {children}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}