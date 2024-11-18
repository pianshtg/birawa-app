import React, { useState } from "react";
import { FaFileAlt} from "react-icons/fa";
import { MdEdit, MdDelete } from "react-icons/md";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {z} from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

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

//Tambah Kontrak
const formAddContractSchema = z.object({
  namaKontrak: z.string().min(1, "Nama kontrak wajib diisi").max(40, "Nama kontrak terlalu panjang"),
  nomorKontrak: z.string().min(1, "Nomor kontrak wajib diisi").max(20, "Nomor kontrak terlalu panjang"),
  nilaiKontrak: z.number().min(1, "Nilai kontrak wajib diisi").max(14, "Nilai kontrak terlalu panjang"),
  tanggalKontrak: z.string().min(1, "Tanggal kontrak wajib diisi").max(10, "Format tanggal tidak valid"), // Asumsi format YYYY-MM-DD
  jangkaWaktu: z.number().min(1, "Jangka waktu wajib diisi").max(5, "Jangka waktu terlalu panjang"),
})
export type AddContractSchema = z.infer<typeof formAddContractSchema>;

//Tambah Pengguna
const formAddUserSchema = z.object({
  namaPengguna: z.string().min(1, "Nama pengguna wajib diisi").max(40, "Nama pengguna terlalu panjang"),
  emailPengguna: z.string().email("Format email tidak valid").min(1, "Email pengguna wajib diisi"),
  statusPengguna: z.enum(["active", "blocked"] as const),  // Ensure the enum is inferred as a literal type
})
export type AddUserSchema = z.infer<typeof formAddUserSchema>;

// Edit Kontrak
const formEditContractSchema = z.object({
  namaKontrak: z.string().min(1, "Nama kontrak wajib diisi").max(40, "Nama kontrak terlalu panjang"),
  nomorKontrak: z.string().min(1, "Nomor kontrak wajib diisi").max(20, "Nomor kontrak terlalu panjang"),
  nilaiKontrak: z.number().min(1, "Nilai kontrak wajib diisi").max(14, "Nilai kontrak terlalu panjang"),
  tanggalKontrak: z.string().min(1, "Tanggal kontrak wajib diisi").max(10, "Format tanggal tidak valid"), // Asumsi format YYYY-MM-DD
  jangkaWaktu: z.number().min(1, "Jangka waktu wajib diisi").max(5, "Jangka waktu terlalu panjang"),
})
export type EditContractSchema = z.infer<typeof formEditContractSchema>;

// Edit Pengguna
const formEditUserSchema = z.object({
  namaPengguna: z.string().min(1, "Nama pengguna wajib diisi").max(40, "Nama pengguna terlalu panjang"),
  emailPengguna: z.string().email("Format email tidak valid").min(1, "Email pengguna wajib diisi"),
  statusPengguna: z.enum(["active", "blocked"] as const),
})
export type EditUserSchema = z.infer<typeof formEditUserSchema>;


