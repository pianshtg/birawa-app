import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getCookies (cookieName: string) {
  const cookiesJar = `; ${document.cookie}`
  const cookieFilter = cookiesJar.split(`; ${cookieName}=`)[1]
  if (cookieFilter) {
    const cookie = cookieFilter.split(';').shift()
    console.log(`Cookie (${cookieName})`, cookie) //Debug.
    return cookie
  }
}

export function getAccessToken () {
  return getCookies ('accessToken')
}