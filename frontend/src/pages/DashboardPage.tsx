import React, { useState } from "react";
import { FaUserFriends, FaFileAlt, FaInbox } from "react-icons/fa";
import { MdEdit, MdDelete } from "react-icons/md";
import SummaryCard from "@/components/custom/moleculs/CustomCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import DetailMitraPage from "./DetailMitraPage";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
}

interface User {
  id: number;
  name: string;
  email: string;
  status: string;
}

// Sample Data for Mitra
const dataMitra: Mitra[] = [
  {
    id: 1,
    nama: "PT. Bangun Negeri Selalu",
    alamat: "Jl. Telekomunikasi No. 1, Dayeuhkolot",
    telepon: "(022) 555-1234",
    contracts: [{ id: 1, description: "Peremajaan Lobby Gedung ADHJ", code: "123/AB-234/XZM-10" }],
    users: [{ id: 1, name: "Budi Tromol", email: "buditromol@gmail.com", status: "active" }],
  },
  {
    id: 2,
    nama: "PT. Jaya Abadi Selamanya",
    alamat: "Jl. Nanas No. 19, Mataram",
    telepon: "(022) 789-5678",
    contracts: [{ id: 1, description: "Peremajaan Lobby Gedung ADHJ", code: "123/AB-234/XZM-10" }],
    users: [{ id: 1, name: "Andi Sujadi", email: "andisujadi@gmail.com", status: "active" }],
  },
];

const DashboardPage = () => {
  const [selectedMitra, setSelectedMitra] = useState<Mitra | null>(null); // Untuk navigasi detail mitra
  const [mitraToEdit, setMitraToEdit] = useState<Mitra | null>(null); // Untuk dialog edit mitra
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleMitraClick = (mitra: Mitra) => {
    setSelectedMitra(mitra); // Navigasi ke DetailMitraPage
  };

  const handleBackToDashboard = () => {
    setSelectedMitra(null);
  };

  const handleEditClick = (e: React.MouseEvent, mitra: Mitra) => {
    e.stopPropagation();
    setMitraToEdit(mitra); // Atur mitra yang akan diedit
    setIsDialogOpen(true); // Buka dialog
  };

  const handleDelete = (e: React.MouseEvent, mitra: Mitra) => {
    e.stopPropagation();
    console.log("Data dihapus:", mitra);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Data disimpan:", mitraToEdit);
    setIsDialogOpen(false);
    setMitraToEdit(null); // Reset setelah menyimpan
  };

  return (
    <div className="py-8 lg:p-8">
      {!selectedMitra && <h1 className="text-2xl font-semibold text-black mb-6">Dashboard</h1>}

      {!selectedMitra ? (
        <>
          <div className="grid grid-cols-3 gap-6 mb-6">
            <SummaryCard title="Total Mitra" value="9" icon={<FaUserFriends className="text-white text-4xl" />} bgColor="bg-blue-500" />
            <SummaryCard title="Total Laporan" value="27" icon={<FaFileAlt className="text-white text-4xl" />} bgColor="bg-red-500" />
            <SummaryCard title="Total Pesan Masuk" value="5" icon={<FaInbox className="text-white text-4xl" />} bgColor="bg-green-500" />
          </div>

          <div className="w-full flex justify-end mb-2 ">
            <div>
              <Button asChild>
                <Link to="/dashboard/tambahmitra">Tambah Mitra</Link>
              </Button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border ">
            <h2 className="text-xl font-semibold text-gray-700">Daftar Mitra</h2>
            <table className="w-full border-collapse mt-4">
              <thead>
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
                    <td className="p-3 text-sm font-normal text-gray-600" onClick={() => handleMitraClick(mitra)}>
                      {mitra.nama}
                    </td>
                    <td className="p-3 text-sm font-normal text-gray-600">{mitra.alamat}</td>
                    <td className="p-3 text-sm font-normal text-gray-600">{mitra.telepon}</td>
                    <td className="p-3 text-sm font-normal text-gray-600">
                      <div className="flex gap-x-2">
                        <button
                          onClick={(e) => handleEditClick(e, mitra)}
                          className="flex justify-center items-center p-1.5 cursor-pointer rounded-full hover:bg-gray-50"
                        >
                          <MdEdit color="blue" size={18} />
                        </button>
                        <button
                          onClick={(e) => handleDelete(e, mitra)}
                          className="flex justify-center items-center p-1.5 cursor-pointer rounded-full hover:bg-gray-50"
                        >
                          <MdDelete color="red" size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <DetailMitraPage mitra={selectedMitra} onBack={handleBackToDashboard} />
      )}

      {/* Dialog Edit Mitra */}
      {isDialogOpen && mitraToEdit && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Informasi Mitra</DialogTitle>
            </DialogHeader>
            <DialogDescription>
              <form onSubmit={handleSave}>
                <div className="grid grid-cols-2 gap-4 py-4">
                  <div>
                    <label className="block text-sm font-medium">Nama Perusahaan</label>
                    <input
                      type="text"
                      value={mitraToEdit.nama}
                      onChange={(e) => setMitraToEdit({ ...mitraToEdit, nama: e.target.value })}
                      className="mt-1 p-2 w-full border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Alamat Perusahaan</label>
                    <input
                      type="text"
                      value={mitraToEdit.alamat}
                      onChange={(e) => setMitraToEdit({ ...mitraToEdit, alamat: e.target.value })}
                      className="mt-1 p-2 w-full border rounded"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium">Nomor Telepon</label>
                    <input
                      type="text"
                      value={mitraToEdit.telepon}
                      onChange={(e) => setMitraToEdit({ ...mitraToEdit, telepon: e.target.value })}
                      className="mt-1 p-2 w-full border rounded"
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setIsDialogOpen(false)}
                    className="w-1/2 py-2 border rounded text-gray-700"
                  >
                    Batal
                  </button>
                  <button type="submit" className="w-1/2 py-2 bg-red-500 text-white rounded">
                    Simpan
                  </button>
                </div>
              </form>
            </DialogDescription>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default DashboardPage;