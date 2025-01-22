import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from '@/components/ui/input';
import {z} from "zod";
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useToast } from "@/hooks/use-toast"
import { useChangePassword } from '@/api/AuthApi';
import LoadingButton from '@/components/LoadingButton';

const formResetSchema = z.object({
    currentPassword: z.string().min(1, "Sandi lama wajib diisi"),
    newPassword: z
      .string()
      .min(4, "Sandi minimal 4 karakter")
      .regex(/[A-Z]/, "Sandi harus memiliki minimal 1 huruf kapital")
      .regex(/[0-9]/, "Sandi harus memiliki minimal 1 angka")
      .regex(/[^A-Za-z0-9]/, "Sandi harus memiliki minimal 1 karakter spesial"),
    confirmNewPassword: z.string().min(1, "Konfirmasi sandi wajib diisi"),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Konfirmasi sandi tidak cocok dengan sandi baru",
    path: ["confirmNewPassword"], // Path menentukan di field mana error akan ditampilkan
}).refine((data) => data.currentPassword !== data.newPassword, {
    message: "Sandi baru tidak boleh sama dengan sandi lama",
    path: ["currentPassword"], // Path menentukan di field mana error akan ditampilkan
})

export type ResetPasswordSchema = z.infer<typeof formResetSchema>

const Reset = () => {
    
    const {changePassword, isLoading: isChangingPassword, isSuccess: isChangePasswordSuccess, error: isChangePasswordError} = useChangePassword()
    
    const { toast } = useToast()
    const [showOldPassword, setShowOldPassword] = useState<boolean>(false);
    const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState<boolean>(false);
    const [isEditing,setIsEditing] = useState<boolean>(false);

    const formResetPassword = useForm<ResetPasswordSchema>({
    resolver: zodResolver(formResetSchema),
    defaultValues:{
        currentPassword: "",
        newPassword: "",
        confirmNewPassword:"",
    }
    })

    function handleEditPassword () {
        if (!isEditing) {
            // When entering edit mode
            formResetPassword.reset();
            toast({
                title: "Edit Mode Diaktifkan",
                description: "Anda Bisa Mengubah data di form",
                variant: "warning"
            });
        } else {
            // When canceling edit mode
            formResetPassword.reset({
                currentPassword: "",
                newPassword: "",
                confirmNewPassword: ""
            });
            toast({
                title: "Edit Mode Dibatalkan",
                description: "Perubahan dibatalkan",
                variant: "information"
            });
        }
        setIsEditing((prev) => !prev);
    };

    async function handleResetPassword (data: ResetPasswordSchema) {
        try {
            await changePassword({
              old_password: data.currentPassword,
              new_password: data.newPassword,
            })
          } catch (error) {
            return
          }
    }
    
    useEffect(() => {
        if (isChangePasswordSuccess) {
            toast({
                title: 'Successfully change password!',
                variant: 'success'
            })
        }
    }, [isChangePasswordSuccess])
    
    useEffect(() => {
        if (isChangePasswordError) {
            toast({
                title: isChangePasswordError.toString(),
                variant: 'danger'
            })
        }
    }, [isChangePasswordError])

    return (
    <div className='flex flex-col gap-y-7'>
        <div className='border-b-2 flex justify-between border-gray-200 py-3'>
            <div>
                <h1 className="text-2xl font-semibold mb-2">Ganti Sandi</h1>
                <p className='text-sm font-medium text-gray-500'>Perbarui sandi Anda di sini</p>
            </div>
            <div className='w-fit flex items-center'>
                <Button type='button' onClick={handleEditPassword}>
                    {isEditing ? "Batal" : "Edit"}
                </Button>
        </div>
        </div>
        <Form {...formResetPassword}>
            <form onSubmit={formResetPassword.handleSubmit(handleResetPassword)} className='space-y-4'>
                <FormField
                    control={formResetPassword.control}
                    name='currentPassword'
                    render={({field}) => (
                        <FormItem>
                            <FormLabel className='w-48'>Sandi Lama</FormLabel>
                            <div className="relative w-full">
                                <FormControl className="relative top-[-4px] mb-7">
                                    <Input
                                        type={showOldPassword ? "text" : "password"}
                                        placeholder="Masukkan Sandi Lama Anda"
                                        className="w-full pr-10 mb-0 font-sans"
                                        disabled={!isEditing}
                                        {...field} required
                                    />
                                </FormControl>
                                <button
                                    type="button"
                                    onClick={() => setShowOldPassword(!showOldPassword)}
                                    className={`absolute right-3 top-4 -translate-y-1/2 text-gray-500 ${isEditing && 'hover:text-gray-700'}`}
                                    disabled={!isEditing}
                                    >
                                    {showOldPassword ? (
                                        <EyeOff size={18}/>
                                    ) : (
                                        <Eye size={18} />
                                    )}
                                </button>
                            </div>
                            <FormMessage/>
                        </FormItem>
                    )}
                    />    

                <FormField
                    control={formResetPassword.control}
                    name='newPassword'
                    render={({field}) => (
                        <FormItem >
                            <FormLabel className='w-48'>Sandi Baru</FormLabel>
                            <div className="relative w-full">
                                <FormControl className="relative top-[-4px] mb-7">
                                <Input
                                    type={showNewPassword ? "text" : "password"}
                                    placeholder="Masukkan Sandi Baru Anda"
                                    className="w-full pr-10 mb-0 font-sans"
                                    disabled={!isEditing}
                                    {...field} required/>
                                </FormControl>
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className={`absolute right-3 top-4 -translate-y-1/2 text-gray-500 ${isEditing && 'hover:text-gray-700'}`}
                                    disabled={!isEditing}
                                    >
                                    {showNewPassword ? (
                                        <EyeOff size={18}/>
                                    ) : (
                                        <Eye size={18} />
                                    )}
                                </button>
                            </div>
                            <FormMessage/>
                        </FormItem>
                    )}
                    /> 

                <FormField
                    control={formResetPassword.control}
                    name='confirmNewPassword'
                    render={({field}) => (
                        <FormItem >
                            <FormLabel className='w-48'>Konfirmasi Sandi Baru</FormLabel>
                            <div className="relative w-full">
                                <FormControl className="relative top-[-4px] mb-7">
                                <Input
                                    type={showConfirmNewPassword? "text" : "password"}
                                    placeholder="Masukkan Konfimasi Sandi Baru Anda"
                                    className="w-full pr-10 mb-0 font-sans"
                                    disabled={!isEditing}
                                    {...field} required/>
                                </FormControl>
                                <button
                                    type="button"
                                    disabled={!isEditing}
                                    onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                                    className={`absolute right-3 top-4 -translate-y-1/2 text-gray-500 ${isEditing && 'hover:text-gray-700'}`}
                                    >
                                    {showConfirmNewPassword ? (
                                        <EyeOff size={18}/>
                                    ) : (
                                        <Eye size={18} />
                                    )}
                                </button>
                            </div>
                            <FormMessage/>
                        </FormItem>
                    )}
                    />  
                <div className='flex justify-end py-3 w-fit'>
                    {isChangingPassword ? (
                        <LoadingButton/>
                    ) : (
                        <Button 
                            type='submit'
                            disabled={!isEditing}
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

export default Reset;
