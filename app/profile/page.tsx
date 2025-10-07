"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { apiClient } from "@/lib/api-client"
import { useAuth } from "@/lib/auth-context"
import { getTranslation, translateString } from "@/lib/i18n"
import { useLanguage } from "@/hooks/use-language"
import { useDefaultLanguage } from "@/components/useLanguage"

type CarImage = {
  id: number
  url: string
}

type UserCar = {
  id: number
  createdAt: string
  updatedAt: string
  brand?: string
  model?: string
  year?: number
  price?: number
  mileage?: number
  fuel?: string
  transmission?: string
  condition?: string
  color?: string
  location?: string
  city?: string
  description?: string
  features?: string[]
  name?: string
  phone?: string
  email?: string
  status?: string
  views?: number
  images?: CarImage[]
}

type User = {
  id: number
  firstName?: string
  lastName?: string
  email?: string
  phoneNumber?: string
  phoneCode?: string
  role?: string
  createdAt?: string
  userCars?: UserCar[]
}

export default function ProfilePage() {
  const [profileData, setProfileData] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [favoriteCars, setFavoriteCars] = useState<UserCar[]>([])
  const { logout } = useAuth()
  const { language } = useLanguage()
  const { lang, setLang } = useDefaultLanguage();
  const t = (key: string) => translateString(lang, key);

  const locale = language || "en-US"

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await apiClient.getCurrentUser()
        setProfileData(data)
        setFavoriteCars([])
      } catch {
        logout()
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [logout])

  const IMAGE_BASE = (process.env.NEXT_PUBLIC_API_URL_FOR_IMAGE ?? "").replace(/\/+$/, "")

  const getCarImageUrl = (car: UserCar) => {
    const imgs = car.images ?? []
    if (imgs.length === 0) return "/placeholder.svg"
    const raw = imgs[0].url ?? ""
    if (!raw) return "/placeholder.svg"
    if (/^https?:\/\//i.test(raw)) return raw
    const cleaned = raw.replace(/^\/?uploads\/?/, "").replace(/^\/+/, "")
    return IMAGE_BASE ? `${IMAGE_BASE}/${cleaned}` : `/${cleaned}`
  }

  if (loading) return <p>{t("common.loading")}</p>
  if (!profileData) return <p>{t("common.userNotFound")}</p>

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 md:gap-8">
          <div className="lg:col-span-4">
            <Tabs defaultValue="profile" className="space-y-6">
              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <CardTitle>{t("profile.title")}</CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">{t("label.firstName")}</Label>
                        <Input id="firstName" value={profileData.firstName ?? ""} disabled />
                      </div>

                      <div>
                        <Label htmlFor="lastName">{t("label.lastName")}</Label>
                        <Input id="lastName" value={profileData.lastName ?? ""} disabled />
                      </div>

                      <div>
                        <Label htmlFor="email">{t("label.email")}</Label>
                        <Input id="email" type="email" value={profileData.email ?? ""} disabled />
                      </div>

                      <div>
                        <Label htmlFor="phone">{t("label.phone")}</Label>
                        <Input id="phone" value={`${profileData!.phoneCode ?? ""}${profileData!.phoneNumber ?? ""}`} disabled />
                      </div>

                      <div>
                        <Label htmlFor="createdAt">{t("label.createdAt")}</Label>
                        <Input
                          id="createdAt"
                          value={
                            profileData.createdAt
                              ? new Date(profileData.createdAt).toLocaleString(locale, {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: false,
                              })
                              : ""
                          }
                          disabled
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
