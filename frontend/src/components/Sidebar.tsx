import React from "react";

export default function Sidebar() {
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);

  const menuItems = [
    { label: "Mitra Kerja", icon: "/mitra.svg" },
    { label: "Project Mitra", icon: "/mitra.svg" },
    { label: "Buat Laporan", icon: "/mitra.svg" },
    { label: "Cek Laporan", icon: "/mitra.svg" },
    { label: "Kotak Masuk", icon: "/mitra.svg" }
  ];

  return (
    <div className="h-[100dvh] border-2 w-[300px] p-8 shadow shadow-gray-100 flex flex-col items-center gap-16">
      {/* Atas */}
      <div>
        <a href="/" className="text-2xl">Logo</a>
      </div>

      {/* Navigation menu */}
      <nav className="w-full ">
        <ul className="w-full text-primary space-y-4">
          {menuItems.map((item, index) => (
            <li
              key={index}
              className={`w-full rounded py-3 px-2  font-medium cursor-pointer ${
                activeIndex === index ? 'bg-opacitynav' : 'bg-transparent'
              }`}
              onClick={() => setActiveIndex(index)}
            >
              <a href="#" className="flex items-center gap-3">
                <img src={item.icon} alt="Mitra Logo" className="w-6 h-6" />
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
