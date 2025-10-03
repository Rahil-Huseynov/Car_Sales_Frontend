"use client"

import React, { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Settings, User, Shield, Camera, Save, Eye, EyeOff } from 'lucide-react'
import { useLanguage } from "@/hooks/use-language"
import { getTranslation } from "@/lib/i18n"
import apiClient from "@/lib/api-client"
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useAuth } from "@/lib/auth-context"

type User = {
  id: number
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  role: string
  createdAt: string
}

function getToken() {
  return typeof window !== "undefined"
    ? (localStorage.getItem("access_token") || localStorage.getItem("accessToken") || "")
    : ""
}

export function authHeaders(isJson = true) {
  const token = getToken()
  const headers: Record<string, string> = {}
  if (token) headers["Authorization"] = `Bearer ${token}`
  if (isJson) headers["Content-Type"] = "application/json"
  return headers
}

export default function SettingsPage() {
  const { language } = useLanguage()
  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setNewShowPassword] = useState(false)
  const [showConfirmPassword, setshowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState<number | null>(null)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [profileData, setProfileData] = useState<User | null>(null)
  const { logout } = useAuth()

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true)
      try {
        const data = await apiClient.getCurrentUser()
        setProfileData(data)
        setUserId(data?.id ?? null)
        setFirstName(data?.firstName ?? "")
        setLastName(data?.lastName ?? "")
        setEmail(data?.email ?? "")
        setPhone(data?.phoneNumber ?? "")
      } catch (err: any) {
        logout()
        toast.error(err?.message || "İstifadəçi məlumatı yüklənərkən xəta baş verdi. Çıxış edilir.")
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [logout])
  async function handleSaveProfile() {
    if (!userId) {
      toast.error("İstifadəçi id-si tapılmadı")
      return
    }
    setLoading(true)
    try {
      const body = {
        firstName,
        lastName,
        email,
        phoneNumber: phone,
      }
      const res = await apiClient.updateUser(String(userId), body)
      setProfileData(res)
      setFirstName(res?.firstName ?? firstName)
      setLastName(res?.lastName ?? lastName)
      setEmail(res?.email ?? email)
      setPhone(res?.phoneNumber ?? phone)
      toast.success("Profil uğurla yeniləndi")
    } catch (err: any) {
      console.error(err)
      toast.error(err?.message || err?.toString() || "Xəta baş verdi")
    } finally {
      setLoading(false)
    }
  }

  async function handleChangePassword() {
    if (!currentPassword || !newPassword) {
      toast.warn("Hər iki şifrəni doldurun")
      return
    }
    if (newPassword !== confirmPassword) {
      toast.warn("Yeni şifrə və təsdiq uyğun deyil")
      return
    }
    setLoading(true)
    try {
      const body = {
        currentPassword,
        newPassword,
      }

      const res = await apiClient.updatePassword(body)

      toast.success("Şifrə uğurla yeniləndi")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (err: any) {
      console.error(err)
      toast.error(err?.message || err?.toString() || "Xəta baş verdi")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="container mx-auto px-4 py-8">
        <div className="animate-fadeIn">
          <div className="flex items-center gap-3 mb-8">
            <Settings className="h-8 w-8 text-purple-600" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {getTranslation(language, "settings")}
            </h1>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Profil
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Təhlükəsizlik
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="animate-slideInUp">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Profil Məlumatları
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-6">
                    <div className="relative group">
                      <Avatar className="h-24 w-24">
                        <AvatarFallback>
                          {`${profileData?.firstName?.[0]?.toUpperCase() || ''}${profileData?.lastName?.[0]?.toUpperCase() || ''}`}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{profileData?.firstName} {profileData?.lastName}</h3>
                      <p className="text-gray-500">{profileData?.email}</p>
                      <Badge variant="secondary" className="mt-2 uppercase">
                        {profileData?.role} İstifadəçi
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Ad</Label>
                      <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Soyad</Label>
                      <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefon</Label>
                      <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
                    </div>
                  </div>

                  <Button className="w-full" onClick={handleSaveProfile} disabled={loading}>
                    <Save className="h-4 w-4 mr-2" />
                    Dəyişiklikləri Saxla
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="animate-slideInUp">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Təhlükəsizlik Tənzimləmələri
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Cari Şifrə</Label>
                      <div className="relative">
                        <Input id="currentPassword" type={showPassword ? "text" : "password"} placeholder="Cari şifrənizi daxil edin" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                        <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3" onClick={() => setShowPassword(!showPassword)}>
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newPassword">Yeni Şifrə</Label>
                      <div className="relative">
                        <Input id="newPassword" type={showNewPassword ? "text" : "password"} placeholder="Yeni şifrənizi daxil edin" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                        <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3" onClick={() => setNewShowPassword(!showNewPassword)}>
                          {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">Şifrəni Təsdiqlə</Label>
                      <div className="relative">
                        <Input id="newPassword" type={showConfirmPassword ? "text" : "password"} placeholder="Yeni şifrənizi təkrar daxil edin" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                        <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3" onClick={() => setshowConfirmPassword(!showConfirmPassword)}>
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                  <Button className="w-full" onClick={handleChangePassword} disabled={loading}>
                    <Save className="h-4 w-4 mr-2" />
                    Şifrəni Yenilə
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  )
}
