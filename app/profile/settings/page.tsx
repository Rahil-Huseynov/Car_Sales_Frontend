"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Settings, User, Shield, Save, Eye, EyeOff, Phone } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"
import { getTranslation, translateString } from "@/lib/i18n"
import apiClient from "@/lib/api-client"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useAuth } from "@/lib/auth-context"
import CountryCodeSelect from "@/components/CountryCodeSelect"
import { useDefaultLanguage } from "@/components/useLanguage"
import { findTranslationFromList } from "@/app/cars/[id]/page"
import { role } from "@/lib/car-data"

type User = {
  id: number
  firstName?: string
  lastName?: string
  email?: string
  phoneNumber?: string
  phoneCode?: string
  role?: string
  createdAt?: string
}

export default function SettingsPage() {
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
  const [phoneCode, setPhoneCode] = useState<string>("")
  const { lang, setLang } = useDefaultLanguage();
  const t = (key: string) => translateString(lang, key);

  const locale = lang || "en-US"

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
        toast.error(t("errorFetchingUser"))
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
    const interval = setInterval(fetchUser, 10000)
    return () => clearInterval(interval)

  }, [logout, lang])

  useEffect(() => {
    if (profileData) {
      setPhoneCode(profileData.phoneCode ?? "")
    }
  }, [profileData])

  async function handleSaveProfile() {
    if (!userId) {
      toast.error(t("userIdNotFound"))
      return
    }
    setLoading(true)
    try {
      const body = { firstName, lastName, email, phoneNumber: phone, phoneCode: phoneCode }
      const res = await apiClient.updateUser(String(userId), body)
      setProfileData(res)
      toast.success(t("profileUpdated"))
    } catch (err: any) {
      console.error(err)
      toast.error(t("errorOccurred"))
    } finally {
      setLoading(false)
    }
  }

  async function handleChangePassword() {
    if (!currentPassword || !newPassword) {
      toast.warn(t("fillBothPasswords"))
      return
    }
    if (newPassword !== confirmPassword) {
      toast.warn(t("passwordMismatch"))
      return
    }
    setLoading(true)
    try {
      const body = { currentPassword, newPassword }
      await apiClient.updatePassword(body)
      toast.success(t("passwordUpdated"))
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (err: any) {
      console.error(err)
      toast.error(t("errorOccurred"))
    } finally {
      setLoading(false)
    }
  }

  const roleLabel = findTranslationFromList(role as any[], profileData?.role ?? "", lang) || (profileData?.role ?? "");
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="container mx-auto px-4 py-8">
        <div className="animate-fadeIn">
          <div className="flex items-center gap-3 mb-8">
            <Settings className="h-8 w-8 text-purple-600" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {t("settings")}
            </h1>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {t("profile")}
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                {t("security")}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="animate-slideInUp">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    {t("profileInfo")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:flex items-center gap-6">
                    <div className="relative group">
                      <Avatar className="h-24 w-24">
                        <AvatarFallback>
                          {`${profileData?.firstName?.[0]?.toUpperCase() || ""}${profileData?.lastName?.[0]?.toUpperCase() || ""}`}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold break-words">
                        {profileData?.firstName} {profileData?.lastName}
                      </h3>
                      <p className="text-gray-500 break-all">{profileData?.email}</p>
                      <Badge variant="secondary" className="mt-2 uppercase">
                        {roleLabel} {t("user")}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">{t("firstName")}</Label>
                      <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">{t("lastName")}</Label>
                      <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">{t("email")}</Label>
                      <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">{t("phone")}</Label>
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
                            placeholder={t("phonePlaceholder")}
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                            className="pl-10"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button className="w-full" onClick={handleSaveProfile} disabled={loading}>
                    <Save className="h-4 w-4 mr-2" />
                    {t("saveChanges")}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="security" className="animate-slideInUp">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    {t("securitySettings")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">{t("currentPassword")}</Label>
                      <div className="relative">
                        <Input
                          id="currentPassword"
                          type={showPassword ? "text" : "password"}
                          placeholder={t("enterCurrentPassword")}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newPassword">{t("newPassword")}</Label>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          type={showNewPassword ? "text" : "password"}
                          placeholder={t("enterNewPassword")}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setNewShowPassword(!showNewPassword)}
                        >
                          {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">{t("confirmPassword")}</Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder={t("confirmNewPassword")}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setshowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                  <Button className="w-full" onClick={handleChangePassword} disabled={loading}>
                    <Save className="h-4 w-4 mr-2" />
                    {t("updatePassword")}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  )
}