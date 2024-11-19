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

export function useGetMitra(nama_mitra: string) {
    async function useGetMitraRequest () {
        // const csrfToken = await getCsrfToken() // Hasn't implemented csrf token yet.
        const response = await fetch(`${API_BASE_URL}/api/mitra`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "X-Client-Type": "web"
                // "X-CSRF-TOKEN": csrfToken // Hasn't implemented csrf token yet.
            },
            body: JSON.stringify(nama_mitra),
            credentials: 'include'
        })
        if (!response.ok) {
            throw new Error('Failed to get mitra.')
        }
        return response.json()
    }
    
    const { data: mitra, isLoading } = useQuery( "fetchMitra", useGetMitraRequest )
    
    return { mitra, isLoading }
}

export function useGetMitraUsers(nama_mitra: string) {
    async function useGetMitraUsersRequest () {
        // const csrfToken = await getCsrfToken() // Hasn't implemented csrf token yet.
        const response = await fetch(`${API_BASE_URL}/api/mitra/users`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "X-Client-Type": "web"
                // "X-CSRF-TOKEN": csrfToken // Hasn't implemented csrf token yet.
            },
            body: JSON.stringify(nama_mitra),
            credentials: 'include'
        })
        if (!response.ok) {
            throw new Error("Failed to get mitra's users.")
        }
        return response.json()
    }
    
    const { data: mitraUsers, isLoading } = useQuery( "fetchMitraUsers", useGetMitraUsersRequest )
    
    return { mitraUsers, isLoading }
}

export function useGetMitraKontraks(nama_mitra: string) {
    async function useGetMitraKontraksRequest () {
        // const csrfToken = await getCsrfToken() // Hasn't implemented csrf token yet.
        const response = await fetch(`${API_BASE_URL}/api/mitra/kontraks`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "X-Client-Type": "web"
                // "X-CSRF-TOKEN": csrfToken // Hasn't implemented csrf token yet.
            },
            body: JSON.stringify(nama_mitra),
            credentials: 'include'
        })
        if (!response.ok) {
            throw new Error('Failed to get mitra.')
        }
        return response.json()
    }
    
    const { data: mitraKontraks, isLoading } = useQuery( "fetchMitraKontraks", useGetMitraKontraksRequest )
    
    return { mitraKontraks, isLoading }
}

export function useGetMitras() {
    async function useGetMitrasRequest () {
        // const csrfToken = await getCsrfToken() // Hasn't implemented csrf token yet.
        const response = await fetch(`${API_BASE_URL}/api/mitra/all`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "X-Client-Type": "web"
                // "X-CSRF-TOKEN": csrfToken // Hasn't implemented csrf token yet.
            },
            credentials: 'include'
        })
        if (!response.ok) {
            throw new Error('Failed to get all mitra.')
        }
        return response.json()
    }
    
    const { data: allMitra, isLoading } = useQuery( "fetchMitraKontraks", useGetMitrasRequest )
    
    return { allMitra, isLoading }
}
