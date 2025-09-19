"use client"

import type React from "react"

import { useEffect, useState } from "react"
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
  SlidersHorizontal,
  Camera,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
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
const cars = [
  {
    id: 1,
    brand: "BMW",
    model: "X5",
    year: 2022,
    price: 85000,
    mileage: 15000,
    fuel: "Benzin",
    transmission: "Avtomatik",
    color: "Qara",
    location: "Bakı",
    city: "Bakı",
    images: [
      "/placeholder.svg?height=200&width=300&text=BMW+X5+Front",
      "/placeholder.svg?height=200&width=300&text=BMW+X5+Side",
      "/placeholder.svg?height=200&width=300&text=BMW+X5+Interior",
      "/placeholder.svg?height=200&width=300&text=BMW+X5+Back",
      "/placeholder.svg?height=200&width=300&text=BMW+X5+Engine",
    ],
    featured: true,
    condition: "Yeni",
  },
  {
    id: 2,
    brand: "Mercedes",
    model: "C-Class",
    year: 2021,
    price: 65000,
    mileage: 25000,
    fuel: "Benzin",
    transmission: "Avtomatik",
    color: "Ağ",
    location: "Bakı",
    city: "Bakı",
    images: [
      "/placeholder.svg?height=200&width=300&text=Mercedes+C+Front",
      "/placeholder.svg?height=200&width=300&text=Mercedes+C+Side",
      "/placeholder.svg?height=200&width=300&text=Mercedes+C+Interior",
      "/placeholder.svg?height=200&width=300&text=Mercedes+C+Back",
      "/placeholder.svg?height=200&width=300&text=Mercedes+C+Engine",
    ],
    featured: false,
    condition: "İşlənmiş",
  },
  {
    id: 3,
    brand: "Toyota",
    model: "Camry",
    year: 2023,
    price: 45000,
    mileage: 5000,
    fuel: "Hibrid",
    transmission: "Avtomatik",
    color: "Gümüşü",
    location: "Gəncə",
    city: "Gəncə",
    images: [
      "/placeholder.svg?height=200&width=300&text=Toyota+Camry+Front",
      "/placeholder.svg?height=200&width=300&text=Toyota+Camry+Side",
      "/placeholder.svg?height=200&width=300&text=Toyota+Camry+Interior",
      "/placeholder.svg?height=200&width=300&text=Toyota+Camry+Back",
      "/placeholder.svg?height=200&width=300&text=Toyota+Camry+Engine",
    ],
    featured: true,
    condition: "Yeni",
  },
  ...Array.from({ length: 20 }, (_, i) => ({
    id: i + 4,
    brand: ["BMW", "Mercedes", "Audi", "Toyota", "Hyundai", "Volkswagen"][i % 6],
    model: ["X3", "E-Class", "A4", "Corolla", "Elantra", "Passat"][i % 6],
    year: 2018 + (i % 6),
    price: 25000 + i * 3000,
    mileage: 10000 + i * 5000,
    fuel: ["Benzin", "Dizel", "Hibrid"][i % 3],
    transmission: ["Avtomatik", "Mexaniki"][i % 2],
    color: ["Qara", "Ağ", "Gümüşü", "Göy", "Qırmızı"][i % 5],
    location: ["Bakı", "Gəncə", "Sumqayıt"][i % 3],
    city: ["Bakı", "Gəncə", "Sumqayıt"][i % 3],
    images: [
      `/placeholder.svg?height=200&width=300&text=Car+${i + 4}+Front`,
      `/placeholder.svg?height=200&width=300&text=Car+${i + 4}+Side`,
      `/placeholder.svg?height=200&width=300&text=Car+${i + 4}+Interior`,
      `/placeholder.svg?height=200&width=300&text=Car+${i + 4}+Back`,
      `/placeholder.svg?height=200&width=300&text=Car+${i + 4}+Engine`,
    ],
    featured: i % 5 === 0,
    condition: i % 3 === 0 ? "Yeni" : "İşlənmiş",
  })),
]


