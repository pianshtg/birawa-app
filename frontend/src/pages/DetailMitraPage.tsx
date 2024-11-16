import React, { useState } from "react";
import { FaFileAlt, FaPlus, FaUserFriends } from "react-icons/fa";
import { MdEdit, MdDelete } from "react-icons/md";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"; // Pastikan komponen ini tersedia
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
  nilaiKontrak?: number;
  tanggalKontrak?: string;
  jangkaWaktu?: number;
}

interface User {
  id: number;
  name: string;
  email: string;
  status: string; // "active" or "blocked"
}

const DetailMitraPage: React.FC<{ mitra: Mitra; onBack: () => void }> = ({ mitra, onBack }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false); // State untuk dialog tambah pengguna
  const [contracts, setContracts] = useState<Contract[]>(mitra.contracts || []);
  const [users, setUsers] = useState<User[]>(mitra.users || []);

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      namaKontrak: "",
      nomorKontrak: "",
      nilaiKontrak: "",
      tanggalKontrak: "",
      jangkaWaktu: "",
    },
  });

  const userForm = useForm({
    defaultValues: {
      namaPengguna: "",
      emailPengguna: "",
      statusPengguna: "active",
    },
  });

  const handleAddContract = (data: any) => {
    const newContract: Contract = {
      id: contracts.length + 1,
      description: data.namaKontrak,
      code: data.nomorKontrak,
      nilaiKontrak: Number(data.nilaiKontrak),
      tanggalKontrak: data.tanggalKontrak,
      jangkaWaktu: Number(data.jangkaWaktu),
    };

    setContracts([...contracts, newContract]);
    setIsDialogOpen(false);
    reset(); // Reset form setelah submit
  };

  const handleAddUser = (data: any) => {
    const newUser: User = {
      id: users.length + 1,
      name: data.namaPengguna,
      email: data.emailPengguna,
      status: data.statusPengguna,
    };

    setUsers([...users, newUser]);
    setIsUserDialogOpen(false);
    userForm.reset(); // Reset form setelah submit
  };

  return (
    <div className="p-6">
      <button
        onClick={onBack}
        className="mb-4 bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
      >
        &larr; Back to Dashboard
      </button>
      <h2 className="text-2xl font-semibold mb-4">Detail Mitra {mitra.nama}</h2>

      <div className="grid grid-cols-2 gap-6">
        {/* Daftar Kontrak Kerja */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-black">Daftar Kontrak Kerja</h3>
            <button
              onClick={() => setIsDialogOpen(true)}
              className="flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full hover:bg-blue-200"
            >
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
              {contracts.length ? (
                contracts.map((contract) => (
                  <tr key={contract.id} className="border-b">
                    <td className="p-3">
                      <div className="flex items-center">
                        <FaFileAlt className="text-blue-500 mr-2" />
                        <div>
                          <p>{contract.description}</p>
                          <p className="text-sm text-gray-500">Kode: {contract.code}</p>
                          <p className="text-sm text-gray-500">
                            Nilai: Rp {contract.nilaiKontrak?.toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-500">
                            Tanggal: {contract.tanggalKontrak}
                          </p>
                          <p className="text-sm text-gray-500">
                            Jangka Waktu: {contract.jangkaWaktu} bulan
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <button
                          className="flex justify-center items-center p-1.5 cursor-pointer rounded-full hover:bg-gray-50"
                        >
                          <MdEdit color="blue" size={18} />
                        </button>
                        <button
                          className="flex justify-center items-center p-1.5 cursor-pointer rounded-full hover:bg-gray-50"
                        >
                          <MdDelete color="red" size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={2} className="p-3 text-center text-gray-500">
                    Tidak ada kontrak kerja.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Daftar Pengguna Mitra */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-black">Daftar Pengguna Mitra</h3>
            <button
              onClick={() => setIsUserDialogOpen(true)}
              className="flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full hover:bg-blue-200"
            >
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
              {users.length ? (
                users.map((user) => (
                  <tr key={user.id} className="border-b">
                    <td className="p-3">
                      <div className="flex items-center">
                        <FaUserFriends className="text-blue-500 mr-2" />
                        <div>
                          <p className="font-semibold">{user.name}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                        <span
                          className={`ml-2 text-sm ${
                            user.status === "active" ? "text-green-500" : "text-red-500"
                          }`}
                        >
                          {user.status === "active" ? "Active" : "Blocked"}
                        </span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <button
                          className="flex justify-center items-center p-1.5 cursor-pointer rounded-full hover:bg-gray-50"
                        >
                          <MdEdit color="blue" size={18} />
                        </button>
                        <button
                          className="flex justify-center items-center p-1.5 cursor-pointer rounded-full hover:bg-gray-50"
                        >
                          <MdDelete color="red" size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={2} className="p-3 text-center text-gray-500">
                    Tidak ada pengguna mitra.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dialog Tambah Kontrak */}
      {isDialogOpen && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Kontrak</DialogTitle>
              <DialogDescription>Isi detail kontrak baru di bawah ini.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(handleAddContract)}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nama Kontrak</label>
                  <Input
                    type="text"
                    placeholder="Masukkan Nama Kontrak"
                    {...register("namaKontrak")}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Nomor Kontrak</label>
                  <Input
                    type="text"
                    placeholder="Masukkan Nomor Kontrak"
                    {...register("nomorKontrak")}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Nilai Kontrak</label>
                  <Input
                    type="number"
                    placeholder="Masukkan Nilai Kontrak"
                    {...register("nilaiKontrak")}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Tanggal Kontrak</label>
                  <Input type="date" {...register("tanggalKontrak")} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Jangka Waktu (bulan)</label>
                  <Input
                    type="number"
                    placeholder="Masukkan Jangka Waktu"
                    {...register("jangkaWaktu")}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-4 mt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Batal
                </Button>
                <Button type="submit" className="bg-red-500 text-white">
                  Simpan
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* Dialog Tambah Pengguna */}
      {isUserDialogOpen && (
        <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Pengguna</DialogTitle>
              <DialogDescription>Isi detail pengguna baru di bawah ini.</DialogDescription>
            </DialogHeader>
            <form onSubmit={userForm.handleSubmit(handleAddUser)}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nama Pengguna</label>
                  <Input
                    type="text"
                    placeholder="Masukkan Nama Pengguna"
                    {...userForm.register("namaPengguna")}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email Pengguna</label>
                  <Input
                    type="email"
                    placeholder="Masukkan Email Pengguna"
                    {...userForm.register("emailPengguna")}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Status Pengguna</label>
                  <select
                    className="w-full border rounded px-3 py-2"
                    {...userForm.register("statusPengguna")}
                  >
                    <option value="active">Active</option>
                    <option value="blocked">Blocked</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-4 mt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsUserDialogOpen(false)}
                >
                  Batal
                </Button>
                <Button type="submit" className="bg-red-500 text-white">
                  Simpan
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default DetailMitraPage;