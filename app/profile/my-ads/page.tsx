"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Eye,
  Edit,
  Trash2,
  Plus,
  MapPin,
  Car,
  Users,
  Fuel,
  Camera,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle,
  XCircle,
  BarChart3,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { useLanguage } from "@/hooks/use-language"
import { getTranslation } from "@/lib/i18n"
const userAds = [
  {
    id: 1,
    brand: "BMW",
    model: "X5",
    year: 2022,
    price: 85000,
    mileage: 15000,
    fuel: "gasoline",
    transmission: "automatic",
    color: "black",
    location: "baku",
    images: [
      "/placeholder.svg?height=200&width=300&text=BMW+X5+Front",
      "/placeholder.svg?height=200&width=300&text=BMW+X5+Side",
      "/placeholder.svg?height=200&width=300&text=BMW+X5+Interior",
    ],
    condition: "new",
    status: "active",
    createdAt: "2024-01-15",
    views: 245,
    calls: 12,
    messages: 8,
  },
  {
    id: 2,
    brand: "Mercedes",
    model: "C-Class",
    year: 2021,
    price: 65000,
    mileage: 25000,
    fuel: "gasoline",
    transmission: "automatic",
    color: "white",
    location: "baku",
    images: [
      "/placeholder.svg?height=200&width=300&text=Mercedes+C+Front",
      "/placeholder.svg?height=200&width=300&text=Mercedes+C+Side",
    ],
    condition: "used",
    status: "pending",
    createdAt: "2024-01-10",
    views: 89,
    calls: 3,
    messages: 2,
  },
  {
    id: 3,
    brand: "Toyota",
    model: "Camry",
    year: 2020,
    price: 35000,
    mileage: 45000,
    fuel: "gasoline",
    transmission: "automatic",
    color: "silver",
    location: "ganja",
    images: ["/placeholder.svg?height=200&width=300&text=Toyota+Camry+Front"],
    condition: "used",
    status: "sold",
    createdAt: "2024-01-05",
    views: 156,
    calls: 18,
    messages: 15,
  },
]

