"use client"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Car, Eye, EyeOff, Mail, Lock, User, Phone } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { apiClient } from "@/lib/api-client"
import { Navbar } from "@/components/navbar"

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const router = useRouter()
  const { toast } = useToast()
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsPending(true)
    setStatusMessage(null)

    const formData = new FormData(event.currentTarget)
    const fixedFormData = new FormData()
    fixedFormData.append("email", formData.get("email") as string)
    fixedFormData.append("password", formData.get("password") as string)
    fixedFormData.append("firstName", (formData.get("firstName") as string) || "")
    fixedFormData.append("lastName", (formData.get("lastName") as string) || "")
    fixedFormData.append("phoneNumber", (formData.get("phone") as string) || "")
    fixedFormData.append("role", "standart")

    if (formData.get("agreeToTerms") !== "on") {
      setIsPending(false)
      setStatusMessage({ type: "error", text: "İstifadə şərtlərini qəbul etməlisiniz." })
      return
    }

    try {
      const response = await apiClient.register(fixedFormData)
      setIsPending(false)

      if (response.success) {
        if (response.accessToken) {
          localStorage.setItem("accessToken", response.accessToken)
        }
        setStatusMessage({ type: "success", text: response.message || "Qeydiyyat uğurla tamamlandı." })
        toast({
          title: "Uğurlu",
          description: response.message || "Qeydiyyat uğurla tamamlandı.",
          variant: "default",
        })
        router.push("/profile")
      } else {
        setStatusMessage({ type: "error", text: response.message || "Qeydiyyat zamanı xəta baş verdi." })
        toast({
          title: "Xəta",
          description: response.message || "Qeydiyyat zamanı xəta baş verdi.",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      setIsPending(false)
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Serverlə əlaqə zamanı problem yarandı."

      setStatusMessage({ type: "error", text: errorMessage })

      toast({
        title: "Xəta",
        description: errorMessage,
        variant: "destructive",
      })
    }
  }

  return (
    <>
      <Navbar />
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

              <div className="space-y-2">
                <Label htmlFor="phone">Telefon</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input id="phone" type="tel" name="phone" placeholder="+994 50 123 45 67" className="pl-10" required />
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
                <Checkbox id="terms" name="agreeToTerms" />
                <Label htmlFor="terms" className="text-sm">
                  <Link href="/terms" className="text-blue-600 hover:underline">
                    İstifadə şərtləri
                  </Link>{" "}
                  və{" "}
                  <Link href="/privacy" className="text-blue-600 hover:underline">
                    Məxfilik siyasəti
                  </Link>
                  -ni qəbul edirəm
                </Label>
              </div>

              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Qeydiyyatdan keçilir..." : "Qeydiyyatdan keç"}
              </Button>
            </form>

            {statusMessage && (
              <div
                className={`mt-4 p-3 rounded ${statusMessage.type === "success"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
                  }`}
                role="alert"
              >
                {statusMessage.text}
              </div>
            )}

            <div className="mt-6 text-center text-sm">
              <span className="text-gray-600">Artıq hesabınız var? </span>
              <Link href="/auth/login" className="text-blue-600 hover:underline font-medium">
                Daxil olun
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
