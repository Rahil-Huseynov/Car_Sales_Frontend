import { useAuth } from "@/lib/auth-context"
import { usePathname } from "next/navigation"
import { useEffect } from "react"

export default function CurrentUserFetcher({ children }: { children?: React.ReactNode }) {
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
