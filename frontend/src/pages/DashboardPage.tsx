import React, { useState } from "react";
import { FaUserFriends, FaFileAlt, FaInbox } from "react-icons/fa";
import SummaryCard from "@/components/custom/moleculs/CustomCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import DetailMitraPage from "./DetailMitraPage";
import {z} from "zod";
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EditIcon, TrashIcon } from "lucide-react";

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

const formEditMitraSchema = z.object({
  namaPerusahaan: z.string().min(1, "Nama perusahaan wajib diisi").max(3, "Nama perusahaan terlalu panjang"),
  alamatPerusahaan: z.string().min(1, "Alamat perusahaan wajib diisi").max(3, "Alamat perusahaan terlalu panjang"),
  nomorTelpPerusahaan: z.string().min(1, "Nomor telepon perusahaan wajib diisi").max(20, "Nomor telepon perusahaan terlalu panjang"),
})
export type EditMitraSchema = z.infer<typeof formEditMitraSchema>

const DashboardPage = () => {
  const [selectedMitra, setSelectedMitra] = useState<Mitra | null>(null); // Untuk navigasi detail mitra
  const [mitraToEdit, setMitraToEdit] = useState<Mitra | null>(null); // Untuk dialog edit mitra
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleMitraClick = (mitra: Mitra) => {
    setSelectedMitra(mitra); // Navigasi ke DetailMitraPage
  };

  const formEditMitra = useForm<EditMitraSchema>({
    resolver: zodResolver(formEditMitraSchema)
  })

  const handleBackToDashboard = () => {
    setSelectedMitra(null);
  };

  const handleEditClick = (e: React.MouseEvent, mitra: Mitra) => {
    e.stopPropagation();
    setMitraToEdit(mitra); // Atur mitra yang akan diedit
    setIsDialogOpen(true); // Buka dialog
  };

  const handleditSubmit = () => {

  };

  const handleDelete = (e: React.MouseEvent, mitra: Mitra) => {
    e.stopPropagation();
    console.log("Data dihapus:", mitra);
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
                <Link to="/daftarmitra/tambahmitra">Tambah Mitra</Link>
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
                  <tr key={mitra.id} onClick={() => handleMitraClick(mitra)} aria-label="mitra list" className="border-b hover:bg-gray-50 duration-100 ease-in-out cursor-pointer">
                    <td className="p-3 text-sm font-normal text-gray-600">{index + 1}</td>
                    <td className="p-3 text-sm font-normal text-gray-600" >
                      {mitra.nama}
                    </td>
                    <td className="p-3 text-sm font-normal text-gray-600">{mitra.alamat}</td>
                    <td className="p-3 text-sm font-normal text-gray-600">{mitra.telepon}</td>
                    <td className="p-3 text-sm font-normal text-gray-600">
                      <div className="flex gap-x-2">
                        <button
                          onClick={(e) => handleEditClick(e, mitra)}
                          className="flex justify-center items-center p-1.5 cursor-pointer rounded-full hover:bg-gray-200"
                        >
                          <EditIcon color="blue" size={18} />
                        </button>
                        <button
                          onClick={(e) => handleDelete(e, mitra)}
                          className="flex justify-center items-center p-1.5 cursor-pointer rounded-full hover:bg-gray-200"
                        >
                          <TrashIcon color="red" size={18} />
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
              <Form {...formEditMitra}>
                  <form 
                    onSubmit={formEditMitra.handleSubmit(handleditSubmit)}
                    className="space-y-3"
                  >
                    <FormField
                      control={formEditMitra.control}
                      name='namaPerusahaan'
                      render={({field}) => (
                        <FormItem>
                          <FormLabel>Nama Perusahaan</FormLabel>
                          <FormControl className="relative top-[-4px] mb-7">
                            <Input 
                              type="text"  {...field} 
                              defaultValue={mitraToEdit?.nama} 
                              disabled/>
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={formEditMitra.control}
                      name='alamatPerusahaan'
                      render={({field}) => (
                        <FormItem>
                          <FormLabel>Alamat Perusahaan</FormLabel>
                          <FormControl className="relative top-[-4px] mb-7">
                            <Input
                              type="text"  {...field} 
                              defaultValue={mitraToEdit?.alamat} 
                              required/>
                          </FormControl>
                          <FormMessage/>
                        </FormItem>
                      )}
                    />

                      <FormField
                        control={formEditMitra.control}
                        name='nomorTelpPerusahaan'
                        render={({field}) => (
                          <FormItem>
                            <FormLabel>Nomor Telephone Perusahaan</FormLabel>
                            <FormControl className="relative top-[-4px] mb-7">
                            <Input
                              type="text"  {...field} 
                              defaultValue={mitraToEdit?.telepon} 
                              required/>
                            </FormControl>
                            <FormMessage/>
                          </FormItem>
                        )}
                      />

                        <Button type="submit"> Edit</Button>
                  </form>
              </Form>
            </DialogDescription>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default DashboardPage;