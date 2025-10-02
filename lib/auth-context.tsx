"use client"

import { createContext, useContext, useEffect, useState, type ReactNode, useCallback } from "react"
import { tokenManager } from "./token-manager"
import { apiClient } from "./api-client"
import { useRouter } from "next/navigation"

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: "client" | "admin" | "superadmin"
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; user?: User; error?: string }>
  logout: () => void
  reloadUser: () => Promise<User | null>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const logout = useCallback(() => {
    tokenManager.clearTokens()
    setUser(null)
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken")
      router.push("/auth/login")
    }
  }, [router])

  const reloadUser = useCallback(async (): Promise<User | null> => {
    const token = tokenManager.getAccessToken()
    if (!token) return null
    try {
      const data = await apiClient.getCurrentUser()
      setUser(data)
      return data
    } catch {
      if (typeof window !== "undefined") localStorage.removeItem("accessToken")
      setUser(null)
      router.push("/auth/login")
      return null
    }
  }, [router])

  useEffect(() => {
    const init = async () => {
      await reloadUser()
      setIsLoading(false)
    }
    init()
  }, [reloadUser])
  useEffect(() => {
    const interval = setInterval(() => {
      reloadUser().catch(() => { })
    }, 10000)
    return () => clearInterval(interval)
  }, [reloadUser])

  const login = async (email: string, password: string) => {
    try {
      const formData = new FormData()
      formData.append("email", email)
      formData.append("password", password)

      const response = await apiClient.login(formData)

      if (response.accessToken && response.refreshToken && response.user?.role) {
        tokenManager.setTokens(response.accessToken, response.refreshToken)
        setUser(response.user)
        return { success: true, user: response.user }
      }

      return { success: false, error: "Giriş məlumatları yanlışdır" }
    } catch (err: any) {
      return { success: false, error: err.message || "Giriş xətası" }
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, reloadUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within an AuthProvider")
  return context
}