function AdCard({
  ad,
  onEdit,
  onDelete,
  index,
}: {
  ad: (typeof userAds)[0]
  onEdit: (id: number) => void
  onDelete: (id: number) => void
  index: number
}) {
  const { language } = useLanguage()
  const t = (key: string) => getTranslation(language, key)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), index * 100)
    return () => clearTimeout(timer)
  }, [index])

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev + 1) % ad.images.length)
  }

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev - 1 + ad.images.length) % ad.images.length)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "sold":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-3 w-3" />
      case "pending":
        return <Clock className="h-3 w-3" />
      case "sold":
        return <XCircle className="h-3 w-3" />
      default:
        return <Clock className="h-3 w-3" />
    }
  }

  return (
    <Card
      className={`overflow-hidden card-hover border-0 bg-white/90 backdrop-blur-sm transition-all duration-500 ${
        isLoaded ? "animate-fadeInUp opacity-100" : "opacity-0"
      }`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="relative group">
        <div className="overflow-hidden">
          <Image
            src={ad.images[currentImageIndex] || "/placeholder.svg"}
            alt={`${ad.brand} ${ad.model}`}
            width={300}
            height={200}
            className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </div>

        <Badge className={`absolute top-3 left-3 ${getStatusColor(ad.status)} z-10 flex items-center gap-1`}>
          {getStatusIcon(ad.status)}
          {t(ad.status)}
        </Badge>

        {ad.images.length > 1 && (
          <>
            <Button
              size="icon"
              variant="ghost"
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 h-8 w-8"
              onClick={prevImage}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <Button
              size="icon"
              variant="ghost"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 h-8 w-8"
              onClick={nextImage}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}

        <div className="absolute bottom-3 left-3 bg-black/70 text-white px-2 py-1 rounded-md text-xs flex items-center gap-1">
          <Camera className="h-3 w-3" />
          {currentImageIndex + 1}/{ad.images.length}
        </div>
      </div>

      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-lg text-gray-800">
              {ad.brand} {ad.model}
            </h3>
            <p className="text-sm text-gray-600">
              {ad.year} • {t(ad.condition)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {t("createdOn")}: {new Date(ad.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
              {ad.price.toLocaleString()} ₼
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-1">
            <Car className="h-4 w-4 text-blue-500" />
            {ad.mileage.toLocaleString()} km
          </div>
          <div className="flex items-center gap-1">
            <Fuel className="h-4 w-4 text-blue-500" />
            {t(ad.fuel)}
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4 text-blue-500" />
            {t(ad.transmission)}
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4 text-blue-500" />
            {t(ad.location)}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="text-center">
            <p className="text-lg font-bold text-blue-600">{ad.views}</p>
            <p className="text-xs text-gray-500">{t("views")}</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-green-600">{ad.calls}</p>
            <p className="text-xs text-gray-500">{t("calls")}</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-purple-600">{ad.messages}</p>
            <p className="text-xs text-gray-500">{t("messages")}</p>
          </div>
        </div>

        <Badge variant="outline" className="mb-2 border-blue-200 text-blue-600">
          {t(ad.color)}
        </Badge>
      </CardContent>

      <CardFooter className="pt-0 gap-2">
        <Button
          asChild
          variant="outline"
          className="flex-1 border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent"
        >
          <Link href={`/cars/${ad.id}`}>
            <Eye className="h-4 w-4 mr-2" />
            {t("view")}
          </Link>
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="border-green-200 text-green-600 hover:bg-green-50 bg-transparent"
          onClick={() => onEdit(ad.id)}
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="border-red-200 text-red-600 hover:bg-red-50 bg-transparent"
          onClick={() => onDelete(ad.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}

export default function MyAdsPage() {
  const { language } = useLanguage()
  const t = (key: string) => getTranslation(language, key)
  const [ads, setAds] = useState(userAds)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  const handleEdit = (id: number) => {
    console.log("Edit ad:", id)
  }

  const handleDelete = (id: number) => {
    setAds(ads.filter((ad) => ad.id !== id))
  }

  const filteredAds = ads.filter((ad) => {
    if (activeTab === "all") return true
    return ad.status === activeTab
  })

  const getTabCount = (status: string) => {
    if (status === "all") return ads.length
    return ads.filter((ad) => ad.status === status).length
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-lg p-4">
                  <div className="h-48 bg-gray-300 rounded mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-br from-green-500 via-green-600 to-green-700 text-white py-12 md:py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 to-transparent"></div>
        <div className="absolute top-10 right-10 w-32 h-32 bg-green-400/10 rounded-full blur-xl animate-pulse-slow"></div>
        <div className="absolute bottom-10 left-10 w-24 h-24 bg-green-300/10 rounded-full blur-lg animate-bounce-slow"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="hero-title">
              <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
                <BarChart3 className="h-8 w-8 text-green-200" />
                {t("myAds")}
              </h1>
              <p className="text-green-100">{t("myAdsSubtitle")}</p>
            </div>
            <div className="hero-search">
              <Button
                asChild
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm btn-animate"
              >
                <Link href="/sell">
                  <Plus className="h-4 w-4 mr-2" />
                  {t("postNewAd")}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="all" className="flex items-center gap-2">
              {t("all")} ({getTabCount("all")})
            </TabsTrigger>
            <TabsTrigger value="active" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              {t("active")} ({getTabCount("active")})
            </TabsTrigger>
            <TabsTrigger value="pending" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {t("pending")} ({getTabCount("pending")})
            </TabsTrigger>
            <TabsTrigger value="sold" className="flex items-center gap-2">
              <XCircle className="h-4 w-4" />
              {t("sold")} ({getTabCount("sold")})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            {filteredAds.length === 0 ? (
              <div className="text-center py-16 animate-fadeInUp">
                <BarChart3 className="h-24 w-24 mx-auto text-gray-300 mb-6" />
                <h2 className="text-2xl font-bold text-gray-600 mb-4">{t("noAds")}</h2>
                <p className="text-gray-500 mb-8 max-w-md mx-auto">{t("noAdsDesc")}</p>
                <Button
                  asChild
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                >
                  <Link href="/sell">
                    <Plus className="h-4 w-4 mr-2" />
                    {t("postFirstAd")}
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAds.map((ad, index) => (
                  <AdCard key={ad.id} ad={ad} onEdit={handleEdit} onDelete={handleDelete} index={index} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
