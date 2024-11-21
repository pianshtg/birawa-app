import React, { useState } from 'react';
import { Accordion } from '@/components/custom/atom/Accordion';
import { ShadowContainer } from '@/components/custom/atom/ShadowContainer';
import { Button } from '@/components/ui/button';
import { getCountries, getCountryCallingCode, CountryCode } from 'libphonenumber-js';
import { ChevronDown } from 'lucide-react';
import {z} from "zod";
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useCreateMitra } from '@/api/MitraApi';


interface Country {
  code: CountryCode;
  dialCode: string;
  name: string;
}

const formTambahMitraSchema = z.object({
  // Informasi Mitra
  namaPerusahaan: z.string().min(1, "Nama perusahaan wajib diisi").max(3, "Nama perusahaan terlalu panjang"),
  alamatPerusahaan: z.string().min(1, "Alamat perusahaan wajib diisi").max(3, "Alamat perusahaan terlalu panjang"),
  nomorTelpPerusahaan: z.string().min(1, "Nomor telepon perusahaan wajib diisi").max(20, "Nomor telepon perusahaan terlalu panjang"),

  // Detail Kontrak
  namaKontrak: z.string().min(1, "Nama kontrak wajib diisi").max(40, "Nama kontrak terlalu panjang"),
  nomorKontrak: z.string().min(1, "Nomor kontrak wajib diisi").max(20, "Nomor kontrak terlalu panjang"),
  nilaiKontrak: z.preprocess(
    (value) => parseFloat(value as string), // Ubah string menjadi angka
    z.number().min(1, "Nilai Kontrak tidak boleh 0").max(1000000000000, "Nilai kontrak terlalu panjang")
  ),
  tanggalKontrak: z.string().min(1, "Tanggal kontrak wajib diisi").max(10, "Format tanggal tidak valid"), // Asumsi format YYYY-MM-DD
  jangkaWaktu: z.preprocess(
    (value) => parseFloat(value as string),
    z.number().min(1, "Jangka waktu wajib lebih dari 1").max(5475, "Jangka waktu terlalu panjang")
  ),

  // Akun Mitra
  namaLengkapUser: z.string().min(1, "Nama lengkap wajib diisi").max(40, "Nama lengkap terlalu panjang"),
  nomorTeleponUser: z.string().min(1, "Nomor telepon wajib diisi").max(20, "Nomor telepon terlalu panjang"),
  emailUser: z.string().email("Email tidak valid").max(55, "Email terlalu panjang")
});

const formTambahPekerjaanSchema =  z.object({
  namaPekerjaan: z.string().min(1,"Nama Pekerjaan wajib diisi").max(2,"Nama pekerjaan terlalu panjang"),
  lokasiPekerjaan: z.string().min(1,"lokasi Pekerjaan wajib diisi").max(2,"Lokasi pekerjaan terlalu panjang")
});
export type TambahMitraSchema = z.infer<typeof formTambahMitraSchema>
export type TambahPekerjaanSchema = z.infer<typeof formTambahPekerjaanSchema>

