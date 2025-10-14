"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Car, Eye, EyeOff, Mail, Lock } from "lucide-react"
import Link from "next/link"
import apiClient, { ApiError } from "@/lib/api-client"
import { Navbar } from "@/components/navbar"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { getTranslation, translateString } from "@/lib/i18n"
import { useDefaultLanguage } from "@/components/useLanguage"

import { useAuth } from "@/lib/auth-context" 
import { tokenManager } from "@/lib/token-manager"

export default function LoginPage() {
  const { lang } = useDefaultLanguage()
  const t = (key: string) => translateString(lang, key)

  const [showPassword, setShowPassword] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const router = useRouter()
  const { login, reloadUser } = useAuth()

  useEffect(() => {
    if (typeof window === "undefined") return
    const token = tokenManager.getAccessToken()
    if (token) {
      reloadUser().then((user) => {
        if (user) {
          if (user.role === "admin" || user.role === "superadmin") {
            router.replace("/admin/dashboard")
          } else {
            router.replace("/profile")
          }
        }
      })
    }
  }, [router, reloadUser])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsPending(true)

    const formData = new FormData(e.currentTarget)
    const email = String(formData.get("email") ?? "")
    const password = String(formData.get("password") ?? "")
    const remember = !!formData.get("remember")

    try {
      const result = await login(email, password, remember)

      if (result.success) {
        toast.success(t("loginSuccess"), { position: "top-right", autoClose: 2000 })
        const role = result.user?.role
        if (role === "admin" || role === "superadmin") {
          router.replace("/admin/dashboard")
        } else {
          router.replace("/profile")
        }
        return
      }

      toast.error(result.error || t("loginFailed"), { position: "top-right", autoClose: 4000 })
    } catch (err: any) {
      console.error("Login error:", err)
      toast.error(t("networkError"), {
        position: "top-right",
        autoClose: 5000,
      })
    } finally {
      setIsPending(false)
    }
  }

  return (
    <>
      <Navbar />
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md mx-4">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-blue-600 p-3 rounded-full">
                <Car className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">{t("loginWelcome")}</CardTitle>
            <CardDescription>{t("loginSubtitle")}</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t("emailLabel")}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    placeholder={t("emailPlaceholder")}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{t("passwordLabel")}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder={t("passwordPlaceholder")}
                    className="pl-10 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword((s) => !s)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    id="remember"
                    name="remember"
                    type="checkbox"
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="remember" className="text-sm">
                    {t("rememberMe")}
                  </Label>
                </div>
                <Link href="/auth/forgot-password" className="text-sm text-blue-600 hover:underline text-end">
                  {t("forgotPassword")}
                </Link>
              </div>

              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? t("loggingIn") : t("loginButton")}
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">{t("or")}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center text-sm">
              <span className="text-gray-600">{t("noAccount") + " "}</span>
              <Link href="/auth/register" className="text-blue-600 hover:underline font-medium">
                {t("theRegister")}
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}