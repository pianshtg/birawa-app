import Sidebar from "@/components/Sidebar";
import React, { useState, useEffect } from "react";

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  // State for controlling sidebar visibility
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Set the initial state of the sidebar based on screen width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false); // Open sidebar if screen width is less than 1024px
      } else {
        setIsSidebarOpen(true); // Close sidebar if screen width is 1024px or greater
      }
    };

    handleResize(); // Initialize on component mount
    window.addEventListener("resize", handleResize); // Listen for resize events

    return () => {
      window.removeEventListener("resize", handleResize); // Cleanup listener on unmount
    };
  }, []);

  return (
    <div className="grid grid-cols-[auto,1fr] h-screen">
      {/* Sidebar */}
      <div
        className={`transition-all duration-300 ${
          isSidebarOpen ? "md:w-[300px]" : "w-[80px]"
        }`}
      >
        <Sidebar
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        />
      </div>

      {/* Main Content */}
      <div className="flex-grow py-7 px-10 overflow-auto bg-content h-[100dvh]">
        {children}
      </div>
    </div>
  );
}
