import { useMutation, useQuery } from "react-query"
import { toast } from "sonner"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

type CreateUserRequest = {
    nama_lengkap: string,
    email: string,
    nomor_telepon: string,
    mitra_nama: string
}

export function useCreateUser() {
    async function useCreateUserRequest(user: CreateUserRequest) {
        // const csrfToken = await getCsrfToken() // Hasn't implemented csrf token yet.
        const response = await fetch(`${API_BASE_URL}/api/user`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "X-Client-Type": "web"
                // "X-CSRF-TOKEN": csrfToken // Hasn't implemented csrf token yet.
            },
            body: JSON.stringify(user),
            credentials: 'include'
        })
        if (!response.ok) {
            const data = await response.json()
            toast.error(data.message)
            throw new Error(data.message)
        }
        
        return response.json()
    }
    
    const {
        mutateAsync: createUser,
        isLoading,
        isSuccess,
        error,
        reset
    } = useMutation(useCreateUserRequest)

    if (isSuccess) {
        toast.success("User berhasil dibuat. Silahkan cek email untuk verifikasi akun.")
    }

    if (error) {
        // toast.error(error.toString()) .debug
        reset()
    }

    return {createUser, isLoading}
}
