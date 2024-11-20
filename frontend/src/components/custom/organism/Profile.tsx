import  { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from '@/components/ui/input';
import {z} from "zod";
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useToast } from "@/hooks/use-toast"

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
    const [isEditingPersonal, setIsEditingPersonal] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const { toast } = useToast()


  const formEditProfile = useForm<UserProfileSchema>({
    resolver: zodResolver(formUserProfileSchema),
    defaultValues:{
        fullName:"aa",
        personalEmail:"aa@gmail.com",
        personalPhone:"0785656756",
    }
    })

    const formEditCompany = useForm<CompanyProfileSchema>({
      resolver: zodResolver(formCompanySchema),
      defaultValues:{
          companyName:"aa",
          companyAddress:"aa",
          companyPhone:"ad",
      }
      })

    const handleEditCompany = () => {
      if (!isEditing) {
        formEditCompany.reset();
      }
      setIsEditing((prev) => !prev);
      };

    const handleEditPersonal = () => {
      if (!isEditingPersonal) {
        formEditProfile.reset();
      }
      setIsEditingPersonal((prev) => !prev);
      };

    const handleSubmitUserPersonal = (data:UserProfileSchema ) => {
      console.log("adalah",data);
      setIsEditingPersonal(false);
      toast({
        title: "Data diri Anda telah diubah",
        description: "Pastikan data diri anda sudah benar",
      })
    };

    const handleSubmitCompanyProfile = (data:CompanyProfileSchema ) => {
      console.log("adalah",data);
      setIsEditing(false);
      toast({
        title: "Data Perusahaan Anda telah diubah",
        description: "Pastikan data diri anda sudah benar",
      })
    };

  return (
    <div className='flex flex-col gap-y-7'>
      {/* Profil Anda */}
      <div className='border-b-2 flex justify-between border-gray-200 py-3'>
        <div>
          {isEditingPersonal ? (
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
          <Button type='button' onClick={handleEditPersonal}>
            {isEditingPersonal ? "Batal" : "Edit"}
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
                            <FormControl >
                                <Input
                                placeholder="Masukkan Nama Lengkap Anda"
                                className="w-full pr-10 mb-0"
                                disabled={!isEditingPersonal}
                                {...field} />
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
                                className="w-full pr-10 mb-0"
                                disabled={!isEditingPersonal}
                                {...field} />
                            </FormControl>
                        <FormMessage/>
                    </FormItem>
                )}
              />  
              <FormField
                control={formEditProfile.control}
                name='personalPhone'
                render={({field}) => (
                    <FormItem >
                        <FormLabel className='w-48'>Nomor Telepon</FormLabel>
                            <FormControl >
                                <Input
                                placeholder="Masukkan Nomor Telepon Anda"
                                className="w-full pr-10 mb-0"
                                disabled={!isEditingPersonal}
                                {...field} />
                            </FormControl>
                        <FormMessage/>
                    </FormItem>
                )}
              />  
          
          <div className='flex justify-end py-3 w-fit'>
            <Button 
              type='submit'
              disabled={!isEditingPersonal}
              >Simpan
            </Button>
          </div>
        </form>
      </Form>


      {/* Profil Perusahaan */}
      <div className='border-b-2 flex justify-between border-gray-200 py-3'>
        <div>
          {isEditing ? (
            <>
              <h1 className="text-2xl font-semibold mb-2">Edit Profil Perusahaan</h1>
              <p className='text-sm font-medium text-gray-500'>Perbarui data perusahaan anda disini</p>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-semibold mb-2">Profil Perusahaan</h1>
              <p className='text-sm font-medium text-gray-500'>Data perusahaan anda</p>
            </>
          )}
        </div>
        <div className='w-fit flex items-center'>
          <Button type='button' onClick={handleEditCompany}>
            {isEditing ? "Batal" : "Edit"}
          </Button>
        </div>
      </div>
      <Form {...formEditCompany}>
        <form onSubmit={formEditCompany.handleSubmit(handleSubmitCompanyProfile)} className='space-y-4'>
          
              <FormField
                control={formEditCompany.control}
                name='companyName'
                render={({field}) => (
                    <FormItem >
                        <FormLabel className='w-48'>Nama Perusahaan</FormLabel>
                            <FormControl >
                                <Input
                                placeholder="Masukkan Nama Perusahaan Anda"
                                className="w-full pr-10 mb-0"
                                disabled={!isEditing}
                                {...field} />
                            </FormControl>
                        <FormMessage/>
                    </FormItem>
                )}
              />

              <FormField
                control={formEditCompany.control}
                name='companyAddress'
                render={({field}) => (
                    <FormItem >
                        <FormLabel className='w-48'>Alamat Perusahaan</FormLabel>
                            <FormControl >
                                <Input
                                placeholder="Masukkan Alamat Perusahaan Anda"
                                className="w-full pr-10 mb-0"
                                disabled={!isEditing}
                                {...field} />
                            </FormControl>
                        <FormMessage/>
                    </FormItem>
                )}
              />

              <FormField
                control={formEditCompany.control}
                name='companyPhone'
                render={({field}) => (
                    <FormItem >
                        <FormLabel className='w-48'>Nomor Telepon Perusahaan</FormLabel>
                            <FormControl >
                                <Input
                                placeholder="Masukkan Nomor Telepon Perusahaan Anda"
                                className="w-full pr-10 mb-0"
                                disabled={!isEditing}
                                {...field} />
                            </FormControl>
                        <FormMessage/>
                    </FormItem>
                )}
              />

          <div className='flex justify-end p-3 w-fit'>
            <Button 
              type='submit'
              disabled={!isEditing}>Simpan</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Profile;
