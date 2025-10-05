"use client"

import { Navbar } from "@/components/navbar"
import NavbarProfile from "@/components/navbarProfile"
import { AuthProvider, useAuth } from "@/lib/auth-context"
import CurrentUserFetcher from "@/components/CurrentUserFetcher"
import { useLanguage } from "@/hooks/use-language"

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { logout } = useAuth()
  const { language, changeLanguage } = useLanguage()

  return (
    <AuthProvider>
      <CurrentUserFetcher />
      <div className="min-h-screen bg-gray-50">
        <Navbar currentLanguage={language} onLanguageChange={changeLanguage} />
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
            <aside className="xl:col-span-1">
              <NavbarProfile />
            </aside>
            <main className="xl:col-span-4 bg-white rounded-lg shadow-md p-6">
              {children}
            </main>
          </div>
        </div>
      </div>
    </AuthProvider>
  )
}
