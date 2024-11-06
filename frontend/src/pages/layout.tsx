import Sidebar from '@/components/Sidebar';
import React, { useState, useEffect } from 'react';

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  // State untuk mengontrol visibilitas sidebar dan deteksi ukuran layar
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Menggunakan useEffect untuk mendeteksi apakah layar adalah mobile (<= 520px)
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 520);
    };

    handleResize(); // Periksa ukuran layar saat pertama kali dimuat

    // Tambahkan event listener untuk update ukuran layar saat diubah
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isMobile) {
    // Tampilan khusus untuk mobile
    return (
      <div className="flex items-center justify-center h-screen bg-blue-200">
        <h1 className="text-xl font-bold">Halaman ini hanya untuk tampilan mobile.</h1>
        <p>Silakan akses dari perangkat dengan layar lebih besar untuk pengalaman lengkap.</p>
      </div>
    );
  }

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
