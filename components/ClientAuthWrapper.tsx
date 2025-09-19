"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-context"

export default function ClientAuthWrapper({ children }: { children: React.ReactNode }) {
  const { reloadUser } = useAuth()
  const pathname = usePathname()

  useEffect(() => {
    reloadUser().catch(() => {})
  }, [pathname, reloadUser])

  useEffect(() => {
    const interval = setInterval(() => {
      reloadUser().catch(() => {})
    }, 10000)
    return () => clearInterval(interval)
  }, [reloadUser])

  return <>{children}</>
}
