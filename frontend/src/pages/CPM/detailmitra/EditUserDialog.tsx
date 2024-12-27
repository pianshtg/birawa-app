import {useState,useEffect} from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { getCountries, getCountryCallingCode } from "libphonenumber-js"
import { Country } from '@/types'
import { ChevronDown } from "lucide-react"
import { User } from '@/types';
import LoadingButton from '@/components/LoadingButton';


const formEditUserSchema = z.object({
  nama_lengkap: z.string().min(1, "Nama pengguna wajib diisi").max(40, "Nama pengguna terlalu panjang").optional(),
  email: z.string().email("Format email tidak valid").min(1, "Email pengguna wajib diisi").optional(),
  nomor_telepon: z.string().min(4,"Nomor Telephone terlalu sedikit").max(16, "Nomor Telephone melebih batas"),
  status: z.coerce.number().min(0).max(2).optional(),
});

export type EditUserSchema = z.infer<typeof formEditUserSchema>;

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EditUserSchema) => void;
  user: User | null;  // Accept user data as prop
  isLoading: boolean
}

const EditUserDialog = ({ isOpen, onClose, onSubmit, user, isLoading }: Props) => {
  // Initialize the form with user data, always call useForm
  const form = useForm<EditUserSchema>({
    resolver: zodResolver(formEditUserSchema),
    defaultValues: {
      status: user?.status || 0, // Default to 0 if not provided
    }
  });

  const countries: Country[] = getCountries().map(country => ({
    code: country,
    dialCode: `+${getCountryCallingCode(country)}`,
    name: new Intl.DisplayNames(['id'], { type: 'region' }).of(country) || country
  })).sort((a, b) => a.name.localeCompare(b.name));    
  
  const [status, setStatus] = useState(user?.status || 0);

  // Synchronize the status with form state when it's updated
  useEffect(() => {
    console.log('Status:', status)
    form.setValue('status', status)
  }, [status]);
  
  useEffect(() => {
    if (!isOpen) {
      setStatus(0)
    }
  }, [isOpen])

  // Handle the "Verifikasi Pengguna" button click
  function handleVerifyUser () {
    setStatus((prevStatus) => (prevStatus === 0 ? 1 : 0)); // Toggle between 0 and 1
  };

  // Render the dialog if user data is available, otherwise show a fallback message
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Pengguna</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          {user ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                <FormField 
                  control={form.control} 
                  name="nama_lengkap" 
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Nama Pengguna</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Masukkan Nama Pengguna"
                          defaultValue={user.nama_lengkap}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} 
                />
                
                <FormField 
                  control={form.control} 
                  name="email" 
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Email Pengguna</FormLabel>
                      <FormControl>
                        <Input 
                          className='bg-gray-100'
                          type="email" 
                          placeholder="Masukkan Email Pengguna" 
                          defaultValue={user.email}
                          disabled
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} 
                />
                
                <FormField
                  control={form.control}
                  name="nomor_telepon"
                  render={({ field }) => {
                    // Extract the selectedDialCode and localPhoneNumber from the user data
                    const userPhoneNumber = user?.nomor_telepon || '';
                    const initialDialCode = countries.find(country => userPhoneNumber.startsWith(country.dialCode))?.dialCode || '+62';
                    const initialLocalPhoneNumber = userPhoneNumber.replace(initialDialCode, '');

                    // States for phone number management
                    const [localPhoneNumber, setLocalPhoneNumber] = useState(initialLocalPhoneNumber);
                    const [selectedDialCode, setSelectedDialCode] = useState(initialDialCode);
                    const [searchTerm, setSearchTerm] = useState(''); // State for search term
                    const [filteredCountries, setFilteredCountries] = useState(countries); // Filtered countries list

                    useEffect(() => {
                      // Combine dial code and local phone number to set the field value
                      const correctedPhoneNumber = localPhoneNumber.startsWith('0')
                        ? localPhoneNumber.slice(1)
                        : localPhoneNumber;
                      field.onChange(`${selectedDialCode}${correctedPhoneNumber}`);
                    }, [selectedDialCode, localPhoneNumber, field]);

                    // Filter countries based on search term
                    useEffect(() => {
                      setFilteredCountries(
                        countries.filter((country) =>
                          country.name.toLowerCase().includes(searchTerm.toLowerCase())
                        )
                      );
                    }, [searchTerm]);

                    return (
                      <FormItem>
                        <FormLabel>Nomor Telepon User</FormLabel>
                        <FormControl>
                          <div className="flex items-start gap-2">
                            {/* Dropdown for country code */}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  className="w-1/9 flex items-center gap-2 border rounded-md px-3 py-2 bg-gray-100 text-black hover:bg-gray-200"
                                  variant="outline"
                                >
                                  {selectedDialCode}
                                  <ChevronDown className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                side="bottom"
                                align="start"
                                className="w-64 max-h-60 overflow-y-auto shadow-lg"
                              >
                                <div className="p-2">
                                  <Input
                                    className="w-full mb-2"
                                    placeholder="Search country..."
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                  />
                                </div>
                                {filteredCountries.length > 0 ? (
                                  filteredCountries.map((country) => (
                                    <DropdownMenuItem
                                      className="flex justify-between text-sm cursor-pointer"
                                      key={country.code}
                                      onClick={() => setSelectedDialCode(country.dialCode)}
                                    >
                                      <span>{country.name}</span>
                                      <span className="text-gray-500">{country.dialCode}</span>
                                    </DropdownMenuItem>
                                  ))
                                ) : (
                                  <div className="text-center text-sm text-gray-500 p-2">
                                    No countries found
                                  </div>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>

                            {/* Input field for phone number */}
                            <Input
                              className="flex-1 border rounded-md p-2"
                              type="tel"
                              value={localPhoneNumber}
                              onChange={(e) => {
                                const numericValue = e.target.value.replace(/[^0-9]/g, ""); // Remove non-numeric characters
                                setLocalPhoneNumber(numericValue);
                              }}
                              placeholder="Nomor Telepon"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                
                {user.is_active && (
                  user.is_verified ? (
                    <div className='flex items-center space-x-4 shadow-md rounded-md p-1 pl-4 border-gray-200 border-[1px]'>
                      <div className={`flex bg-[#008450] opacity-70 w-[12px] h-[12px] rounded-full border-[1px] border-black`}/>
                      <p className='text-[#003822] mb-[2px] font-bold'>Aktif</p>
                    </div>
                  ) : (
                    <>
                      <div className='flex items-center space-x-4 shadow-md rounded-md p-1 pl-4 border-gray-200 border-[1px]'>
                        {status === 0 ? (
                          <div className='flex w-full items-center space-x-4'>
                            <div className={`flex bg-[#EFB700] opacity-70 w-[12px] h-[12px] rounded-full border-[1px] border-black`}/>
                            <p className='text-[#EFB700] mb-[2px] font-bold'>Belum Verifikasi</p>
                          </div>
                        ) : (
                          <div className='flex w-full items-center space-x-4'>
                            <div className={`flex bg-[#008450] opacity-70 w-[12px] h-[12px] rounded-full border-[1px] border-black`}/>
                            <p className='text-[#003822] mb-[2px] font-bold'>Aktif</p>
                          </div>
                        )}
                        <Button 
                          className='max-w-[40%] text-wrap active:bg-red-700' 
                          type='button'
                          onClick={handleVerifyUser}
                        >
                          {status === 0 ? 'Verifikasi Manual' : 'Batalkan'}
                        </Button>
                      </div>
                      {status === 1 && (
                        <p className='text-red-500'>* Status verifikasi pengguna akan baru diubah ketika form disubmit.</p>
                      )}
                    </>
                  )
                )}

                <div className="flex justify-end gap-4">
                  <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                    Batal
                  </Button>
                  {isLoading ? (
                    <LoadingButton/>
                  ) : (
                    <Button type="submit" className="bg-red-500 text-white">
                      Simpan
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          ) : (
            <p>Data pengguna tidak tersedia.</p> // Fallback if no user data is available
          )}
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserDialog;
