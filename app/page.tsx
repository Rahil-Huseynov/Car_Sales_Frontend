"use client"

import React, { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Filter,
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
  Sparkles,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { useLanguage } from "@/hooks/use-language"
import { getTranslation } from "@/lib/i18n"
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
  description?: string
  features?: string[]
  name?: string
  phone?: string
  email?: string
  status?: string
  views?: number
  images: CarImage[]
}

type User = {
  id: number
  firstName?: string
  lastName?: string
  email?: string
  phoneNumber?: string
  role?: string
  createdAt?: string
  userCars?: UserCar[]
}

function CarCard({ car, t, index }: { car: UserCar; t: (key: string) => string; index: number }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), index * 100)
    return () => clearTimeout(timer)
  }, [index])

const images = car.images && car.images.length > 0
  ? car.images.map((i) => {
      if (!i.url) return "/placeholder.svg";
      return i.url.replace(/^\/?uploads\/?/, "");
    })
  : ["/placeholder.svg"];

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <Card
      className={`overflow-hidden card-hover border-0 bg-white/90 backdrop-blur-sm transition-all duration-500 ${isLoaded ? "animate-fadeInUp opacity-100" : "opacity-0"
        }`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="relative group">
        <div className="overflow-hidden">
          <Image
            src={`${process.env.NEXT_PUBLIC_API_URL_FOR_IMAGE}${images[currentImageIndex]}`}
            alt={`${car.brand} ${car.model}`}
            width={300}
            height={200}
            className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </div>

        {car.status === "premium" && (
          <Badge className="absolute top-3 left-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 z-10 animate-pulse-slow">
            <Sparkles className="h-3 w-3 mr-1" />
            {t("premium")}
          </Badge>
        )}

        {images.length > 1 && (
          <>
            <Button
              size="icon"
              variant="ghost"
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 h-8 w-8 hover:scale-110"
              onClick={prevImage}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <Button
              size="icon"
              variant="ghost"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 h-8 w-8 hover:scale-110"
              onClick={nextImage}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}

        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1">
          {images.map((_, imgIndex) => (
            <button
              key={imgIndex}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${imgIndex === currentImageIndex ? "bg-white scale-125" : "bg-white/50 hover:bg-white/75"
                }`}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setCurrentImageIndex(imgIndex)
              }}
            />
          ))}
        </div>

        <div className="absolute bottom-3 left-3 bg-black/70 text-white px-2 py-1 rounded-md text-xs flex items-center gap-1 backdrop-blur-sm">
          <Camera className="h-3 w-3" />
          {currentImageIndex + 1}/{images.length}
        </div>

        <Button
          size="icon"
          variant="ghost"
          className="absolute top-3 right-3 bg-white/90 hover:bg-white backdrop-blur-sm z-10 transition-all duration-300 hover:scale-110 hover:text-red-500"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
          }}
        >
          <Heart className="h-4 w-4" />
        </Button>
      </div>

      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-lg text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
              {car.brand} {car.model}
            </h3>
            <p className="text-sm text-gray-600">
              {car.year} • {t(car.condition ?? "")}
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
          <div className="flex items-center gap-1 transition-colors duration-300 hover:text-blue-600">
            <Car className="h-4 w-4 text-blue-500" />
            {(car.mileage || 0).toLocaleString()} km
          </div>
          <div className="flex items-center gap-1 transition-colors duration-300 hover:text-blue-600">
            <Fuel className="h-4 w-4 text-blue-500" />
            {t(car.fuel ?? "")}
          </div>
          <div className="flex items-center gap-1 transition-colors duration-300 hover:text-blue-600">
            <Users className="h-4 w-4 text-blue-500" />
            {t(car.transmission ?? "")}
          </div>
          <div className="flex items-center gap-1 transition-colors duration-300 hover:text-blue-600">
            <MapPin className="h-4 w-4 text-blue-500" />
            {t(car.location ?? "")}
          </div>
        </div>
        <Badge
          variant="outline"
          className="mb-2 border-blue-200 text-blue-600 hover:bg-blue-50 transition-colors duration-300"
        >
          {t(car.color ?? "")}
        </Badge>
      </CardContent>

      <CardFooter className="pt-0 gap-2">
        <Button
          asChild
          className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 btn-animate transition-all duration-300 hover:scale-105"
        >
          <Link href={`/cars/${car.id}`}>
            <Eye className="h-4 w-4 mr-2" />
            {t("details")}
          </Link>
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent transition-all duration-300 hover:scale-110"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
          }}
        >
          <Phone className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent transition-all duration-300 hover:scale-110"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
          }}
        >
          <Mail className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}

export default function HomePage() {
  const { language } = useLanguage()
  const t = (key: string) => getTranslation(language, key)
  const { logout } = useAuth()

  const [cars, setCars] = useState<UserCar[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedBrand, setSelectedBrand] = useState<string>("all")
  const [selectedYear, setSelectedYear] = useState<string>("all")
  const [selectedFuel, setSelectedFuel] = useState<string>("all")
  const [selectedTransmission, setSelectedTransmission] = useState<string>("all")
  const [selectedCondition, setSelectedCondition] = useState<string>("all")
  const [priceRange, setPriceRange] = useState({ min: "", max: "" })
  const [selectedModel, setSelectedModel] = useState<string>("all")
  const [selectedCity, setSelectedCity] = useState<string>("all")
  const [selectedColor, setSelectedColor] = useState<string>("all")
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [profileData, setProfileData] = useState<User | null>(null)

useEffect(() => {
  const fetchCars = async () => {
    try {
      const data = await apiClient.getPremiumCars()
      const carsArray = Array.isArray(data) ? data : data.cars ?? []

      const normalizedCars: UserCar[] = carsArray.map((car: any) => ({
        id: car.id,
        brand: car.brand,
        model: car.model,
        year: car.year,
        price: car.price,
        mileage: car.mileage ?? 0,
        fuel: car.fuel ?? "",
        transmission: car.transmission ?? "",
        condition: car.condition ?? "",
        color: car.color ?? "",
        location: car.location ?? car.city ?? "",
        city: car.city ?? "",
        description: car.description ?? "",
        features: car.features ?? [],
        images: car.images?.length ? car.images : [{ id: 0, url: "/placeholder.svg" }],
        status: car.status ?? "",
        name: car.name ?? (car.user ? `${car.user.firstName ?? ""} ${car.user.lastName ?? ""}`.trim() : ""),
        phone: car.phone ?? car.user?.phoneNumber ?? "",
        email: car.email ?? car.user?.email ?? "",
        createdAt: car.createdAt,
        updatedAt: car.updatedAt,
        views: car.views ?? 0,
      }))

      setCars(normalizedCars)
    } catch (err) {
      console.error("Failed to load cars", err)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("accessToken")
      if (!token) return
      const user = await apiClient.getCurrentUser()
      setProfileData(user)
    } catch (err) {
      logout()
    }
  }

  fetchCars()
  fetchProfile()
}, [])

  const brands = useMemo(() => [...new Set(cars.map((c) => c.brand).filter(Boolean))], [cars])
  const years = useMemo(() => [...new Set(cars.map((c) => c.year))].sort((a, b) => b - a), [cars])
  const fuels = useMemo(() => [...new Set(cars.map((c) => c.fuel).filter(Boolean))], [cars])
  const transmissions = useMemo(() => [...new Set(cars.map((c) => c.transmission).filter(Boolean))], [cars])
  const conditions = useMemo(() => [...new Set(cars.map((c) => c.condition).filter(Boolean))], [cars])
  const models = useMemo(() => [...new Set(cars.map((c) => c.model).filter(Boolean))], [cars])
  const cities = useMemo(() => [...new Set(cars.map((c) => c.city).filter(Boolean))], [cars])
  const colors = useMemo(() => [...new Set(cars.map((c) => c.color).filter(Boolean))], [cars])

  const filteredCars = useMemo(() => {
    return cars.filter((car) => {
      const matchesSearch =
        car.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.model.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesBrand = selectedBrand === "all" || !selectedBrand || car.brand === selectedBrand
      const matchesModel = selectedModel === "all" || !selectedModel || car.model === selectedModel
      const matchesYear = selectedYear === "all" || !selectedYear || car.year.toString() === selectedYear
      const matchesFuel = selectedFuel === "all" || !selectedFuel || car.fuel === selectedFuel
      const matchesTransmission =
        selectedTransmission === "all" || !selectedTransmission || car.transmission === selectedTransmission
      const matchesCondition = selectedCondition === "all" || !selectedCondition || car.condition === selectedCondition
      const matchesCity = selectedCity === "all" || !selectedCity || car.city === selectedCity
      const matchesColor = selectedColor === "all" || !selectedColor || car.color === selectedColor
      const matchesPrice =
        (!priceRange.min || car.price >= Number.parseInt(priceRange.min)) &&
        (!priceRange.max || car.price <= Number.parseInt(priceRange.max))

      return (
        matchesSearch &&
        matchesBrand &&
        matchesModel &&
        matchesYear &&
        matchesFuel &&
        matchesTransmission &&
        matchesCondition &&
        matchesCity &&
        matchesColor &&
        matchesPrice
      )
    })
  }, [
    cars,
    searchTerm,
    selectedBrand,
    selectedModel,
    selectedYear,
    selectedFuel,
    selectedTransmission,
    selectedCondition,
    selectedCity,
    selectedColor,
    priceRange,
  ])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 animate-pulse">Yüklənir...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="navbar-slide">
        <Navbar />
      </div>

      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-12 md:py-20 relative overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="hero-title text-3xl md:text-5xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
            {t("heroTitle")}
          </h1>
          <p className="hero-subtitle text-lg md:text-xl mb-6 md:mb-8 text-blue-100">{t("heroSubtitle")}</p>
          <div className="hero-search max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-2.5 top-5 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
              <Input
                placeholder={t("searchPlaceholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-4 text-base md:text-lg bg-white/95 backdrop-blur-sm border-0 shadow-lg search-input rounded-xl"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col xl:flex-row gap-6 md:gap-8">
          <div className="xl:w-1/4 filter-slide">
            <Card className="xl:sticky xl:top-4 shadow-sm border-0 bg-white/80 backdrop-blur-sm hover-lift">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-lg">
                <div className="flex items-center gap-2">
                  <Filter className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-blue-800">{t("filters")}</h3>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <div>
                  <label className="text-sm font-medium mb-2 block text-gray-700">{t("brand")}</label>
                  <Select value={selectedBrand} onValueChange={(v) => setSelectedBrand(v)}>
                    <SelectTrigger className="border-gray-200 focus:border-blue-400 transition-colors duration-300">
                      <SelectValue placeholder={t("selectBrand")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t("all")}</SelectItem>
                      {brands.map((brand) => (
                        <SelectItem key={brand} value={brand}>
                          {brand}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block text-gray-700">{t("model")}</label>
                  <Select value={selectedModel} onValueChange={(v) => setSelectedModel(v)}>
                    <SelectTrigger className="border-gray-200 focus:border-blue-400 transition-colors duration-300">
                      <SelectValue placeholder={t("selectModel")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t("all")}</SelectItem>
                      {models.map((model) => (
                        <SelectItem key={model} value={model}>
                          {model}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block text-gray-700">{t("year")}</label>
                  <Select value={selectedYear} onValueChange={(v) => setSelectedYear(v)}>
                    <SelectTrigger className="border-gray-200 focus:border-blue-400 transition-colors duration-300">
                      <SelectValue placeholder={t("selectYear")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t("all")}</SelectItem>
                      {years.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block text-gray-700">{t("fuel")}</label>
                  <Select value={selectedFuel} onValueChange={(v) => setSelectedFuel(v)}>
                    <SelectTrigger className="border-gray-200 focus:border-blue-400 transition-colors duration-300">
                      <SelectValue placeholder={t("selectFuel")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t("all")}</SelectItem>
                      {fuels.map((fuel) => (
                        <SelectItem key={fuel} value={fuel}>
                          {t(fuel)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block text-gray-700">{t("transmission")}</label>
                  <Select value={selectedTransmission} onValueChange={(v) => setSelectedTransmission(v)}>
                    <SelectTrigger className="border-gray-200 focus:border-blue-400 transition-colors duration-300">
                      <SelectValue placeholder={t("selectTransmission")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t("all")}</SelectItem>
                      {transmissions.map((transmission) => (
                        <SelectItem key={transmission} value={transmission}>
                          {t(transmission)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block text-gray-700">{t("condition")}</label>
                  <Select value={selectedCondition} onValueChange={(v) => setSelectedCondition(v)}>
                    <SelectTrigger className="border-gray-200 focus:border-blue-400 transition-colors duration-300">
                      <SelectValue placeholder={t("selectCondition")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t("all")}</SelectItem>
                      {conditions.map((condition) => (
                        <SelectItem key={condition} value={condition}>
                          {t(condition)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block text-gray-700">{t("city")}</label>
                  <Select value={selectedCity} onValueChange={(v) => setSelectedCity(v)}>
                    <SelectTrigger className="border-gray-200 focus:border-blue-400 transition-colors duration-300">
                      <SelectValue placeholder={t("selectCity")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t("all")}</SelectItem>
                      {cities.map((city) => (
                        <SelectItem key={city} value={city}>
                          {t(city)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block text-gray-700">{t("color")}</label>
                  <Select value={selectedColor} onValueChange={(v) => setSelectedColor(v)}>
                    <SelectTrigger className="border-gray-200 focus:border-blue-400 transition-colors duration-300">
                      <SelectValue placeholder={t("selectColor")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t("all")}</SelectItem>
                      {colors.map((color) => (
                        <SelectItem key={color} value={color}>
                          {t(color)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block text-gray-700">{t("priceRange")}</label>
                  <div className="flex gap-2">
                    <Input
                      placeholder={t("min")}
                      value={priceRange.min}
                      onChange={(e) => setPriceRange((prev) => ({ ...prev, min: e.target.value }))}
                      className="border-gray-200 focus:border-blue-400 transition-colors duration-300"
                    />
                    <Input
                      placeholder={t("max")}
                      value={priceRange.max}
                      onChange={(e) => setPriceRange((prev) => ({ ...prev, max: e.target.value }))}
                      className="border-gray-200 focus:border-blue-400 transition-colors duration-300"
                    />
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full bg-transparent border-blue-200 text-blue-600 hover:bg-blue-50 btn-animate transition-all duration-300 hover:scale-105"
                  onClick={() => {
                    setSelectedBrand("all")
                    setSelectedModel("all")
                    setSelectedYear("all")
                    setSelectedFuel("all")
                    setSelectedTransmission("all")
                    setSelectedCondition("all")
                    setSelectedCity("all")
                    setSelectedColor("all")
                    setPriceRange({ min: "", max: "" })
                    setSearchTerm("")
                  }}
                >
                  {t("clearFilters")}
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="lg:w-3/4">
            <div className="flex justify-between items-center mb-6 animate-fadeInUp">
              <h2 className="text-2xl font-bold text-gray-800">
                {filteredCars.length} {t("carsFound")}
              </h2>
              <Select defaultValue="newest">
                <SelectTrigger className="w-48 border-gray-200 transition-colors duration-300 hover:border-blue-400">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">{t("newest")}</SelectItem>
                  <SelectItem value="price-low">{t("priceLow")}</SelectItem>
                  <SelectItem value="price-high">{t("priceHigh")}</SelectItem>
                  <SelectItem value="year-new">{t("yearNew")}</SelectItem>
                  <SelectItem value="year-old">{t("yearOld")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-4 md:gap-6">
              {filteredCars.map((car, index) => (
                <CarCard key={car.id} car={car} t={t} index={index} />
              ))}
            </div>

            {filteredCars.length === 0 && (
              <div className="text-center py-12 animate-fadeInUp">
                <Car className="h-16 w-16 mx-auto text-gray-400 mb-4 animate-bounce-slow" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">{t("noResults")}</h3>
                <p className="text-gray-500">{t("noResultsDesc")}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
