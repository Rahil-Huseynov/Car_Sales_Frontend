"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Heart,
  Eye,
  Phone,
  Mail,
  MapPin,
  Car,
  Users,
  Fuel,
  Camera,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Share2,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { useLanguage } from "@/hooks/use-language"
import { getTranslation } from "@/lib/i18n"
const favoriteCars = [
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
      "/placeholder.svg?height=200&width=300&text=BMW+X5+Back",
      "/placeholder.svg?height=200&width=300&text=BMW+X5+Engine",
    ],
    featured: true,
    condition: "new",
    addedToFavorites: "2024-01-15",
  },
  {
    id: 3,
    brand: "Toyota",
    model: "Camry",
    year: 2023,
    price: 45000,
    mileage: 5000,
    fuel: "hybrid",
    transmission: "automatic",
    color: "silver",
    location: "ganja",
    images: [
      "/placeholder.svg?height=200&width=300&text=Toyota+Camry+Front",
      "/placeholder.svg?height=200&width=300&text=Toyota+Camry+Side",
      "/placeholder.svg?height=200&width=300&text=Toyota+Camry+Interior",
      "/placeholder.svg?height=200&width=300&text=Toyota+Camry+Back",
      "/placeholder.svg?height=200&width=300&text=Toyota+Camry+Engine",
    ],
    featured: true,
    condition: "new",
    addedToFavorites: "2024-01-10",
  },
  {
    id: 7,
    brand: "BMW",
    model: "3 Series",
    year: 2023,
    price: 95000,
    mileage: 8000,
    fuel: "gasoline",
    transmission: "automatic",
    color: "white",
    location: "baku",
    images: [
      "/placeholder.svg?height=200&width=300&text=BMW+3+Series+Front",
      "/placeholder.svg?height=200&width=300&text=BMW+3+Series+Side",
      "/placeholder.svg?height=200&width=300&text=BMW+3+Series+Interior",
      "/placeholder.svg?height=200&width=300&text=BMW+3+Series+Back",
      "/placeholder.svg?height=200&width=300&text=BMW+3+Series+Engine",
    ],
    featured: true,
    condition: "new",
    addedToFavorites: "2024-01-08",
  },
]

function FavoriteCarCard({
  car,
  onRemove,
  index,
}: { car: (typeof favoriteCars)[0]; onRemove: (id: number) => void; index: number }) {
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
    setCurrentImageIndex((prev) => (prev + 1) % car.images.length)
  }

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev - 1 + car.images.length) % car.images.length)
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
            src={car.images[currentImageIndex] || "/placeholder.svg"}
            alt={`${car.brand} ${car.model}`}
            width={300}
            height={200}
            className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </div>

        {car.featured && (
          <Badge className="absolute top-3 left-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 z-10">
            {t("featured")}
          </Badge>
        )}

        {car.images.length > 1 && (
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
              className="absolute right-12 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 h-8 w-8"
              onClick={nextImage}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}

        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1">
          {car.images.map((_, imgIndex) => (
            <button
              key={imgIndex}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                imgIndex === currentImageIndex ? "bg-white scale-125" : "bg-white/50"
              }`}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setCurrentImageIndex(imgIndex)
              }}
            />
          ))}
        </div>

        <div className="absolute bottom-3 left-3 bg-black/70 text-white px-2 py-1 rounded-md text-xs flex items-center gap-1">
          <Camera className="h-3 w-3" />
          {currentImageIndex + 1}/{car.images.length}
        </div>

        <div className="absolute top-3 right-3 flex gap-2">
          <Button
            size="icon"
            variant="ghost"
            className="bg-white/90 hover:bg-white backdrop-blur-sm z-10 transition-all duration-300 hover:scale-110"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
            }}
          >
            <Share2 className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="bg-red-500/90 hover:bg-red-600 text-white backdrop-blur-sm z-10 transition-all duration-300 hover:scale-110"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onRemove(car.id)
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-lg text-gray-800">
              {car.brand} {car.model}
            </h3>
            <p className="text-sm text-gray-600">
              {car.year} • {t(car.condition)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {t("addedOn")}: {new Date(car.addedToFavorites).toLocaleDateString()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
              {car.price.toLocaleString()} ₼
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-1">
            <Car className="h-4 w-4 text-blue-500" />
            {car.mileage.toLocaleString()} km
          </div>
          <div className="flex items-center gap-1">
            <Fuel className="h-4 w-4 text-blue-500" />
            {t(car.fuel)}
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4 text-blue-500" />
            {t(car.transmission)}
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4 text-blue-500" />
            {t(car.location)}
          </div>
        </div>
        <Badge variant="outline" className="mb-2 border-blue-200 text-blue-600">
          {t(car.color)}
        </Badge>
      </CardContent>

      <CardFooter className="pt-0 gap-2">
        <Button
          asChild
          className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 btn-animate"
        >
          <Link href={`/cars/${car.id}`}>
            <Eye className="h-4 w-4 mr-2" />
            {t("details")}
          </Link>
        </Button>
        <Button variant="outline" size="icon" className="border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent">
          <Phone className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" className="border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent">
          <Mail className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}

export default function FavoritesPage() {
  const { language } = useLanguage()
  const t = (key: string) => getTranslation(language, key)
  const [favorites, setFavorites] = useState(favoriteCars)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  const removeFavorite = (id: number) => {
    setFavorites(favorites.filter((car) => car.id !== id))
  }

  const clearAllFavorites = () => {
    setFavorites([])
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
      <section className="bg-gradient-to-br from-red-500 via-red-600 to-red-700 text-white py-12 md:py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-400/10 to-transparent"></div>
        <div className="absolute top-10 right-10 w-32 h-32 bg-red-400/10 rounded-full blur-xl animate-pulse-slow"></div>
        <div className="absolute bottom-10 left-10 w-24 h-24 bg-red-300/10 rounded-full blur-lg animate-bounce-slow"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="hero-title">
              <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
                <Heart className="h-8 w-8 text-red-200" />
                {t("favorites")}
              </h1>
              <p className="text-red-100">{t("favoritesSubtitle")}</p>
            </div>
            {favorites.length > 0 && (
              <div className="hero-search">
                <Button
                  variant="outline"
                  onClick={clearAllFavorites}
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {t("clearAll")}
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {favorites.length === 0 ? (
          <div className="text-center py-16 animate-fadeInUp">
            <Heart className="h-24 w-24 mx-auto text-gray-300 mb-6" />
            <h2 className="text-2xl font-bold text-gray-600 mb-4">{t("noFavorites")}</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">{t("noFavoritesDesc")}</p>
            <Button
              asChild
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            >
              <Link href="/cars">
                <Car className="h-4 w-4 mr-2" />
                {t("browseCars")}
              </Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6 animate-fadeInUp">
              <h2 className="text-2xl font-bold text-gray-800">
                {favorites.length} {t("favoriteCars")}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((car, index) => (
                <FavoriteCarCard key={car.id} car={car} onRemove={removeFavorite} index={index} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
