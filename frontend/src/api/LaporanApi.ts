import { stringify } from "querystring";
import { useMutation, useQuery } from "react-query";
import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_BASE_API_URL

type CreateLaporanRequest = {
    
};

export function useCreateLaporan () {
    async function useCreateLaporanRequest (laporan: CreateLaporanRequest) {
        // const csrfToken = await getCsrfToken() // Hasn't implemented csrf token yet.
        const response = await fetch(`${API_BASE_URL}/api/laporan`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "X-Client-Type": "web"
                // "X-CSRF-TOKEN": csrfToken // Hasn't implemented csrf token yet.
            },
            body: JSON.stringify(laporan),
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
        mutateAsync: createLaporan,
        isLoading,
        isSuccess,
        error,
        reset
    } = useMutation(useCreateLaporanRequest)

    if (isSuccess) {
        toast.success("Laporan Berhasil Dibuat!")
    }

    if (error) {
        // toast.error(error.toString()) .debug
        reset()
    }

    return {createLaporan, isLoading}
}