import React, { useState } from "react";
import { FaUserFriends, FaFileAlt, FaInbox, FaEdit, FaBan, FaPlus, FaTimes } from "react-icons/fa";
import { MdEdit,MdDelete  } from "react-icons/md";

// Type Definitions
interface Mitra {
  id: number;
  nama: string;
  alamat: string;
  telepon: string;
  contracts?: Contract[];
  users?: User[];
}

interface Contract {
  id: number;
  description?: string;
  code?: string;
  nilai?: string;
  tanggal?: string;
  jangkaWaktu?: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  status: string; // "active" or "blocked"
}

// Sample Data for Mitra
const dataMitra: Mitra[] = [
  {
    id: 1,
    nama: "PT. Bangun Negeri Selalu",
    alamat: "Jl. Telekomunikasi No. 1, Dayeuhkolot",
    telepon: "(022) 555-1234",
    contracts: [{ id: 1, description: "Peremajaan Lobby Gedung ADHJ", code: "123/AB-234/XZM-10" }],
    users: [{ id: 1, name: "Budi Tromol", email: "buditromol@bangunnegeriselalu.co.id", status: "active" }],
  },
  {
    id: 2,
    nama: "PT. Bangun Negeri Selalu",
    alamat: "Jl. Telekomunikasi No. 1, Dayeuhkolot",
    telepon: "(022) 555-1234",
    contracts: [{ id: 1, description: "Peremajaan Lobby Gedung ADHJ", code: "123/AB-234/XZM-10" }],
    users: [{ id: 1, name: "Budi Tromol", email: "buditromol@bangunnegeriselalu.co.id", status: "active" }],
  },
  {
    id: 3,
    nama: "PT. Bangun Negeri Selalu",
    alamat: "Jl. Telekomunikasi No. 1, Dayeuhkolot",
    telepon: "(022) 555-1234",
    contracts: [{ id: 1, description: "Peremajaan Lobby Gedung ADHJ", code: "123/AB-234/XZM-10" }],
    users: [{ id: 1, name: "Budi Tromol", email: "buditromol@bangunnegeriselalu.co.id", status: "active" }],
  },
];

const DashboardPage = () => {
  const [selectedMitra, setSelectedMitra] = useState<Mitra | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailView, setIsDetailView] = useState(false);
  const [isContractDetailModalOpen, setIsContractDetailModalOpen] = useState(false);
  

  const handleMitraClick = (mitra: Mitra) => {
    setSelectedMitra(mitra);
    setIsDetailView(true);
    setIsEditModalOpen(false);
  };

  const handleEditClick = (mitra: Mitra) => {
    setSelectedMitra(mitra);
    setIsEditModalOpen(true);
    setIsDetailView(false);
  };

  const handleAddContractClick = () => {
    setIsContractDetailModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setIsContractDetailModalOpen(false);
  };

  const handleBackToDashboard = () => {
    setSelectedMitra(null);
    setIsDetailView(false);
  };

  return (
    <div className="py-8 lg:p-8">
      <h1 className="text-2xl font-semibold text-black mb-6">Dashboard</h1>

      {!selectedMitra || (!isDetailView && !isEditModalOpen) ? (
        <>
          <div className="grid grid-cols-3 gap-6 mb-6">
            <SummaryCard title="Total Mitra" value="9" icon={<FaUserFriends className="text-white text-4xl" />} bgColor="bg-blue-500" />
            <SummaryCard title="Total Laporan" value="27" icon={<FaFileAlt className="text-white text-4xl" />} bgColor="bg-red-500" />
            <SummaryCard title="Total Pesan Masuk" value="5" icon={<FaInbox className="text-white text-4xl" />} bgColor="bg-green-500" />
          </div>



          <div className="bg-white p-6 rounded-lg border ">
            <h2 className="text-xl font-semibold text-gray-700">Daftar Mitra</h2>
            <table className="w-full border-collapse mt-4">
              <thead className="bg-slate-200">
                <tr className="text-left bg-slate-200">
                  <th className="p-3 font-medium border-b-2">No</th>
                  <th className="p-3 font-medium border-b-2">Nama Mitra</th>
                  <th className="p-3 font-medium border-b-2">Alamat Mitra</th>
                  <th className="p-3 font-medium border-b-2">Nomor Telepon</th>
                  <th className="p-3 font-medium border-b-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {dataMitra.map((mitra, index) => (
                  <tr key={mitra.id} className="border-b hover:bg-gray-50 duration-100 ease-in-out cursor-pointer">
                    <td className="p-3 text-sm font-normal text-gray-600">{index + 1}</td>
                    <td className="p-3 text-sm font-normal text-gray-600 " onClick={() => handleMitraClick(mitra)}>
                      {mitra.nama}
                    </td>
                    <td className="p-3 text-sm font-normal text-gray-600">{mitra.alamat}</td>
                    <td className="p-3 text-sm font-normal text-gray-600">{mitra.telepon}</td>
                    <td className="p-3 text-sm font-normal text-gray-600">
                      <div className="flex gap-x-2" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-center items-center p-1.5  cursor-pointer rounded-full hover:bg-gray-200">
                          <MdEdit color="blue" size={18} className=" " onClick={() => handleEditClick(mitra)} />
                        </div>
                        <div className="flex justify-center items-center p-1.5  cursor-pointer rounded-full hover:bg-gray-200">
                          <MdDelete color="red" size={18} />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : isDetailView ? (
        <MitraDetail mitra={selectedMitra} onAddContract={handleAddContractClick} onBack={handleBackToDashboard} />
      ) : null}

      {isEditModalOpen && selectedMitra && (
        <EditModal mitra={selectedMitra} onClose={handleCloseModal} />
      )}

      {isContractDetailModalOpen && (
        <ContractDetailModal onClose={handleCloseModal} />
      )}
    </div>
  );
};

