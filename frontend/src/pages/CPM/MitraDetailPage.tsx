import React from "react";
import { FaFileAlt, FaUserFriends, FaPlus } from "react-icons/fa";
import { MdEdit, MdDelete } from "react-icons/md";
import { Mitra, Contract, User } from "./DashboardPage";

const MitraDetailPage: React.FC<{ mitra: Mitra }> = ({ mitra }) => {
  const handleAddContract = () => {
    // Add contract functionality
  };

  const handleBackToDashboard = () => {
    // Navigate back to dashboard
  };

  return (
    <div className="p-6">
      <button onClick={handleBackToDashboard} className="mb-4 bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300">
        &larr; Back to Dashboard
      </button>
      <h2 className="text-2xl font-semibold mb-4">Detail Mitra {mitra.nama}</h2>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-black">Daftar Kontrak Kerja</h3>
            <button className="flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full hover:bg-blue-200" onClick={handleAddContract}>
              <span>Tambah Kontrak</span>
              <FaPlus />
            </button>
          </div>
          {/* Contract table */}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-black">Daftar Pengguna Mitra</h3>
            <button className="flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full hover:bg-blue-200">
              <span>Tambah Pengguna</span>
              <FaPlus />
            </button>
          </div>
          {/* User table */}
        </div>
      </div>
    </div>
  );
};

export default MitraDetailPage;