import { useMutation, useQuery } from "react-query";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export async function getCsrfToken() {
    const response = await fetch(`${API_BASE_URL}/api/auth/csrf-token`, {
        method: "GET",
        credentials: "include"
    });
    if (response.ok) {
        const data = await response.json();
        return data.csrfToken;
    } else {
        throw new Error("Failed to retrieve CSRF token");
    }
}

type SignInUserRequest = {
    email: string,
    password: string
}

export function useSignInUser () {
    const {toast} = useToast()
    async function useSignInUserRequest (user: SignInUserRequest) {
        // const csrfToken = await getCsrfToken() // Hasn't implemented csrf token yet.
        const response = await fetch(`${API_BASE_URL}/api/auth/signin`, {
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
            toast({
                title: data.message,
                variant: "danger"
            })
            throw new Error(data.message)
        }
        return response.json()
    }
    const {
        mutateAsync: signInUser,
        isLoading,
        isSuccess,
        error,
        reset
    } = useMutation(useSignInUserRequest)
    
    if (isSuccess) {
        window.location.href = '/dashboard'
    }
    
    if (error) {
        toast({
            title: error.toString().split(' ').slice(1).join(' '),
            variant: "danger"
        }) //Debug.
        reset()
    }
    
    return {signInUser, isLoading}
}

export function useAuth() {
  const { toast } = useToast();

  async function useAuthRequest() {
    const response = await fetch(`${API_BASE_URL}/api/auth`, {
      method: "POST",
      headers: {
        "X-Client-Type": "web",
      },
      credentials: "include",
    });

    if (!response.ok) {
      const errorDetails = await response.text();
      console.error("Authentication failed:", response.status, errorDetails);
      throw new Error("Authentication failed!");
    }

    return response.ok;
  }

  const {
    data: isAuthenticated,
    isLoading,
    isSuccess,
    error,
  } = useQuery("authenticateUser", useAuthRequest, {
    retry: false,
  });

  // Trigger the toast in a side effect
  useEffect(() => {
    if (isSuccess) {
      toast({
        title: "User authenticated",
        variant: "success",
      });
    }

    if (error) {
      toast({
        title: "Authentication failed",
        description: error.toString(),
        variant: "danger",
      });
    }
  }, [isSuccess, error, toast]);

  return { isAuthenticated, isLoading };
}
