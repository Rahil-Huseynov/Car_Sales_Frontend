"use client"

import React, { useState } from "react"
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

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsPending(true)

    const formData = new FormData(e.currentTarget)
    const email = String(formData.get("email") ?? "")
    const password = String(formData.get("password") ?? "")

    try {
      const result = await apiClient.login(email, password)

      if (result?.accessToken) {
        try {
          localStorage.setItem("accessToken", result.accessToken)
        } catch (err) {
          console.warn("localStorage yazmaq alınmadı:", err)
        }

        toast.success("Uğurlu — daxil olundu", { position: "top-right", autoClose: 2500 })
        router.push("/profile")
        return
      }
      if (result?.message) {
        toast.error(String(result.message), { position: "top-right", autoClose: 4000 })
        return
      }

      toast.error("Daxil olmaq mümkün olmadı.", { position: "top-right", autoClose: 4000 })
    } catch (err: any) {
      if (err instanceof ApiError) {
        console.error("API error:", { status: err.status, data: err.data, message: err.message })
        if (err.status === 401) {
          toast.error(err.message || "Şifrə səhvdir.", { position: "top-right", autoClose: 4000 })
        } else if (err.status === 403) {
          toast.error(err.message || "İcazə yoxdur (forbidden).", { position: "top-right", autoClose: 4000 })
        } else if (err.status === 404) {
          toast.error(err.message || "İstifadəçi tapılmadı.", { position: "top-right", autoClose: 4000 })
        } else {
          toast.error(err.message || "Server xətası — bir az sonra yenidən cəhd edin.", {
            position: "top-right",
            autoClose: 5000,
          })
        }
      } else {
        console.error("Login error (non-api):", err)
        toast.error("Şəbəkə xətası və ya serverə çatmaq mümkün olmadı.", {
          position: "top-right",
          autoClose: 5000,
        })
      }
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
            <CardTitle className="text-2xl font-bold">Euro Car-a xoş gəlmisiniz</CardTitle>
            <CardDescription>Hesabınıza daxil olun</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input id="email" type="email" name="email" placeholder="E-mail ünvanınızı daxil edin" className="pl-10" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Şifrə</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Şifrənizi daxil edin"
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
                  <input id="remember" type="checkbox" className="rounded border-gray-300" />
                  <Label htmlFor="remember" className="text-sm">
                    Məni xatırla
                  </Label>
                </div>
                <Link href="/auth/forgot-password" className="text-sm text-blue-600 hover:underline">
                  Şifrəni unutmusunuz?
                </Link>
              </div>

              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Daxil olunur..." : "Daxil ol"}
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">və ya</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button variant="outline" className="w-full bg-transparent">
                  Google
                </Button>
                <Button variant="outline" className="w-full bg-transparent">
                  Facebook
                </Button>
              </div>
            </div>

            <div className="mt-6 text-center text-sm">
              <span className="text-gray-600">Hesabınız yoxdur? </span>
              <Link href="/auth/register" className="text-blue-600 hover:underline font-medium">
                Qeydiyyatdan keçin
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}