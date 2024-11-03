// src/pages/Layout.tsx
import Sidebar from '@/components/Sidebar';
import React, { useState } from 'react';

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  // Buat state di Layout untuk mengontrol visibilitas sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className={`transition-all duration-300 ${isSidebarOpen ? ' md:w-[300px]' : 'w-[80px]'}`}>
        <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      </div>
      {/* Main Content */}
      <div className="flex-grow py-7 px-5 overflow-auto ml-4">
        {children}
      </div>
    </div>
  );
}
