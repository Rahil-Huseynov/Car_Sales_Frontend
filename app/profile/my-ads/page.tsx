"use client"

import React, { useEffect, useState } from "react"
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
import { useLanguage } from "@/hooks/use-language"
import { getTranslation } from "@/lib/i18n"
import { apiClient } from "@/lib/api-client"
import { logout } from "@/actions/auth"

type RawCarImage = { id?: number; url?: string } | string

type RawUserCar = {
  id: number
  brand: string
  model: string
  year: number
  price: number
  mileage: number
  fuel?: string
  transmission?: string
  color?: string
  location?: string | null
  city?: string | null
  images?: RawCarImage[]
  condition?: string
  status?: string
  createdAt?: string
  views?: number
  calls?: number
  messages?: number
  description?: string
}

type CarAd = {
  id: number
  brand: string
  model: string
  year: number
  price: number
  mileage: number
  fuel: string
  transmission: string
  color: string
  location: string | null
  city?: string | null
  images: string[]
  condition: string
  status: string
  createdAt?: string
  views: number
  calls: number
  messages: number
  description?: string
}

const buildImageUrl = (maybe: RawCarImage | undefined): string | null => {
  if (!maybe) return null
  if (typeof maybe === "string") {
    if (!maybe) return null
    if (maybe.startsWith("http")) return maybe
    return `${process.env.NEXT_PUBLIC_API_URL_FOR_IMAGE}${maybe}`
  } else {
    const url = maybe.url ?? ""
    if (!url) return null
    if (url.startsWith("http")) return url
    return `${process.env.NEXT_PUBLIC_API_URL_FOR_IMAGE}${url}`
  }
}

function AdCard({
  ad,
  onEdit,
  onDelete,
  index,
}: {
  ad: CarAd
  onEdit: (id: number) => void
  onDelete: (id: number) => void
  index: number
}) {
  const { language } = useLanguage()
  const t = (key: string): string => {
    const val = getTranslation(language, key)
    return typeof val === "string" ? val : key
  }
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), index * 80)
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

  const getStatusColor = (status: CarAd["status"]) => {
    switch (status) {
      case "Standart":
        return "bg-green-100 text-green-800 border-green-200"
      case "Premium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: CarAd["status"]) => {
    switch (status) {
      case "Standart":
        return <CheckCircle className="h-3 w-3" />
      case "Premium":
        return <Clock className="h-3 w-3" />
      default:
        return <XCircle className="h-3 w-3" />
    }
  }

  const imageSrc = ad.images.length > 0 ? ad.images[currentImageIndex] : "/placeholder.svg"
  const isRemote = imageSrc.startsWith("http")

  return (
    <Card
      className={`overflow-hidden card-hover border-0 bg-white/90 backdrop-blur-sm transition-all duration-500 ${isLoaded ? "animate-fadeInUp opacity-100" : "opacity-0"
        }`}
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="relative group">
        <div className="overflow-hidden">
          <Image
            src={imageSrc}
            alt={`${ad.brand} ${ad.model}`}
            width={600}
            height={400}
            className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-110"
            unoptimized={isRemote}
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
          {currentImageIndex + 1}/{Math.max(1, ad.images.length)}
        </div>
      </div>

      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-lg text-gray-800">
              {ad.brand} {ad.model}
            </h3>
            <p className="text-sm text-gray-600">
              {ad.year} • {t(ad.condition ?? "unknown")}
            </p>
            {ad.createdAt && (
              <p className="text-xs text-gray-500 mt-1">
                {t("createdOn")}: {new Date(ad.createdAt).toLocaleDateString()}
              </p>
            )}
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
            {t(ad.fuel || "unknown")}
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4 text-blue-500" />
            {t(ad.transmission || "unknown")}
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4 text-blue-500" />
            {ad.location ?? ad.city ?? t("unknown")}
          </div>
        </div>

        <Badge variant="outline" className="mb-2 border-blue-200 text-blue-600">
          {t(ad.color || "unknown")}
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
  const t = (key: string): string => {
    const val = getTranslation(language, key)
    return typeof val === "string" ? val : key
  }
  const [ads, setAds] = useState<CarAd[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"all" | "Standart" | "Premium">("all")

  useEffect(() => {
    const fetch = async () => {
      try {
        const profile = await apiClient.getCurrentUser()
        const rawCars: RawUserCar[] = profile?.userCars ?? []

        const normalized: CarAd[] = rawCars.map((c): CarAd => {
          const images: string[] =
            (c.images ?? [])
              .map((img) => buildImageUrl(img))
              .filter(Boolean) as string[]

          if (images.length === 0) images.push("/placeholder.svg")

          const status = c.status ?? "Standart"

          return {
            id: c.id,
            brand: c.brand || "",
            model: c.model || "",
            year: c.year || new Date().getFullYear(),
            price: c.price ?? 0,
            mileage: c.mileage ?? 0,
            fuel: c.fuel ?? "",
            transmission: c.transmission ?? "",
            color: c.color ?? "",
            location: c.location ?? null,
            city: c.city ?? null,
            images,
            condition: c.condition ?? "unknown",
            status,
            createdAt: c.createdAt,
            views: c.views ?? 0,
            calls: c.calls ?? 0,
            messages: c.messages ?? 0,
            description: c.description,
          }
        })

        setAds(normalized)
      } catch (err) {
        console.error("Failed to load profile or cars", err)
        setAds([])
      } finally {
        setIsLoading(false)
      }
    }

    fetch()
  }, [])

  const handleEdit = (id: number) => console.log("Edit ad:", id)
  const handleDelete = (id: number) => setAds((prev) => prev.filter((a) => a.id !== id))

  const filteredAds = ads.filter((ad) => (activeTab === "all" ? true : ad.status === activeTab))
  const getTabCount = (status: "all" | "Standart" | "Premium") =>
    status === "all" ? ads.length : ads.filter((a) => a.status === status).length

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <p className="text-gray-400 text-lg">{t("loading")}...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-br from-green-500 via-green-600 to-green-700 text-white py-12 md:py-16 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10 flex justify-between items-center">
          <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-green-200" />
            {t("myAds")}
          </h1>
          <Button asChild className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm">
            <Link href="/sell">
              <Plus className="h-4 w-4 mr-2" />
              {t("Yeni elan")}
            </Link>
          </Button>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "all" | "Standart" | "Premium")} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="all" className="flex items-center gap-2">
              {t("all")} ({getTabCount("all")})
            </TabsTrigger>
            <TabsTrigger value="Standart" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              {t("Standart")} ({getTabCount("Standart")})
            </TabsTrigger>
            <TabsTrigger value="Premium" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {t("Premium")} ({getTabCount("Premium")})
            </TabsTrigger>
            <TabsTrigger value="all" className="invisible" />
          </TabsList>

          <TabsContent value={activeTab}>
            {filteredAds.length === 0 ? (
              <div className="text-center py-16 animate-fadeInUp">
                <BarChart3 className="h-24 w-24 mx-auto text-gray-300 mb-6" />
                <h2 className="text-2xl font-bold text-gray-600 mb-4">{t("Elan Yoxdur")}</h2>
                <Button asChild className="bg-gradient-to-r from-green-600 to-green-700">
                  <Link href="/sell">
                    <Plus className="h-4 w-4 mr-2" />
                    {t("Elan əlavə et")}
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
