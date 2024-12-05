import { useToast } from "@/hooks/use-toast"
import { useMutation, useQuery } from "react-query"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

type CreateInboxRequest = {
    email_receiver: string,
    subject: string,
    content: string
    
}

export function useCreateInbox() {
    const {toast} = useToast()
    async function useCreateInboxRequest(inbox: CreateInboxRequest) {
        // const csrfToken = await getCsrfToken() // Hasn't implemented csrf token yet.
        const response = await fetch(`${API_BASE_URL}/api/inbox`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "X-Client-Type": "web"
                // "X-CSRF-TOKEN": csrfToken // Hasn't implemented csrf token yet.
            },
            body: JSON.stringify(inbox),
            credentials: 'include'
        })
        if (!response.ok) {
            const data = await response.json()
            // toast.error(data.message)
            throw new Error(data.message)
        }
        
        return response.json()
    }
    
    const {
        mutateAsync: createInbox,
        isLoading,
        isSuccess,
        error,
        // reset
    } = useMutation(useCreateInboxRequest)

    if (isSuccess) {
        toast({
            title: "Mitra berhasil dibuat!",
            variant: "success"
        })
    }

    if (error) {
        toast({
            title: error.toString(),
            variant: "danger"
        }) //Debug.
        // reset()
    }

    return {createInbox, isLoading}
}

export function useGetInboxes(nama_mitra: string | undefined, options: {enabled?: boolean} = {enabled: true}) {
    const {enabled} = options
    async function useGetInboxesRequest () {
        // const csrfToken = await getCsrfToken() // Hasn't implemented csrf token yet.
        const response = await fetch(`${API_BASE_URL}/api/inbox/es`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "X-Client-Type": "web"
                // "X-CSRF-TOKEN": csrfToken // Hasn't implemented csrf token yet.
            },
            body: JSON.stringify({nama_mitra}),
            credentials: 'include'
        })
        if (!response.ok) {
            throw new Error("Failed to get kontrak's pekerjaan(s).")
        }
        return response.json()
    }
    
    const { data: inboxes, isLoading, refetch } = useQuery( ["fetchInboxes", nama_mitra], useGetInboxesRequest, { enabled: enabled && !!nama_mitra } )
    
    return { inboxes, isLoading, refetch }
}