function CarCard({ car }: { car: (typeof cars)[0] }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [profileData, setProfileData] = useState<User | null>(null)
  const { logout } = useAuth()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("accessToken")
      if (!token) {
        setLoading(false)
        return
      }
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
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative group">
        <Image
          src={car.images[currentImageIndex] || "/placeholder.svg"}
          alt={`${car.brand} ${car.model}`}
          width={300}
          height={200}
          className="w-full h-48 object-cover"
        />

        {car.featured && <Badge className="absolute top-2 left-2 bg-yellow-500 z-10">Seçilmiş</Badge>}
        {car.images.length > 1 && (
          <>
            <Button
              size="icon"
              variant="ghost"
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
              onClick={prevImage}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <Button
              size="icon"
              variant="ghost"
              className="absolute right-12 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
              onClick={nextImage}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}

        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
          {car.images.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all ${index === currentImageIndex ? "bg-white" : "bg-white/50"
                }`}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setCurrentImageIndex(index)
              }}
            />
          ))}
        </div>

        <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded-md text-xs flex items-center gap-1">
          <Camera className="h-3 w-3" />
          {currentImageIndex + 1}/{car.images.length}
        </div>

        <Button
          size="icon"
          variant="ghost"
          className="absolute top-2 right-2 bg-white/80 hover:bg-white z-10"
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
            <h3 className="font-bold text-lg">
              {car.brand} {car.model}
            </h3>
            <p className="text-sm text-gray-600">
              {car.year} • {car.condition}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-blue-600">{car.price.toLocaleString()} ₼</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-1">
            <Car className="h-4 w-4" />
            {car.mileage.toLocaleString()} km
          </div>
          <div className="flex items-center gap-1">
            <Fuel className="h-4 w-4" />
            {car.fuel}
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            {car.transmission}
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            {car.location}
          </div>
        </div>
        <Badge variant="outline" className="mb-2">
          {car.color}
        </Badge>
      </CardContent>

      <CardFooter className="pt-0 gap-2">
        <Button asChild className="flex-1">
          <Link href={`/cars/${car.id}`}>
            <Eye className="h-4 w-4 mr-2" />
            Ətraflı
          </Link>
        </Button>
        <Button variant="outline" size="icon">
          <Phone className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon">
          <Mail className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}

export default function CarsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedBrand, setSelectedBrand] = useState("all")
  const [selectedYear, setSelectedYear] = useState("all")
  const [selectedFuel, setSelectedFuel] = useState("all")
  const [selectedTransmission, setSelectedTransmission] = useState("all")
  const [selectedCondition, setSelectedCondition] = useState("all")
  const [priceRange, setPriceRange] = useState({ min: "", max: "" })
  const [selectedModel, setSelectedModel] = useState("all")
  const [selectedCity, setSelectedCity] = useState("all")
  const [selectedColor, setSelectedColor] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [currentPage, setCurrentPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)

  const itemsPerPage = 12

  const brands = [...new Set(cars.map((car) => car.brand))]
  const years = [...new Set(cars.map((car) => car.year))].sort((a, b) => b - a)
  const fuels = [...new Set(cars.map((car) => car.fuel))]
  const transmissions = [...new Set(cars.map((car) => car.transmission))]
  const conditions = [...new Set(cars.map((car) => car.condition))]
  const models = [...new Set(cars.map((car) => car.model))]
  const cities = [...new Set(cars.map((car) => car.city))]
  const colors = [...new Set(cars.map((car) => car.color))]

  const filteredCars = cars.filter((car) => {
    const matchesSearch =
      car.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.model.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesBrand = selectedBrand === "all" || car.brand === selectedBrand
    const matchesModel = selectedModel === "all" || car.model === selectedModel
    const matchesYear = selectedYear === "all" || car.year.toString() === selectedYear
    const matchesFuel = selectedFuel === "all" || car.fuel === selectedFuel
    const matchesTransmission = selectedTransmission === "all" || car.transmission === selectedTransmission
    const matchesCondition = selectedCondition === "all" || car.condition === selectedCondition
    const matchesCity = selectedCity === "all" || car.city === selectedCity
    const matchesColor = selectedColor === "all" || car.color === selectedColor
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

  const sortedCars = [...filteredCars].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "year-new":
        return b.year - a.year
      case "year-old":
        return a.year - b.year
      case "mileage-low":
        return a.mileage - b.mileage
      case "mileage-high":
        return b.mileage - a.mileage
      default:
        return b.id - a.id
    }
  })

  const totalPages = Math.ceil(sortedCars.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedCars = sortedCars.slice(startIndex, startIndex + itemsPerPage)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <section className="bg-white border-b py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Avtomobillər</h1>
              <p className="text-gray-600">Euro Car-da ən yaxşı avtomobilləri tapın</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative flex-1 md:w-80">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Marka, model axtarın..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="md:hidden">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filterlər
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col xl:flex-row gap-6 md:gap-8">
          <div className={`xl:w-1/4 ${showFilters ? "block" : "hidden xl:block"}`}>
            <Card className="xl:sticky xl:top-4">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    <h3 className="text-lg font-semibold">Filterlər</h3>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)} className="xl:hidden">
                    ✕
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Marka</label>
                  <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                    <SelectTrigger>
                      <SelectValue placeholder="Marka seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Hamısı</SelectItem>
                      {brands.map((brand) => (
                        <SelectItem key={brand} value={brand}>
                          {brand}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Model</label>
                  <Select value={selectedModel} onValueChange={setSelectedModel}>
                    <SelectTrigger>
                      <SelectValue placeholder="Model seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Hamısı</SelectItem>
                      {models.map((model) => (
                        <SelectItem key={model} value={model}>
                          {model}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">İl</label>
                  <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger>
                      <SelectValue placeholder="İl seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Hamısı</SelectItem>
                      {years.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Yanacaq</label>
                  <Select value={selectedFuel} onValueChange={setSelectedFuel}>
                    <SelectTrigger>
                      <SelectValue placeholder="Yanacaq növü" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Hamısı</SelectItem>
                      {fuels.map((fuel) => (
                        <SelectItem key={fuel} value={fuel}>
                          {fuel}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Transmissiya</label>
                  <Select value={selectedTransmission} onValueChange={setSelectedTransmission}>
                    <SelectTrigger>
                      <SelectValue placeholder="Transmissiya" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Hamısı</SelectItem>
                      {transmissions.map((transmission) => (
                        <SelectItem key={transmission} value={transmission}>
                          {transmission}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Vəziyyət</label>
                  <Select value={selectedCondition} onValueChange={setSelectedCondition}>
                    <SelectTrigger>
                      <SelectValue placeholder="Vəziyyət" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Hamısı</SelectItem>
                      {conditions.map((condition) => (
                        <SelectItem key={condition} value={condition}>
                          {condition}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Şəhər</label>
                  <Select value={selectedCity} onValueChange={setSelectedCity}>
                    <SelectTrigger>
                      <SelectValue placeholder="Şəhər seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Hamısı</SelectItem>
                      {cities.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Rəng</label>
                  <Select value={selectedColor} onValueChange={setSelectedColor}>
                    <SelectTrigger>
                      <SelectValue placeholder="Rəng seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Hamısı</SelectItem>
                      {colors.map((color) => (
                        <SelectItem key={color} value={color}>
                          {color}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Qiymət aralığı (AZN)</label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Min"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange((prev) => ({ ...prev, min: e.target.value }))}
                    />
                    <Input
                      placeholder="Max"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange((prev) => ({ ...prev, max: e.target.value }))}
                    />
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full bg-transparent"
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
                  Filterləri təmizlə
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="xl:w-3/4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
              <h2 className="text-2xl font-bold">{filteredCars.length} avtomobil tapıldı</h2>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Ən yeni</SelectItem>
                  <SelectItem value="price-low">Qiymət: Aşağıdan yuxarı</SelectItem>
                  <SelectItem value="price-high">Qiymət: Yuxarıdan aşağı</SelectItem>
                  <SelectItem value="year-new">İl: Yeni</SelectItem>
                  <SelectItem value="year-old">İl: Köhnə</SelectItem>
                  <SelectItem value="mileage-low">Yürüş: Az</SelectItem>
                  <SelectItem value="mileage-high">Yürüş: Çox</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
              {paginatedCars.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>

            {filteredCars.length === 0 && (
              <div className="text-center py-12">
                <Car className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Heç bir avtomobil tapılmadı</h3>
                <p className="text-gray-500">Axtarış kriteriyalarınızı dəyişdirərək yenidən cəhd edin</p>
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Əvvəlki
                </Button>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = Math.max(1, Math.min(currentPage - 2 + i, totalPages - 4 + i))
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      onClick={() => setCurrentPage(pageNum)}
                      className="w-10"
                    >
                      {pageNum}
                    </Button>
                  )
                })}

                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Növbəti
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
