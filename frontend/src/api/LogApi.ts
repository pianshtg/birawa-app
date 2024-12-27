import { useQuery } from "react-query"
import { getCsrfToken } from "./AuthApi"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export function useGetLogs() {
    async function useGetLogsRequest () {
        const csrfToken = await getCsrfToken()
        const response = await fetch(`${API_BASE_URL}/api/log`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "X-Client-Type": "web",
                "X-CSRF-TOKEN": csrfToken
            },
            credentials: 'include'
        })
        if (!response.ok) {
            throw new Error('Failed to get logs.')
        }
        return response.json()
    }
    
    const { data: logs, isLoading } = useQuery( "fetchMitra", useGetLogsRequest )
    
    return { logs, isLoading }
}