// Summary Card Component
const SummaryCard: React.FC<{ title: string; value: string; icon: React.ReactNode; bgColor: string }> = ({ title, value, icon, bgColor }) => (
  <div className={`p-4 rounded-lg shadow-md text-white ${bgColor}`}>
    <div className="flex items-center">
      {icon}
      <div className="ml-4">
        <p className="text-lg font-semibold">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  </div>
);

// Detail View Component
const MitraDetail: React.FC<{ mitra: Mitra; onAddContract: () => void; onBack: () => void }> = ({ mitra, onAddContract, onBack }) => (
  <div className="p-6">
    <button onClick={onBack} className="mb-4 bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300">
      &larr; Back to Dashboard
    </button>
    <h2 className="text-2xl font-semibold mb-4">Detail Mitra {mitra.nama}</h2>
    
    {/* Container for Daftar Kontrak Kerja and Pengguna Mitra */}
    <div className="grid grid-cols-2 gap-6">
      
      {/* Daftar Kontrak Kerja Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-black">Daftar Kontrak Kerja</h3>
          <button className="flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full hover:bg-blue-200" onClick={onAddContract}>
            <span>Tambah Kontrak</span>
            <FaPlus />
          </button>
        </div>
        <table className="w-full">
          <thead>
            <tr className="text-left bg-blue-200">
              <th className="p-3">Kontrak Kerja</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {mitra.contracts?.map((contract) => (
              <tr key={contract.id} className="border-b">
                <td className="p-3">
                  <div className="flex items-center">
                    <FaFileAlt className="text-blue-500 mr-2" />
                    <div>
                      <p>{contract.description}</p>
                      <p className="text-sm text-gray-500">{contract.code}</p>
                    </div>
                  </div>
                </td>
                <td className="p-3">
                  <div className="flex space-x-2">
                    <FaEdit className="text-blue-600 cursor-pointer" />
                    <FaBan className="text-red-600 cursor-pointer" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pengguna Mitra Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-black">Daftar Pengguna Mitra</h3>
          <button className="flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full hover:bg-blue-200">
            <span>Tambah Pengguna</span>
            <FaPlus />
          </button>
        </div>
        <table className="w-full">
          <thead>
            <tr className="text-left bg-blue-200">
              <th className="p-3">Pengguna Mitra</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {mitra.users?.map((user) => (
              <tr key={user.id} className="border-b">
                <td className="p-3">
                  <div className="flex items-center">
                    <FaUserFriends className="text-blue-500 mr-2" />
                    <div>
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    <span className={`ml-2 text-sm ${user.status === 'active' ? 'text-green-500' : 'text-red-500'}`}>
                      {user.status === 'active' ? '•' : '•'}
                    </span>
                  </div>
                </td>
                <td className="p-3">
                  <div className="flex space-x-2">
                    <FaEdit className="text-blue-600 cursor-pointer" />
                    <FaBan className="text-red-600 cursor-pointer" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  </div>
);

// Edit Modal Component
const EditModal: React.FC<{ mitra: Mitra; onClose: () => void }> = ({ mitra, onClose }) => {
  const [nama, setNama] = useState(mitra.nama);
  const [alamat, setAlamat] = useState(mitra.alamat);
  const [telepon, setTelepon] = useState(mitra.telepon);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-md z-10">
        <h2 className="text-2xl font-semibold mb-4">Edit Informasi Mitra</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Nama Perusahaan</label>
          <input
            type="text"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            className="mt-1 p-2 w-full border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Alamat Perusahaan</label>
          <input
            type="text"
            value={alamat}
            onChange={(e) => setAlamat(e.target.value)}
            className="mt-1 p-2 w-full border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Nomor Telepon</label>
          <input
            type="text"
            value={telepon}
            onChange={(e) => setTelepon(e.target.value)}
            className="mt-1 p-2 w-full border rounded"
          />
        </div>
        <div className="flex space-x-4">
          <button onClick={onClose} className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 w-full">Batal</button>
          <button onClick={onClose} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full">Simpan Perubahan</button>
        </div>
      </div>
    </div>
  );
};

// Contract Detail Modal Component
const ContractDetailModal: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
    <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl z-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-blue-700">Detail Kontrak</h2>
        <FaTimes className="text-gray-500 cursor-pointer" onClick={onClose} />
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nama Kontrak</label>
          <input type="text" placeholder="Ketik di sini" className="w-full border p-2 rounded mt-1" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Nomor Kontrak</label>
          <input type="text" placeholder="Ketik di sini" className="w-full border p-2 rounded mt-1" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Nilai Kontrak</label>
          <input type="text" placeholder="Ketik di sini" className="w-full border p-2 rounded mt-1" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Tanggal Kontrak</label>
          <input type="text" placeholder="DD/MM/YYYY" className="w-full border p-2 rounded mt-1" />
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700">Jangka Waktu</label>
          <input type="text" placeholder="Ketik di sini" className="w-full border p-2 rounded mt-1" />
        </div>
      </div>

      <div className="flex justify-end mb-4">
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm flex items-center">
          Tambah Pekerjaan <FaPlus className="ml-2" />
        </button>
      </div>

      <div className="flex items-center bg-blue-200 px-4 py-2 rounded mb-4">
        <span className="font-semibold text-blue-700">Pekerjaan</span>
        <span className="font-semibold text-blue-700 ml-auto">Lokasi</span>
      </div>

      <div className="text-center text-gray-500 mb-6">
        Belum ada pekerjaan yang ditambah
      </div>

      <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700" onClick={onClose}>
        Simpan
      </button>
    </div>
  </div>
);

export default DashboardPage;