const DetailMitraPage: React.FC<{ mitra: Mitra; onBack: () => void }> = ({ mitra, onBack }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [contracts, setContracts] = useState<Contract[]>(mitra.contracts || []);
  const [users, setUsers] = useState<User[]>(mitra.users || []);
  const [contractToEdit, setContractToEdit] = useState<Contract | null>(null);
  const [isEditContractDialogOpen, setIsEditContractDialogOpen] = useState(false);


  const formAddContract = useForm<AddContractSchema>({
    resolver: zodResolver(formAddContractSchema),
  });

  const handleAddContractSubmit = (data: AddContractSchema) => {
    const newContract: Contract = {
      id: contracts.length + 1,
      description: data.namaKontrak,
      code: data.nomorKontrak,
      nilaiKontrak: data.nilaiKontrak,
      tanggalKontrak: data.tanggalKontrak,
      jangkaWaktu: data.jangkaWaktu,
    };
  
    setContracts([...contracts, newContract]);
    setIsDialogOpen(false);
    formAddContract.reset();
  };

  const formEditContract = useForm<EditContractSchema>({
    resolver: zodResolver(formEditContractSchema),
  });
  
  const handleEditContractSubmit = (data: EditContractSchema) => {
    if (!contractToEdit) return; 

    const updatedContract: Contract = {
      ...contractToEdit,
      description: data.namaKontrak,
      code: data.nomorKontrak,
      nilaiKontrak: data.nilaiKontrak,
      tanggalKontrak: data.tanggalKontrak,
      jangkaWaktu: data.jangkaWaktu,
    };

    // Update the contracts list with the edited contract
    setContracts((prevContracts) =>
      prevContracts.map((contract) =>
        contract.id === updatedContract.id ? updatedContract : contract
      )
    );

    // Close the dialog and reset the form
    setIsEditContractDialogOpen(false);
    formEditContract.reset();
  };

  // Open edit dialog when the user clicks the edit button
  const handleEditClick = (e: React.MouseEvent, contract: Contract) => {
    e.stopPropagation();
    setContractToEdit(contract); // Set the contract to edit
    setIsEditContractDialogOpen(true); // Open the edit contract dialog
  };  

  const formAddUser = useForm<AddUserSchema>({
    resolver: zodResolver(formAddUserSchema),
  });
  
  const handleAddUserSubmit = (data: AddUserSchema) => {
    const newUser: User = {
      id: users.length + 1,
      name: data.namaPengguna,
      email: data.emailPengguna,
      status: data.statusPengguna,
    };
  
    setUsers([...users, newUser]);
    setIsUserDialogOpen(false);
    formAddUser.reset();
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <button
          onClick={onBack}
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
          style={{ marginTop: "-12px" }} 
        >
          &larr; Back to Dashboard
        </button>
      </div>
      <h2 className="text-2xl font-semibold mb-4">Detail Mitra {mitra.nama}</h2>


      <div className="grid grid-cols-2 gap-6">
        {/* Daftar Kontrak Kerja */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-black">Daftar Kontrak Kerja</h3>
            <Button
              onClick={() => setIsDialogOpen(true)}
              className="flex items-center bg-red-100 text-red-700 px-2 py-1 rounded-full hover:bg-red-200 w-auto max-w-fit"
            >
              <span>Tambah Kontrak</span>
            </Button>
          </div>
          <table className="w-full">
            <thead>
              <tr className="text-left bg-gray-200">
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
                          onClick={(e) => handleEditClick(e, contract)} // Trigger edit dialog
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
            <Button
              onClick={() => setIsUserDialogOpen(true)}
              className="flex items-center bg-red-100 text-red-700 px-2 py-1 rounded-full hover:bg-red-200 w-auto max-w-fit"
            >
              <span>Tambah Pengguna</span>
            </Button>
          </div>

          <table className="w-full">
            <thead>
              <tr className="text-left bg-gray-200">
                <th className="p-3">Pengguna Mitra</th>
                <th className="p-3">Status</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.length ? (
                users.map((user) => (
                  <tr key={user.id} className="border-b">
                    <td className="p-3">
                      <div>
                        <p className="font-semibold">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </td>
                    <td className="p-3">
                      <span
                        className={`text-sm font-semibold ${
                          user.status === "active" ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {user.status === "active" ? "Active" : "Blocked"}
                      </span>
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
                  <td colSpan={3} className="p-3 text-center text-gray-500">
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
            </DialogHeader>
            <DialogDescription>
              <Form {...formAddContract}>
                <form
                  onSubmit={formAddContract.handleSubmit(handleAddContractSubmit)}
                  className="grid grid-cols-2 gap-4"
                >
                  <FormField
                    control={formAddContract.control}
                    name="namaKontrak"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nama Kontrak</FormLabel>
                        <FormControl className="relative top-[-4px]">
                          <Input type="text" placeholder="Masukkan Nama Kontrak" {...field} required />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={formAddContract.control}
                    name="nomorKontrak"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nomor Kontrak</FormLabel>
                        <FormControl className="relative top-[-4px]">
                          <Input type="text" placeholder="Masukkan Nomor Kontrak" {...field} required />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={formAddContract.control}
                    name="nilaiKontrak"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nilai Kontrak</FormLabel>
                        <FormControl className="relative top-[-4px]">
                          <Input type="number" placeholder="Masukkan Nilai Kontrak" {...field} required />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={formAddContract.control}
                    name="tanggalKontrak"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tanggal Kontrak</FormLabel>
                        <FormControl className="relative top-[-4px]">
                          <Input
                            type="date"
                            placeholder="dd/mm/yyyy"
                            {...field}
                            required
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={formAddContract.control}
                    name="jangkaWaktu"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Jangka Waktu (bulan)</FormLabel>
                        <FormControl className="relative top-[-4px]">
                          <Input type="number" placeholder="Masukkan Jangka Waktu" {...field} required />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="col-span-2 flex justify-end gap-4">
                    <Button type="button" variant="outline" onClick={() => console.log("Cancel")}>
                      Batal
                    </Button>
                    <Button type="submit" className="bg-red-500 text-white">
                      Simpan
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogDescription>
          </DialogContent>
        </Dialog>
      )}

      {/* Dialog Edit Kontrak */}
      {isEditContractDialogOpen && contractToEdit && (
        <Dialog open={isEditContractDialogOpen} onOpenChange={setIsEditContractDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Kontrak</DialogTitle>
            </DialogHeader>
            <DialogDescription>
            <Form {...formEditContract}>
                      <form
                        onSubmit={formEditContract.handleSubmit(handleEditContractSubmit)}
                        className="grid grid-cols-2 gap-4"
                      >
                        <FormField
                          control={formEditContract.control}
                          name="namaKontrak"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nama Kontrak</FormLabel>
                              <FormControl className="relative top-[-4px]">
                                <Input
                                  type="text"
                                  placeholder="Masukkan Nama Kontrak"
                                  {...field}
                                  defaultValue={contractToEdit.description} // Prepopulate value
                                  required
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={formEditContract.control}
                          name="nomorKontrak"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nomor Kontrak</FormLabel>
                              <FormControl className="relative top-[-4px]">
                                <Input
                                  type="text"
                                  placeholder="Masukkan Nomor Kontrak"
                                  {...field}
                                  defaultValue={contractToEdit.code} // Prepopulate value
                                  required
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={formEditContract.control}
                          name="nilaiKontrak"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nilai Kontrak</FormLabel>
                              <FormControl className="relative top-[-4px]">
                                <Input
                                  type="number"
                                  placeholder="Masukkan Nilai Kontrak"
                                  {...field}
                                  defaultValue={contractToEdit.nilaiKontrak}
                                  required
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={formEditContract.control}
                          name="tanggalKontrak"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tanggal Kontrak</FormLabel>
                              <FormControl className="relative top-[-4px]">
                                <Input
                                  type="date"
                                  placeholder="dd/mm/yyyy"
                                  {...field}
                                  defaultValue={contractToEdit.tanggalKontrak}
                                  required
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={formEditContract.control}
                          name="jangkaWaktu"
                          render={({ field }) => (
                            <FormItem className="col-span-2">
                              <FormLabel>Jangka Waktu (bulan)</FormLabel>
                              <FormControl className="relative top-[-4px]">
                                <Input
                                  type="number"
                                  placeholder="Masukkan Jangka Waktu"
                                  {...field}
                                  defaultValue={contractToEdit.jangkaWaktu}
                                  required
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="col-span-2 flex justify-end gap-4">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsEditContractDialogOpen(false)}
                          >
                            Batal
                          </Button>
                          <Button type="submit" className="bg-red-500 text-white">
                            Simpan
                          </Button>
                        </div>
                      </form>
                    </Form>
            </DialogDescription>
          </DialogContent>
        </Dialog>
)}

      {/* Dialog Tambah Pengguna */}
      {isUserDialogOpen && (
        <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Pengguna</DialogTitle>
            </DialogHeader>
            <DialogDescription>
              <Form {...formAddUser}>
                <form
                  onSubmit={formAddUser.handleSubmit(handleAddUserSubmit)}
                  className="grid grid-cols-2 gap-4" // Two-column grid layout
                >
                  <FormField
                    control={formAddUser.control}
                    name="namaPengguna"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nama Pengguna</FormLabel>
                        <FormControl className="relative top-[-4px]">
                          <Input
                            type="text"
                            placeholder="Masukkan Nama Pengguna"
                            {...field}
                            required
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={formAddUser.control}
                    name="emailPengguna"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Pengguna</FormLabel>
                        <FormControl className="relative top-[-4px]">
                          <Input
                            type="email"
                            placeholder="Masukkan Email Pengguna"
                            {...field}
                            required
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={formAddUser.control}
                    name="statusPengguna"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Status Pengguna</FormLabel>
                        <FormControl className="relative top-[-4px]">
                          <select
                            className="w-full border rounded px-3 py-2 h-[40px]"
                            {...field}
                            required
                          >
                            <option value="active">Active</option>
                            <option value="blocked">Blocked</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
  
                  <div className="col-span-2 flex justify-end gap-4">
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
              </Form>
            </DialogDescription>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default DetailMitraPage;