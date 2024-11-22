import React, { useState, useMemo,useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Button } from '@/components/ui/button';
import { EditIcon, TrashIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {z} from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from '@/components/ui/input';

const formSchema = z.object({
  alamat_Mitra : z.string().min(2,"alamat Mitra terlalu kecil").max(32,"Alamat Mitra terlalu panjang"),
  nomor_Telephone_Mitra : z.string().min(4,"Nomor Telephone terlalu sedikit").max(16, "Nomor Telephone melebih batas"),
})

export type EditFormSchema = z.infer<typeof formSchema>;

const DaftarPekerjaan: React.FC = () => {
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(() => {
    // Ambil nilai awal dari localStorage atau gunakan default 1
    const savedItemsPerPage = localStorage.getItem('itemsPerPageMitra');
    return savedItemsPerPage ? parseInt(savedItemsPerPage, 10) : 1;
  });
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [selectedMitra, setSelectedMitra] = useState<any | null>(null);

  const [mitraData, setMitraData] = useState([
    { id: "P-001", name: "Pasang Plafon", location: "Batam Centrum", contract: "Pekerjaan MEP" },
    { id: "P-002", name: "Instalasi Listrik", location: "Jakarta Selatan", contract: "Pekerjaan Elektro" },
    { id: "P-003", name: "Pengecatan Dinding", location: "Surabaya Timur", contract: "Pekerjaan Interior" },
    { id: "P-004", name: "Pemasangan AC", location: "Bandung Kota", contract: "Pekerjaan HVAC" },
    { id: "P-005", name: "Perbaikan Pipa", location: "Medan Barat", contract: "Pekerjaan Plumbing" },
  ]);

  useEffect(() => {
    // Simpan itemsPerPage ke localStorage setiap kali berubah
    localStorage.setItem('itemsPerPageMitra', itemsPerPage.toString());
  }, [itemsPerPage]);

  const formEditMitra = useForm<EditFormSchema>({
    resolver:zodResolver(formSchema),
    defaultValues:{
      alamat_Mitra:"",
      nomor_Telephone_Mitra:""
    }
  })

   // Pagination logic
   const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return mitraData.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, itemsPerPage, mitraData]);

  const totalPages = Math.ceil(mitraData.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setSelectedRow(null); // Reset selection when changing pages
    }
  };
  const handleDelete = () => {
    if (selectedMitra) {
      setMitraData((prevData) => prevData.filter((mitra) => mitra.name !== selectedMitra.name));
      setIsDeleteDialogOpen(false);
      setSelectedMitra(null);
    }
  };


  const handleEditSubmit = (data: EditFormSchema) => {
    console.log(data);
    setIsEditDialogOpen(false); 
    setSelectedMitra(null);
  };
  
  return (
    <div className="py-8 lg:p-8 flex-1 min-h-screen">
      <h1 className="text-2xl font-semibold mb-6">Manajemen Mitra</h1>

      <div className="bg-white p-6 border rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Daftar Mitra</h2>

          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <label className="text-sm mr-2">Tampilkan</label>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1); // Reset to first page
                }}
                className="border border-gray-300 rounded px-2 py-1 text-sm mr-6"
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="5">5</option>
              </select>
            </div>

            <div className="w-full">
              <Button asChild>
                <Link to="/daftarmitra/tambahmitra">Tambah Mitra</Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm border-separate border-spacing-0">
            <thead className="bg-slate-200 text-left">
              <tr className="text-left bg-slate-200">
                <th className="p-4 font-medium border-b">No</th>
                <th className="p-4 font-medium border-b">Nama Mitra</th>
                <th className="p-4 font-medium border-b">Alamat Mitra</th>
                <th className="p-4 font-medium border-b">Nomor Telepon</th>
                <th className="p-4 font-medium border-b">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((job) => (
                <tr key={job.id} className="hover:bg-gray-50 cursor-pointer">
                  <td className="p-4 text-sm font-normal border-b">{job.id}</td>
                  <td className="p-4 text-sm font-normal border-b">{job.name}</td>
                  <td className="p-4 text-sm font-normal border-b">{job.location}</td>
                  <td className="p-4 text-sm font-normal border-b">{job.contract}</td>
                  <td className="p-4 text-sm font-normal border-b">
                    <div className="flex gap-x-2">
                      <button
                        onClick={() => {
                          setSelectedMitra(job);
                          setIsEditDialogOpen(true);
                        }}
                        className="flex justify-center items-center p-1.5 cursor-pointer rounded-full hover:bg-gray-200"
                      >
                        <EditIcon color="blue" size={18} />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedMitra(job);
                          setIsDeleteDialogOpen(true);
                        }}
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

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <span className="text-sm text-gray-600 w-52">
            Halaman {currentPage} dari {totalPages}
          </span>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(currentPage - 1)}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
              {[...Array(totalPages)].map((_, index) => (
                <PaginationItem key={index}>
                  <PaginationLink
                    isActive={currentPage === index + 1}
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(currentPage + 1)}
                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Mitra</DialogTitle>
          </DialogHeader>
          <DialogDescription className="py-5">
            <div className="space-y-6">
              <p className="text-center">
                Apakah Anda yakin ingin menghapus mitra{" "}
                <strong>{selectedMitra?.name}</strong>?  ini tidak dapat
                dibatalkan.Tindakan
              </p>

              <div className="flex gap-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDeleteDialogOpen(false)}
                >
                  Batal
                </Button>
                <Button
                  type="button"
                  className="bg-red-500 text-white hover:bg-red-600"
                  onClick={handleDelete}
                >
                  Hapus
                </Button>
              </div>
            </div>
          </DialogDescription>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Mitra</DialogTitle>
          </DialogHeader>
          <DialogDescription className="py-5">
            <div className="space-y-6">
            <Form {...formEditMitra}>
              <form
                onSubmit={formEditMitra.handleSubmit(handleEditSubmit)} // Kaitkan dengan handleSubmit
                className="space-y-3"
              >
                <FormField
                  control={formEditMitra.control}
                  name="alamat_Mitra"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alamat Mitra</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Masukkan Alamat Mitra"
                          {...field} // Sambungkan ke field
                          required
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={formEditMitra.control}
                  name="nomor_Telephone_Mitra"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nomor Telepon Mitra</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Masukkan Nomor Telepon"
                          {...field} // Sambungkan ke field
                          required
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-x-3">
                  <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                    Batal
                  </Button>
                  <Button type="submit">Simpan Perubahan</Button>
                </div>
              </form>
            </Form>
            </div>
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DaftarPekerjaan;
