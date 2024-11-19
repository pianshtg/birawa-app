import { Aktivitas, Shift, TenagaKerja } from "@/types";
import { useMutation, useQuery } from "react-query";
import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

type CreateLaporanRequest = {
    nama_mitra: string,
    nomor_kontrak: string,
    nama_pekerjaan: string,
    tanggal: string,
    shift: Shift,
    tenaga_kerja_arr: TenagaKerja[],
    aktivitas_arr: Aktivitas[]
};

export function useCreateLaporan() {
    async function useCreateLaporanRequest (laporan: CreateLaporanRequest, files: File[]) {
        const formData = new FormData()
        formData.append('data', JSON.stringify(laporan))
        files.forEach((file, index) => {
            formData.append(`files[${index}]`, file)
        })
        
        
        // const csrfToken = await getCsrfToken() // Hasn't implemented csrf token yet.
        const response = await fetch(`${API_BASE_URL}/api/laporan`, {
            method: 'POST',
            headers: {
                "X-Client-Type": "web"
                // "X-CSRF-TOKEN": csrfToken // Hasn't implemented csrf token yet.
            },
            body: formData,
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
    } = useMutation(({laporan, files}: {laporan: CreateLaporanRequest, files: File[]}) => useCreateLaporanRequest(laporan, files))

    if (isSuccess) {
        toast.success("Laporan berhasil dibuat!")
    }

    if (error) {
        // toast.error(error.toString()) .debug
        reset()
    }

    return {createLaporan, isLoading}
}

export function useGetLaporan(id: string) {
    async function useGetLaporanRequest () {
        // const csrfToken = await getCsrfToken() // Hasn't implemented csrf token yet.
        const response = await fetch(`${API_BASE_URL}/api/laporan/${id}`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "X-Client-Type": "web"
                // "X-CSRF-TOKEN": csrfToken // Hasn't implemented csrf token yet.
            },
            credentials: 'include'
        })
        if (!response.ok) {
            throw new Error('Failed to get laporan.')
        }
        return response.json()
    }
    
    const { data: laporan, isLoading } = useQuery( "fetchLaporan", useGetLaporanRequest )
    
    return { laporan, isLoading }
}
