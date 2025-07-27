"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Phone, MapPin, Calendar, Heart, Edit, Save, Eye } from "lucide-react"
import { Navbar } from "@/components/navbar"
import Link from "next/link"
import Image from "next/image"

const userData = {
  name: "Əli Məmmədov",
  email: "ali@example.com",
  phone: "+994 50 123 45 67",
  location: "Bakı, Azərbaycan",
  joinDate: "2024-01-15",
  avatar: "/placeholder.svg?height=100&width=100",
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
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState(userData)

  const handleSave = () => {
    setIsEditing(false)
    console.log("Profil yeniləndi:", profileData)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 md:gap-8">
          <div className="xl:col-span-1">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <Avatar className="w-24 h-24 mx-auto mb-4">
                    <AvatarImage src={profileData.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {profileData.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-bold">{profileData.name}</h2>
                  <p className="text-gray-600">{profileData.email}</p>
                  <div className="flex items-center justify-center gap-1 text-sm text-gray-500 mt-2">
                    <Calendar className="h-4 w-4" />
                    {profileData.joinDate} tarixindən bəri üzv
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-gray-500" />
                    {profileData.phone}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    {profileData.location}
                  </div>
                </div>

                <Button
                  className="w-full mt-6"
                  variant={isEditing ? "default" : "outline"}
                  onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                >
                  {isEditing ? (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Yadda saxla
                    </>
                  ) : (
                    <>
                      <Edit className="h-4 w-4 mr-2" />
                      Profili redaktə et
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
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
                        <Label htmlFor="name">Ad Soyad</Label>
                        <Input
                          id="name"
                          value={profileData.name}
                          onChange={(e) => setProfileData((prev) => ({ ...prev, name: e.target.value }))}
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">E-mail</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData((prev) => ({ ...prev, email: e.target.value }))}
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Telefon</Label>
                        <Input
                          id="phone"
                          value={profileData.phone}
                          onChange={(e) => setProfileData((prev) => ({ ...prev, phone: e.target.value }))}
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <Label htmlFor="location">Yer</Label>
                        <Input
                          id="location"
                          value={profileData.location}
                          onChange={(e) => setProfileData((prev) => ({ ...prev, location: e.target.value }))}
                          disabled={!isEditing}
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
                              className={`absolute top-2 right-2 ${
                                car.status === "Aktiv"
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
