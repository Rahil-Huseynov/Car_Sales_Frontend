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

type User = {
  id: number
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  role: string
  createdAt: string
}

const userCars = [
  {
    id: 1,
    brand: "BMW",
    model: "X5",
    year: 2022,
    price: 85000,
    status: "Aktiv",
    views: 234,
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 2,
    brand: "Mercedes",
    model: "C-Class",
    year: 2021,
    price: 65000,
    status: "Satıldı",
    views: 156,
    image: "/placeholder.svg?height=200&width=300",
  },
]
const favoriteCars = [
  {
    id: 3,
    brand: "Toyota",
    model: "Camry",
    year: 2023,
    price: 45000,
    location: "Gəncə",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 4,
    brand: "Audi",
    model: "A4",
    year: 2022,
    price: 72000,
    location: "Bakı",
    image: "/placeholder.svg?height=200&width=300",
  },
]

export default function ProfilePage() {
  const [profileData, setProfileData] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const { logout } = useAuth()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await apiClient.getCurrentUser()
        setProfileData(data)
      } catch {
        logout()
        window.location.reload()
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [logout])




  if (loading) return <p>Yüklənir...</p>
  if (!profileData) return <p>İstifadəçi məlumatı tapılmadı</p>


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 md:gap-8">
          <div className="lg:col-span-4">
            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3">
                <TabsTrigger value="profile">Profil məlumatları</TabsTrigger>
                <TabsTrigger value="my-cars">Mənim elanlarım</TabsTrigger>
                <TabsTrigger value="favorites">Seçilmişlər</TabsTrigger>
              </TabsList>

              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <CardTitle>Profil məlumatları</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Ad</Label>
                        <Input
                          id="name"
                          value={profileData.firstName}
                          disabled
                        />
                      </div>
                      <div>
                        <Label htmlFor="name">Soyad</Label>
                        <Input
                          id="name"
                          value={profileData.lastName}
                          disabled
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">E-mail</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profileData.email}
                          disabled
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Telefon</Label>
                        <Input
                          id="phone"
                          value={profileData.phoneNumber}
                          disabled
                        />
                      </div>
                      <div>
                        <Label htmlFor="location">Qeydiyyat tarixi</Label>
                        <Input
                          id="location"
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

              <TabsContent value="my-cars">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Mənim elanlarım ({userCars.length})</CardTitle>
                      <Button asChild>
                        <Link href="/sell">Yeni elan əlavə et</Link>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                      {userCars.map((car) => (
                        <Card key={car.id} className="overflow-hidden">
                          <div className="relative">
                            <Image
                              src={car.image || "/placeholder.svg"}
                              alt={`${car.brand} ${car.model}`}
                              width={300}
                              height={200}
                              className="w-full h-48 object-cover"
                            />
                            <Badge
                              className={`absolute top-2 right-2 ${car.status === "Aktiv"
                                ? "bg-green-500"
                                : car.status === "Satıldı"
                                  ? "bg-blue-500"
                                  : "bg-yellow-500"
                                }`}
                            >
                              {car.status}
                            </Badge>
                          </div>
                          <CardContent className="pt-4">
                            <h3 className="font-bold text-lg">
                              {car.brand} {car.model}
                            </h3>
                            <p className="text-sm text-gray-600 mb-2">{car.year}</p>
                            <p className="text-xl font-bold text-blue-600 mb-3">{car.price.toLocaleString()} ₼</p>
                            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                              <div className="flex items-center gap-1">
                                <Eye className="h-4 w-4" />
                                {car.views} baxış
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                                <Edit className="h-4 w-4 mr-2" />
                                Redaktə et
                              </Button>
                              <Button variant="outline" size="sm" className="flex-1 bg-transparent" asChild>
                                <Link href={`/cars/${car.id}`}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  Bax
                                </Link>
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="favorites">
                <Card>
                  <CardHeader>
                    <CardTitle>Seçilmiş avtomobillər ({favoriteCars.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {favoriteCars.map((car) => (
                        <Card key={car.id} className="overflow-hidden">
                          <div className="relative">
                            <Image
                              src={car.image || "/placeholder.svg"}
                              alt={`${car.brand} ${car.model}`}
                              width={300}
                              height={200}
                              className="w-full h-48 object-cover"
                            />
                            <Button
                              size="icon"
                              variant="ghost"
                              className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                            >
                              <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                            </Button>
                          </div>
                          <CardContent className="pt-4">
                            <h3 className="font-bold text-lg">
                              {car.brand} {car.model}
                            </h3>
                            <p className="text-sm text-gray-600 mb-2">
                              {car.year} • {car.location}
                            </p>
                            <p className="text-xl font-bold text-blue-600 mb-4">{car.price.toLocaleString()} ₼</p>
                            <div className="flex gap-2">
                              <Button className="flex-1" asChild>
                                <Link href={`/cars/${car.id}`}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  Ətraflı bax
                                </Link>
                              </Button>
                              <Button variant="outline" size="icon">
                                <Phone className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
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
