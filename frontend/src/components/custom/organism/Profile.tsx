import  { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from '@/components/ui/input';
import {z} from "zod";
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useToast } from "@/hooks/use-toast"
import { Country } from '@/types';
import { ChevronDown } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { getCountries, getCountryCallingCode } from 'libphonenumber-js';
import { useGetUser, useUpdateUser } from '@/api/UserApi';
import LoadingButton from '@/components/LoadingButton';
import LoadingScreen from '@/components/LoadingScreen';

const formUserProfileSchema = z.object({
  fullName: z
    .string()
    .min(1, { message: "Nama lengkap tidak boleh kosong" }),
  personalEmail: z
    .string()
    .email({ message: "Email tidak valid" }),
  personalPhone: z
    .string()
    .min(10, { message: "Nomor telepon minimal 10 karakter" }),
    // .regex(/^\d+$/, { message: "Nomor telepon hanya boleh berisi angka" }),
});
export type UserProfileSchema = z.infer<typeof formUserProfileSchema>

const formCompanySchema = z.object({
  companyName: z
  .string()
  .min(1, { message: "Nama perusahaan tidak boleh kosong" }),
companyAddress: z
  .string()
  .min(5, { message: "Alamat perusahaan minimal 5 karakter" }),
companyPhone: z
  .string()
  .min(10, { message: "Nomor telepon minimal 10 karakter" })
  .regex(/^\d+$/, { message: "Nomor telepon hanya boleh berisi angka" }),
});
export type CompanyProfileSchema = z.infer<typeof formCompanySchema>


