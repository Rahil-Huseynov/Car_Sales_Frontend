"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Car, Eye, EyeOff, Mail, Lock, User, Phone } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import apiClient from "@/lib/api-client"
import { Navbar } from "@/components/navbar"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import CountryCodeSelect from "@/components/CountryCodeSelect"

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [phoneCode, setPhoneCode] = useState<string>("+93") 
  const [phoneNumber, setPhoneNumber] = useState<string>("")
  const [agreeToTerms, setAgreeToTerms] = useState<boolean>(false)

  const router = useRouter()
  const timeoutRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current)
    }
  }, [])

  const clearStatusAfter = (ms = 4000) => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current)
    timeoutRef.current = window.setTimeout(() => setStatusMessage(null), ms)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsPending(true)
    setStatusMessage(null)

    const form = event.currentTarget
    const formData = new FormData(form)

    const password = String(formData.get("password") ?? "")
    const confirmPassword = String(formData.get("confirmPassword") ?? "")

    if (password !== confirmPassword) {
      setIsPending(false)
      const msg = "Şifrələr uyğun deyil."
      setStatusMessage({ type: "error", text: msg })
      toast.error(msg, { position: "top-right", autoClose: 4000 })
      clearStatusAfter(4000)
      return
    }

    if (!agreeToTerms) {
      setIsPending(false)
      const msg = "İstifadə şərtlərini qəbul etməlisiniz."
      setStatusMessage({ type: "error", text: msg })
      toast.error(msg, { position: "top-right", autoClose: 4000 })
      clearStatusAfter(4000)
      return
    }

    const fixedFormData = new FormData()
    fixedFormData.append("email", String(formData.get("email") ?? ""))
    fixedFormData.append("password", password)
    fixedFormData.append("firstName", String(formData.get("firstName") ?? ""))
    fixedFormData.append("lastName", String(formData.get("lastName") ?? ""))
    fixedFormData.append("phoneNumber", `${phoneCode}${phoneNumber}`)
    fixedFormData.append("role", "standart")

    try {
      const response = await apiClient.register(fixedFormData)
      setIsPending(false)

      if (response?.success) {
        if (response.accessToken) {
          try { localStorage.setItem("accessToken", response.accessToken) } catch { }
        }
        const msg = response.message || "Qeydiyyat uğurla tamamlandı."
        setStatusMessage({ type: "success", text: msg })
        toast.success(msg, { position: "top-right", autoClose: 3000 })
        if (timeoutRef.current) window.clearTimeout(timeoutRef.current)
        timeoutRef.current = window.setTimeout(() => {
          setStatusMessage(null)
          router.push("/profile")
        }, 1200)
      } else {
        const msg = response?.message || "Qeydiyyat zamanı xəta baş verdi."
        setStatusMessage({ type: "error", text: msg })
        toast.error(msg, { position: "top-right", autoClose: 4000 })
        clearStatusAfter(4000)
      }
    } catch (error: any) {
      setIsPending(false)
      const errorMessage = error?.data?.message || error?.message || "Serverlə əlaqə zamanı problem yarandı."
      setStatusMessage({ type: "error", text: errorMessage })
      toast.error(errorMessage, { position: "top-right", autoClose: 4000 })
      clearStatusAfter(4000)
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
            <CardTitle className="text-2xl font-bold">Hesab yaradın</CardTitle>
            <CardDescription>Euro Car-da qeydiyyatdan keçin</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Ad</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input id="firstName" name="firstName" placeholder="Adınız" className="pl-10" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Soyad</Label>
                  <Input id="lastName" name="lastName" placeholder="Soyadınız" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input id="email" type="email" name="email" placeholder="E-mail ünvanınız" className="pl-10" required />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="phone">Telefon</Label>
                <div className="flex gap-2 items-center">
                  <div className="max-w-[150px]">
                    <CountryCodeSelect value={phoneCode} onChange={setPhoneCode} />
                  </div>
                  <div className="flex-1 relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="501234567 (koddan sonra)"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      required
                      className="pl-10"
                    />
                  </div>
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
                    placeholder="Şifrəniz"
                    className="pl-10 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Şifrəni təsdiq edin</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Şifrəni təkrar daxil edin"
                    className="pl-10 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  id="terms"
                  name="agreeToTerms"
                  type="checkbox"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="terms" className="text-sm">
                  <Link href="/terms" className="text-blue-600 hover:underline">İstifadə şərtləri</Link>{" "}
                  və{" "}
                  <Link href="/privacy" className="text-blue-600 hover:underline">Məxfilik siyasəti</Link>
                  -ni qəbul edirəm
                </Label>
              </div>

              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Qeydiyyatdan keçilir..." : "Qeydiyyatdan keç"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-gray-600">Artıq hesabınız var? </span>
              <Link href="/auth/login" className="text-blue-600 hover:underline font-medium">Daxil olun</Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
