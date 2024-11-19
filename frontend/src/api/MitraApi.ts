import { useMutation, useQuery } from "react-query";
import { toast } from "sonner";
import { Kontrak, Mitra, Pekerjaan, User } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

type CreateMitraRequest = {
    mitra: Mitra,
    kontrak: Kontrak,
    pekerjaan: Pekerjaan[],
    user: User
};

export function useCreateMitra () {
    async function useCreateMitraRequest (mitra: CreateMitraRequest) {
        // const csrfToken = await getCsrfToken() // Hasn't implemented csrf token yet.
        const response = await fetch(`${API_BASE_URL}/api/mitra`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "X-Client-Type": "web"
                // "X-CSRF-TOKEN": csrfToken // Hasn't implemented csrf token yet.
            },
            body: JSON.stringify(mitra),
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
        mutateAsync: createMitra,
        isLoading,
        isSuccess,
        error,
        reset
    } = useMutation(useCreateMitraRequest)

    if (isSuccess) {
        toast.success("Mitra Berhasil dibuat!")
    }

    if (error) {
        // toast.error(error.toString()) .debug
        reset()
    }

    return {createMitra, isLoading}
}