const Profile = () => {
  const {user, isLoading: isUserLoading, refetch: refetchUser} = useGetUser()
  const { updateUser, isLoading: isUpdatingUserLoading, isSuccess: isSuccessUpdatingUser, error: isErrorUpdatingUser } = useUpdateUser();
  
  const [activeEditMode, setActiveEditMode] = useState<'none' | 'personal' | 'company'>('none');
  const { toast } = useToast()

  const formEditProfile = useForm<UserProfileSchema>({
    resolver: zodResolver(formUserProfileSchema),
    defaultValues:{
      fullName: user?.user?.nama_lengkap,
      personalEmail: user?.user?.email,
      personalPhone: user?.user?.nomor_telepon,
    }
  })

  const formEditCompany = useForm<CompanyProfileSchema>({
    resolver: zodResolver(formCompanySchema),
    defaultValues:{
        companyName:"",
        companyAddress:"",
        companyPhone:"",
    }
  })
    
  useEffect(() => {
    if (user) {
      formEditProfile.reset({
        fullName: user?.user?.nama_lengkap || "",
        personalEmail: user?.user?.email || "",
        personalPhone: user?.user?.nomor_telepon || "",
      })
    }
  }, [user, formEditProfile, formEditCompany]);

  function handleEditPersonal () {
      if (activeEditMode === 'personal') {
          // Canceling edit mode
          formEditProfile.reset({
            fullName: user?.user?.nama_lengkap || "",
            personalEmail: user?.user?.email || "",
            personalPhone: user?.user?.nomor_telepon || "",
          })
          setActiveEditMode('none');
          toast({
              title: "Edit Mode Dibatalkan",
              description: "Perubahan dibatalkan",
              variant: "information"
          });
      } else if (activeEditMode === 'none') {
          // Entering personal edit mode
          formEditProfile.reset();
          setActiveEditMode('personal');
          toast({
              title: "Edit Mode Diaktifikan",
              description: "Anda Bisa Mengubah data Pribadi anda",
              variant: "warning"
          });
      }
  }

  async function handleSubmitUserPersonal (data:UserProfileSchema ) {
    try {
      await updateUser({
        nama_lengkap: data.fullName,
        email: data.personalEmail,
        nomor_telepon: data.personalPhone
      })
    } catch (error) {
      console.error("Error editing user (profile):", error) //Debug.
    }
  }
    
  const countries: Country[] = getCountries().map(country => ({
      code: country,
      dialCode: `+${getCountryCallingCode(country)}`,
      name: new Intl.DisplayNames(['id'], { type: 'region' }).of(country) || country
  })).sort((a, b) => a.name.localeCompare(b.name))
  
  useEffect(() => {
    if (isSuccessUpdatingUser) {
      toast({
        title: "Successfully updated user!",
        variant: 'success'
      })
      refetchUser()
      setActiveEditMode('none')
    }
  }, [isSuccessUpdatingUser])
  
  useEffect(() => {
    if (isErrorUpdatingUser) {
      toast({
        title: isErrorUpdatingUser.toString(),
        variant: 'danger'
      })
    }
  }, [isErrorUpdatingUser])
  
  return (
    <div className='flex flex-col gap-y-7'>
      
      {/* Profil Anda */}
      <div className='border-b-2 flex justify-between border-gray-200 py-3'>
        <div>
          {activeEditMode === 'personal' ? (
            <>
              <h1 className="text-2xl font-semibold mb-2">Edit Profil Anda</h1>
              <p className='text-sm font-medium text-gray-500'>Perbarui data pribadi anda disini</p>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-semibold mb-2">Profil Anda</h1>
              <p className='text-sm font-medium text-gray-500'>Data pribadi anda</p>
            </>
          )}
        </div>
        <div className='w-fit flex items-center'>
          <Button 
            type='button' 
            onClick={handleEditPersonal} 
            disabled={activeEditMode === 'company'}
            >
              {activeEditMode === 'personal' ? "Batal" : "Edit"}
          </Button>
        </div>
      </div>
      <Form {...formEditProfile}>
        <form onSubmit={formEditProfile.handleSubmit(handleSubmitUserPersonal)} className='space-y-4'>

              <FormField
                control={formEditProfile.control}
                name='fullName'
                render={({field}) => (
                    <FormItem >
                        <FormLabel className='w-48'>Nama Lengkap</FormLabel>
                            <FormControl>
                                <Input
                                  placeholder="Masukkan Nama Lengkap Anda"
                                  className={`w-full pr-10 mb-0 ${activeEditMode !== 'personal' && 'bg-gray-100'}`}
                                  disabled={activeEditMode !== 'personal'}
                                  {...field} 
                                />
                            </FormControl>
                        <FormMessage/>
                    </FormItem>
                )}
              />
              <FormField
                control={formEditProfile.control}
                name='personalEmail'
                render={({field}) => (
                    <FormItem >
                        <FormLabel className='w-48'>Email</FormLabel>
                            <FormControl >
                                <Input
                                  placeholder="Masukkan Email Anda"
                                  className="w-full pr-10 mb-0 bg-gray-100"
                                  disabled
                                  {...field} 
                                />
                            </FormControl>
                        <FormMessage/>
                    </FormItem>
                )}
              />
              
              <FormField
                control={formEditProfile.control}
                name="personalPhone"
                render={({ field }) => {
                  const initialDialCode = "+62"; // Default dial code for Indonesia
                  const [localPhoneNumber, setLocalPhoneNumber] = useState(""); // Local part of the phone number
                  const [selectedDialCode, setSelectedDialCode] = useState(initialDialCode); // Dial code
                  const [searchTerm, setSearchTerm] = useState(""); // State for search term
                  const [filteredCountries, setFilteredCountries] = useState(countries); // Filtered countries list

                  // Effect to update localPhoneNumber and selectedDialCode when user.nomor_telepon changes
                  useEffect(() => {
                    if (user?.user?.nomor_telepon && activeEditMode !== 'personal') {
                      const userPhoneNumber = user.user.nomor_telepon;
                      const dialCode = countries.find((country) =>
                        userPhoneNumber.startsWith(country.dialCode)
                      )?.dialCode || initialDialCode;
                      const localNumber = userPhoneNumber.replace(dialCode, "");

                      setSelectedDialCode(dialCode);
                      setLocalPhoneNumber(localNumber);
                    }
                  }, [user, countries]);

                  // Update field value when localPhoneNumber or selectedDialCode changes
                  useEffect(() => {
                    const correctedPhoneNumber = localPhoneNumber.startsWith("0")
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
                  
                  if (isUserLoading) {
                    return <LoadingScreen/>
                  }

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
                                disabled={activeEditMode !== 'personal'}
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
                            className={`flex-1 border rounded-md p-2 ${activeEditMode !== 'personal' && 'bg-gray-100'}`}
                            value={localPhoneNumber}
                            onChange={(e) => setLocalPhoneNumber(e.target.value)}
                            placeholder="Nomor Telepon"
                            disabled={activeEditMode !== 'personal'}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

          <div className='flex justify-end py-3 w-fit'>
            {isUpdatingUserLoading ? (
              <LoadingButton/>
            ) : (
              <Button 
                type='submit'
                disabled={activeEditMode !== 'personal' && !isUpdatingUserLoading}
                >
                  Simpan
              </Button>
            )}
          </div>
        </form>
      </Form>
      
    </div>
  );
};

export default Profile;
