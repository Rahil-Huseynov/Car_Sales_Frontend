"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Car, Eye, EyeOff, Mail, Lock } from "lucide-react"
import Link from "next/link"
import { login } from "@/actions/auth"
import { useToast } from "@/hooks/use-toast"
import { apiClient } from "@/lib/api-client"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsPending(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      const result = await apiClient.login(email, password)

      if (result?.accessToken) {
        localStorage.setItem("accessToken", result.accessToken)
        toast({
          title: "Uğurlu",
          description: "Daxil olundu",
          variant: "default",
        })
        router.push("/profile")
      } else {
        toast({
          title: "Xəta",
          description: "Daxil olmaq mümkün olmadı",
          variant: "destructive",
        })
      }
    } catch (err) {
      toast({
        title: "Server xətası",
        description: "Zəhmət olmasa, bir az sonra yenidən cəhd edin.",
        variant: "destructive",
      })
    } finally {
      setIsPending(false)
    }
  }


  return (
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
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="E-mail ünvanınızı daxil edin"
                  className="pl-10"
                  required
                />
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
                  onClick={() => setShowPassword(!showPassword)}
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
              <Button variant="outline" className="w-full bg-transparent">Google</Button>
              <Button variant="outline" className="w-full bg-transparent">Facebook</Button>
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
  )
}