export default function TambahMitraPage() {
  // Phone input states
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>('ID');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [companyPhoneNumber, setCompanyPhoneNumber] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isCompanyPhoneOpen, setIsCompanyPhoneOpen] = useState<boolean>(false);
  const [pekerjaanList, setPekerjaanList] = useState<{ namaPekerjaan: string; lokasiPekerjaan: string }[]>([
    { namaPekerjaan: "", lokasiPekerjaan: "" },
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { createMitra, isLoading } = useCreateMitra();
  

  const formTambahMitra = useForm<TambahMitraSchema>({
    resolver: zodResolver(formTambahMitraSchema),
    defaultValues: {
      namaPerusahaan: "",
      alamatPerusahaan: "",
      nomorTelpPerusahaan: "",
      namaKontrak: "",
      nomorKontrak: "",
      nilaiKontrak: 0,
      tanggalKontrak: "",
      jangkaWaktu: 0,
      namaLengkapUser: "",
      nomorTeleponUser: "",
      emailUser: "",
    },
  });
  
  const formTambahPekerjaan = useForm<TambahPekerjaanSchema>({
    resolver: zodResolver(formTambahPekerjaanSchema),
    defaultValues:{
      namaPekerjaan:"",
      lokasiPekerjaan:"",
    }
  })

  

  // Dialog Handler
  const handleDialogSubmit = (data: TambahPekerjaanSchema) => {
    setPekerjaanList((prev) => [...prev, data]);
    setIsDialogOpen(false);
    formTambahPekerjaan.reset();
  };

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };


  // Country Code Number
  const countries: Country[] = getCountries().map(country => ({
    code: country,
    dialCode: `+${getCountryCallingCode(country)}`,
    name: new Intl.DisplayNames(['id'], { type: 'region' }).of(country) || country
  })).sort((a, b) => a.name.localeCompare(b.name));

  const handleCountryChange = (country: Country, isCompany: boolean = false) => {
    setSelectedCountry(country.code);
    if (isCompany) {
      setIsCompanyPhoneOpen(false);
    } else {
      setIsOpen(false);
    }
  };

  const selectedDialCode = `+${getCountryCallingCode(selectedCountry)}`;

  // Submit
  async function TambahMitraSubmit(data: TambahMitraSchema) {
    console.log("Form data submitted:", data); // Debug log
    // try {
    //   const mitraData = {
    //     mitra: {
    //       nama: data.namaPerusahaan,
    //       alamat: data.alamatPerusahaan,
    //       nomor_telepon: data.nomorTelpPerusahaan,
    //     },
    //     kontrak: {
    //       nama: data.namaKontrak,
    //       nomor: data.nomorKontrak,
    //       tanggal: data.tanggalKontrak,
    //       nilai: data.nilaiKontrak,
    //       jangka_waktu: data.jangkaWaktu,
    //     },
    //     pekerjaan_arr: pekerjaanList,
    //     user: {
    //       nama_lengkap: data.namaLengkapUser,
    //       email: data.emailUser,
    //       nomor_telepon: data.nomorTeleponUser,
    //     },
    //   };
  
    //   console.log("mitraData:", mitraData); // Debug log
  
    //   const validatedData: MitraRequest = MitraRequestSchema.parse(mitraData);
    //   await createMitra(validatedData);
    //   alert("Mitra berhasil dibuat!");
    // } catch (error) {
    //   console.error(error);
    // }
  }
  
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Tambah Mitra</h1>
      <Form {...formTambahMitra} >
        <form 
          onSubmit={formTambahMitra.handleSubmit(TambahMitraSubmit)}
        >
          <Accordion title='Informasi Mitra'>
            <ShadowContainer 
              titleNeeded={false}
              buttonNeeded={false}>
              <div className="mb-6">
                <div className="grid grid-cols-2 gap-4"> 
                  <FormField
                    control={formTambahMitra.control}
                    name='namaPerusahaan'
                    render={({field}) => (
                      <FormItem>
                        <FormLabel>Nama Perusahaan</FormLabel>
                        <FormControl className="relative top-[-4px] mb-7">
                          <Input 
                            placeholder="Masukan Nama Perusahaan disini" 
                            type="text"  
                            {...field} 
                            value={field.value || ""}
                            required/>
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={formTambahMitra.control}
                    name='alamatPerusahaan'
                    render={({field}) => (
                      <FormItem>
                        <FormLabel>Alamat Perusahaan</FormLabel>
                        <FormControl className="relative top-[-4px] mb-7">
                          <Input 
                            placeholder="Masukan Alamat Perusahaan disini" 
                            type="text"  
                            {...field} 
                            value={field.value || ""}
                            required/>
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                    )}
                  />
                  {/* <div>
                    <label className="block text-sm font-medium mb-1">Nomor Telepon Perusahaan</label>
                    <div className="flex">
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setIsCompanyPhoneOpen(!isCompanyPhoneOpen)}
                          className="flex items-center border rounded-l px-3 py-2 bg-gray-50 hover:bg-gray-100"
                        >
                          {selectedDialCode}
                          <ChevronDown className="w-4 h-4 ml-1" />
                        </button>
                        
                        {isCompanyPhoneOpen && (
                          <div className="absolute  z-50 left-28 -top-12  mt-1 w-56 max-h-60 overflow-auto  bg-white border rounded-lg shadow-lg">
                            {countries.map((country) => (
                              <button
                                type="button"
                                key={country.code}
                                onClick={() => handleCountryChange(country, true)}
                                className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center space-x-2"
                              >
                                <span>{country.name}</span>
                                <span className="text-gray-500">{country.dialCode}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <input
                        type="tel"
                        value={companyPhoneNumber}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCompanyPhoneNumber(e.target.value)}
                        placeholder="Nomor Telepon"
                        className="flex-1 border border-l-0 rounded-r p-2"
                        name='NomorTelpPerusahaan'
                      />
                    </div>
                  </div> */}
                </div>
              </div>
            </ShadowContainer>
          </Accordion>

         <Accordion title='Detail Kontrak'>
            <ShadowContainer 
              titleNeeded={false}
              buttonNeeded={false}>
              <div className="mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={formTambahMitra.control}
                    name='namaKontrak'
                    render={({field}) => (
                      <FormItem>
                        <FormLabel>Nama Kontrak</FormLabel>
                        <FormControl className="relative top-[-4px] mb-7">
                          <Input 
                            placeholder="Masukan Nama Kontrak disini" 
                            type="text"  
                            {...field}
                            value={field.value || ""}
                            required/>
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={formTambahMitra.control}
                    name='nomorKontrak'
                    render={({field}) => (
                      <FormItem>
                        <FormLabel>Nomor Kontrak</FormLabel>
                        <FormControl className="relative top-[-4px] mb-7">
                          <Input 
                              placeholder="Masukan Nomor Kontrak disini" 
                              type="text"  
                              {...field}
                              value={field.value || ""}
                              required/>
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={formTambahMitra.control}
                    name='nilaiKontrak'
                    render={({field}) => (
                      <FormItem>
                        <FormLabel>Nilai Kontrak</FormLabel>
                        <FormControl className="relative top-[-4px] mb-7">
                          <Input 
                            placeholder="Masukan Nilai Kontrak " 
                            type="number"  
                            {...field} 
                            value={field.value !== undefined ? field.value : 0} // Default ke 0 jika undefined
                            required
                            />
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={formTambahMitra.control}
                    name='tanggalKontrak'
                    render={({field}) => (
                      <FormItem>
                        <FormLabel>Tanggal Kontrak</FormLabel>
                        <FormControl className="relative top-[-4px] mb-7">
                          <Input type="date"  {...field} required/>
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={formTambahMitra.control}
                    name='jangkaWaktu'
                    render={({field}) => (
                      <FormItem>
                        <FormLabel>Jangka Waktu</FormLabel>
                        <FormControl className="relative top-[-4px] mb-7">
                          <Input 
                            placeholder="Masukan Jangka Waktu Kontrak " 
                            type="number"  
                            {...field} 
                            value={field.value !== undefined ? field.value : 0} // Default ke 0 jika undefined
                            required/>
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="w-full flex justify-end mt-4">
                  <Button className="bg-red-600 text-white p-2 rounded w-40" type='button' onClick={handleOpenDialog}>
                    Tambah Pekerjaan
                  </Button>
                </div>

                {isDialogOpen && (
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Tambah Pekerjaan</DialogTitle>
                        <DialogDescription>

                        <div>
                          <Form {...formTambahPekerjaan}>
                            <form 
                              onSubmit={formTambahPekerjaan.handleSubmit(handleDialogSubmit)}
                              className='flex flex-col gap-y-4'
                              >
                                <FormField
                                  control={formTambahPekerjaan.control}
                                  name='namaPekerjaan'
                                  render={({field}) => (
                                    <FormItem>
                                      <FormLabel>Nama Pekerjaan</FormLabel>
                                      <FormControl className="relative top-[-4px] mb-7">
                                        <Input 
                                          placeholder="Ketik di sini"
                                          type="text"  
                                          {...field}
                                          value={field.value || ""}
                                          required/>
                                      </FormControl>
                                      <FormMessage/>
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={formTambahPekerjaan.control}
                                  name='lokasiPekerjaan'
                                  render={({field}) => (
                                    <FormItem>
                                      <FormLabel>Lokasi Pekerjaan</FormLabel>
                                      <FormControl className="relative top-[-4px] mb-7">
                                        <Input 
                                          placeholder="Ketik di sini" 
                                          type="text" 
                                          {...field} 
                                          value={field.value || ""}
                                          required />
                                      </FormControl>
                                      <FormMessage/>
                                    </FormItem>
                                  )}
                                />
                                <Button type='submit'> Simpan</Button>
                            </form>
                          </Form>
                        </div>
                         
                        </DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                )}

                <div className="w-full mt-4 ">
                  <div className="w-full">
                    <table className="w-full text-center text-sm s border rounded-md">
                      <thead>
                        <tr className='bg-slate-200'>
                          <th className="p-4">Pekerjaan</th>
                          <th className="p-4">Lokasi</th>
                        </tr>
                      </thead>
                      <tbody>
                      {pekerjaanList.length === 0 ? (
                        <tr>
                          <td className="p-4" colSpan={2}>
                            Belum ada pekerjaan yang ditambah
                          </td>
                        </tr>
                      ) : (
                        pekerjaanList.map((pekerjaan, index) => (
                          <tr key={index}>
                            <td className="p-4">{pekerjaan.namaPekerjaan}</td>
                            <td className="p-4">{pekerjaan.lokasiPekerjaan}</td>
                          </tr>
                        ))
                      )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </ShadowContainer>
          </Accordion> 

          <Accordion title='Akun Mitra'>
            <ShadowContainer 
              titleNeeded={false}
              buttonNeeded={false}>
              <div className="mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                      control={formTambahMitra.control}
                      name='namaLengkapUser'
                      render={({field}) => (
                        <FormItem>
                          <FormLabel>Nama Lengkap</FormLabel>
                          <FormControl className="relative top-[-4px] mb-7">
                            <Input 
                              placeholder="Masukan Nama User disini" 
                              type="text"  
                              {...field} 
                              value={field.value || ""}
                              required/>
                          </FormControl>
                          <FormMessage/>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={formTambahMitra.control}
                      name='emailUser'
                      render={({field}) => (
                        <FormItem>
                          <FormLabel>Email User</FormLabel>
                          <FormControl className="relative top-[-4px] mb-7">
                            <Input 
                              placeholder="Masukan Email User disini" 
                              type="email"  
                              {...field} 
                              value={field.value || ""}
                              required/>
                          </FormControl>
                          <FormMessage/>
                        </FormItem>
                      )}
                    />
                  {/* <div>
                    <label className="block text-sm font-medium mb-1">Nomor Telepon</label>
                    <div className="flex">
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setIsOpen(!isOpen)}
                          className="flex items-center border rounded-l px-3 py-2 bg-gray-50 hover:bg-gray-100"
                        >
                          {selectedDialCode}
                          <ChevronDown className="w-4 h-4 ml-1" />
                        </button>
                        
                        {isOpen && (
                          <div className="bg-white absolute z-50 left-[76px] -top-24 mt-1 w-56 max-h-52 overflow-y-auto border  rounded-lg shadow-lg ">
                            {countries.map((country) => (
                              <button
                                type="button"
                                key={country.code}
                                onClick={() => handleCountryChange(country)}
                                className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center space-x-2"
                              >
                                <span>{country.name}</span>
                                <span className="text-gray-500">{country.dialCode}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhoneNumber(e.target.value)}
                        placeholder="Nomor Telepon"
                        className="flex-1 border border-l-0 rounded-r p-2"
                      />
                    </div>
                  </div>          */}
                </div>
              </div>
            </ShadowContainer>
          </Accordion>  

          <Button type="submit" className='w-2/3' disabled={isLoading}>
             {isLoading ? "Loading..." : "Submit"}
          </Button>
          {/* <div className='w-full flex items-center gap-x-3 '>
            <Button type="reset" className='w-1/3' variant="outline"  >
              <Link to="/dashboard"> Back</Link>
              Reset
            </Button>
            <Button type="submit" className='w-2/3' disabled={isLoading}>
             {isLoading ? "Loading..." : "Submit"}
            </Button>
          </div> */}
        </form>
      </Form>
    </div>
  );
}