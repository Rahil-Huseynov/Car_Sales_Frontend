"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Phone, Heart, Edit, Eye } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { apiClient } from "@/lib/api-client"
import { useAuth } from "@/lib/auth-context"

type CarImage = {
  id: number
  url: string
}

type UserCar = {
  id: number
  createdAt: string
  updatedAt: string
  brand: string
  model: string
  year: number
  price: number
  mileage: number
  fuel: string
  transmission: string
  condition: string
  color: string
  location: string
  city: string
  description: string
  features: string[]
  name: string
  phone: string
  email: string
  status: string
  views: number
  images: CarImage[]
}

type User = {
  id: number
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  role: string
  createdAt: string
  userCars: UserCar[]
}

export default function ProfilePage() {
  const [profileData, setProfileData] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [favoriteCars, setFavoriteCars] = useState<UserCar[]>([])
  const { logout } = useAuth()

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

  const getCarImageUrl = (car: UserCar) => {
  if (!car.images || car.images.length === 0) return "/placeholder.svg";
  return `${process.env.NEXT_PUBLIC_API_URL_FOR_IMAGE}${car.images[0].url}`;
};


  if (loading) return <p>Yüklənir...</p>
  if (!profileData) return <p>İstifadəçi məlumatı tapılmadı</p>

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 md:gap-8">
          <div className="lg:col-span-4">
            <Tabs defaultValue="profile" className="space-y-6">
              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <CardTitle>Profil məlumatları</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">Ad</Label>
                        <Input id="firstName" value={profileData.firstName} disabled />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Soyad</Label>
                        <Input id="lastName" value={profileData.lastName} disabled />
                      </div>
                      <div>
                        <Label htmlFor="email">E-mail</Label>
                        <Input id="email" type="email" value={profileData.email} disabled />
                      </div>
                      <div>
                        <Label htmlFor="phone">Telefon</Label>
                        <Input id="phone" value={profileData.phoneNumber} disabled />
                      </div>
                      <div>
                        <Label htmlFor="createdAt">Qeydiyyat tarixi</Label>
                        <Input
                          id="createdAt"
                          value={new Date(profileData.createdAt).toLocaleString("az-AZ", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                          })}
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
