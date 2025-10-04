"use client"

import React, { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
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
  MapPin,
  Car,
  Fuel,
  SlidersHorizontal,
  Camera,
  ChevronLeft,
  ChevronRight,
  Cog,
} from "lucide-react"
import { Navbar } from "@/components/navbar"
import { apiClient } from "@/lib/api-client"
import { useAuth } from "@/lib/auth-context"
import {
  fuels as fuelsStatic,
  gearboxOptions as gearboxStatic,
  conditions as conditionsStatic,
  colors as colorsStatic,
  cities as citiesStatic,
  features as featuresStatic,
  years as yearsStatic,
} from "@/lib/car-data"
import BrandSelect from "@/components/BrandSelect"
import ModelSelect from "@/components/ModelSelect"
import { getTranslation } from "@/lib/i18n"
import { useLanguage } from "@/hooks/use-language"

type CarImage = { id: number; url: string } | string
type UserCar = {
  id: number
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
  images?: CarImage[]
  featured?: boolean
  [k: string]: any
}

const itemsPerPage = 20

function buildQuery(params: Record<string, any>) {
  const q = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null || v === "" || v === "all") return
    q.append(k, String(v))
  })
  return q.toString()
}

function CarCard({ car, t }: { car: UserCar; t: (k: string) => string }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const { logout } = useAuth()
  const imageUrls = (car.images ?? []).map((img) => (typeof img === "string" ? img : img?.url ?? "/placeholder.svg"))
  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev + 1) % Math.max(1, imageUrls.length))
  }
  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev - 1 + Math.max(1, imageUrls.length)) % Math.max(1, imageUrls.length))
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative group">
        <Image
          src={imageUrls[currentImageIndex] || "/placeholder.svg"}
          alt={`${car.brand ?? ""} ${car.model ?? ""}`}
          width={300}
          height={200}
          className="w-full h-48 object-cover"
        />
        {car.featured && <Badge className="absolute top-2 left-2 bg-yellow-500 z-10">{t("featured")}</Badge>}
        {imageUrls.length > 1 && (
          <>
            <Button
              size="icon"
              variant="ghost"
              className="absolute left-1 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
              onClick={prevImage}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
              onClick={nextImage}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
          {imageUrls.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all ${index === currentImageIndex ? "bg-white" : "bg-white/50"}`}
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
          {currentImageIndex + 1}/{Math.max(1, imageUrls.length)}
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
              {car.year} • {t(car.condition ?? "") || car.condition}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-blue-600">{(car.price ?? 0).toLocaleString()} ₼</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-1">
            <Car className="h-4 w-4" />
            {(car.mileage ?? 0).toLocaleString()} {t("km") || "km"}
          </div>
          <div className="flex items-center gap-1">
            <Fuel className="h-4 w-4" />
            {t(car.fuel ?? "") || car.fuel}
          </div>
          <div className="flex items-center gap-1">
            <Cog className="h-4 w-4" />
            {t(car.gearbox ?? "") || car.gearbox}
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            {t(car.location ?? "") || car.location}
          </div>
        </div>
        <Badge variant="outline" className="mb-2">
          {t(car.color ?? "") || car.color}
        </Badge>
      </CardContent>
      <CardFooter className="pt-0 gap-2">
        <Button asChild className="flex-1">
          <Link href={`/cars/${car.id}`}>
            <Eye className="h-4 w-4 mr-2" />
            {t("details")}
          </Link>
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
  const [page, setPage] = useState<number>(1);
  const [cars, setCars] = useState<UserCar[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [totalCount, setTotalCount] = useState<number | null>(null)
  const [totalPagesFromServer, setTotalPagesFromServer] = useState<number | null>(null)
  const [isServerPagination, setIsServerPagination] = useState(false)
  const years = useMemo(() => (Array.isArray(yearsStatic) ? yearsStatic.slice() : []), [])
  const fuels = useMemo(() => (Array.isArray(fuelsStatic) ? fuelsStatic.slice() : []), [])
  const transmissions = useMemo(() => (Array.isArray(gearboxStatic) ? gearboxStatic.slice() : []), [])
  const conditions = useMemo(() => (Array.isArray(conditionsStatic) ? conditionsStatic.slice() : []), [])
  const colors = useMemo(() => (Array.isArray(colorsStatic) ? colorsStatic.slice() : []), [])
  const cities = useMemo(() => (Array.isArray(citiesStatic) ? citiesStatic.slice() : []), [])
  const { language, changeLanguage } = useLanguage()
  const t = (key: string) => getTranslation(language, key)

  useEffect(() => {
    setSelectedModel("all")
    setCurrentPage(1)
  }, [selectedBrand])
  const fetchCars = async () => {
    setLoading(true)
    setError(null)
    try {
      const params: any = {
        page: currentPage,
        limit: itemsPerPage,
      }
      if (searchTerm) params.search = searchTerm
      if (selectedBrand !== "all") params.brand = selectedBrand
      if (selectedModel !== "all") params.model = selectedModel
      if (selectedYear !== "all") params.year = Number(selectedYear)
      if (selectedFuel !== "all") params.fuel = selectedFuel
      if (selectedTransmission !== "all") params.transmission = selectedTransmission
      if (selectedCondition !== "all") params.status = selectedCondition
      if (selectedCity !== "all") params.city = selectedCity
      if (selectedColor !== "all") params.color = selectedColor
      if (priceRange.min) params.minPrice = Number(priceRange.min)
      if (priceRange.max) params.maxPrice = Number(priceRange.max)
      if (sortBy) params.sortBy = sortBy
      let resp: any = null
      if (apiClient?.getAllCars) {
        resp = await apiClient.getAllCars(params)
      } else {
        const qs = buildQuery(params)
        const r = await fetch(`/car/all?${qs}`)
        resp = await r.json()
      }
      const normalizeCars = (raw: any) => {
        if (!raw) return { cars: [], total: null, totalPages: null, page: null }
        if (Array.isArray(raw)) return { cars: raw, total: raw.length, totalPages: null, page: null }
        if (raw.data && Array.isArray(raw.data)) return { cars: raw.data, total: raw.meta?.total ?? null, totalPages: raw.meta?.totalPages ?? null, page: raw.meta?.page ?? null }
        if (raw.cars && Array.isArray(raw.cars)) return { cars: raw.cars, total: raw.totalCount ?? null, totalPages: raw.totalPages ?? null, page: raw.currentPage ?? null }
        if (raw.items && Array.isArray(raw.items)) return { cars: raw.items, total: raw.total ?? null, totalPages: raw.totalPages ?? null, page: raw.page ?? null }
        return { cars: [], total: null, totalPages: null, page: null }
      }
      const { cars: fetchedCars, total, totalPages: serverTP, page: serverPage } = normalizeCars(resp)
      const IMAGE_BASE = process.env.NEXT_PUBLIC_API_URL_FOR_IMAGE?.replace(/\/+$/, "") ?? "";
      const mapped = (fetchedCars ?? []).map((c: any) => {
        const imgs = (c.images ?? []).map((img: any) => {
          if (!img) return "/placeholder.svg";
          const rawUrl = typeof img === "string" ? img : img.url ?? "";
          if (!rawUrl) return "/placeholder.svg";
          if (/^https?:\/\//i.test(rawUrl)) return rawUrl;
          const cleanedUrl = rawUrl.replace(/^\/?uploads\/?/, "");
          return IMAGE_BASE ? `${IMAGE_BASE}/${cleanedUrl}` : `/${cleanedUrl}`;
        });
        return { ...c, images: imgs };
      });
      setCars(mapped)
      if (typeof total === "number") {
        setIsServerPagination(true)
        setTotalCount(total)
        setTotalPagesFromServer(typeof serverTP === "number" ? serverTP : Math.max(1, Math.ceil((total ?? mapped.length) / itemsPerPage)))
      } else {
        setIsServerPagination(false)
        setTotalCount(mapped.length)
        setTotalPagesFromServer(null)
      }
    } catch (err: any) {
      console.error(err)
      setError(err?.message ?? t("errorOccurred"))
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    fetchCars()
  }, [currentPage, searchTerm, selectedBrand, selectedModel, selectedYear, selectedFuel, selectedTransmission, selectedCondition, selectedCity, selectedColor, priceRange.min, priceRange.max, sortBy])
  const totalPages = isServerPagination
    ? Math.max(1, Math.ceil((totalCount ?? 0) / itemsPerPage))
    : Math.ceil((cars.length) / itemsPerPage) || 1

  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedCars = isServerPagination ? cars : cars.slice(startIndex, startIndex + itemsPerPage)
  const renderPageButtons = () => {
    const visible = Math.min(5, totalPages)
    const half = Math.floor(visible / 2)
    const start = Math.max(1, Math.min(currentPage - half, totalPages - visible + 1))
    const pages = Array.from({ length: visible }, (_, i) => start + i)
    return pages.map((pageNum) => (
      <Button
        key={pageNum}
        variant={currentPage === pageNum ? "default" : "outline"}
        onClick={() => setCurrentPage(pageNum)}
        className="w-10"
      >
        {pageNum}
      </Button>
    ))
  }
  const resultsCountText = (t("resultsCount") || "{count} nəticə").replace("{count}", String(totalCount ?? cars.length))

  return (
    <div className="min-h-screen bg-gray-50">
        <Navbar currentLanguage={language} onLanguageChange={changeLanguage} />
      <section className="bg-white border-b py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{t("cars")}</h1>
              <p className="text-gray-600">{t("carsSubtitle")}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative flex-1 md:w-80">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder={t("searchPlaceholder")}
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1) }}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="md:hidden">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                {t("filters")}
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
                    <h3 className="text-lg font-semibold">{t("filters")}</h3>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)} className="xl:hidden">✕</Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block text-gray-700">{t("brand")}</label>
                  <BrandSelect
                    value={selectedBrand}
                    onChange={(v) => { setSelectedBrand(v); setSelectedModel("all"); setPage(1); }}
                    placeholder={t("all")}
                  />
                </div>


                <div>
                  <label className="text-sm font-medium mb-2 block text-gray-700">{t("model")}</label>
                  <ModelSelect
                    value={selectedModel}
                    brand={selectedBrand}
                    onChange={(v) => { setSelectedModel(v); setPage(1); }}
                    placeholder={t("all")}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">{t("year")}</label>
                  <Select value={selectedYear} onValueChange={(v: any) => { setSelectedYear(v); setCurrentPage(1) }}>
                    <SelectTrigger><SelectValue placeholder={t("selectYear")} /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t("all")}</SelectItem>
                      {years.map((y) => (<SelectItem key={y} value={y.toString()}>{y}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">{t("fuel")}</label>
                  <Select value={selectedFuel} onValueChange={(v: any) => { setSelectedFuel(v); setCurrentPage(1) }}>
                    <SelectTrigger><SelectValue placeholder={t("selectFuel")} /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t("all")}</SelectItem>
                      {fuels.map((f) => (<SelectItem key={f} value={f}>{t(f) ?? f}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">{t("transmission")}</label>
                  <Select value={selectedTransmission} onValueChange={(v: any) => { setSelectedTransmission(v); setCurrentPage(1) }}>
                    <SelectTrigger><SelectValue placeholder={t("selectTransmission")} /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t("all")}</SelectItem>
                      {transmissions.map((tr) => (<SelectItem key={tr} value={tr}>{t(tr) ?? tr}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">{t("condition")}</label>
                  <Select value={selectedCondition} onValueChange={(v: any) => { setSelectedCondition(v); setCurrentPage(1) }}>
                    <SelectTrigger><SelectValue placeholder={t("selectCondition")} /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t("all")}</SelectItem>
                      {conditions.map((c) => (<SelectItem key={c} value={c}>{t(c) ?? c}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">{t("city")}</label>
                  <Select value={selectedCity} onValueChange={(v: any) => { setSelectedCity(v); setCurrentPage(1) }}>
                    <SelectTrigger><SelectValue placeholder={t("selectCity")} /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t("all")}</SelectItem>
                      {cities.map((c) => (<SelectItem key={c} value={c}>{t(c) ?? c}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">{t("color")}</label>
                  <Select value={selectedColor} onValueChange={(v: any) => { setSelectedColor(v); setCurrentPage(1) }}>
                    <SelectTrigger><SelectValue placeholder={t("selectColor")} /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t("all")}</SelectItem>
                      {colors.map((col) => (<SelectItem key={col} value={col}>{t(col) ?? col}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">{`${t("priceRange")} (AZN)`}</label>
                  <div className="flex gap-2">
                    <Input placeholder={t("min")} value={priceRange.min} onChange={(e) => setPriceRange((prev) => ({ ...prev, min: e.target.value }))} />
                    <Input placeholder={t("max")} value={priceRange.max} onChange={(e) => setPriceRange((prev) => ({ ...prev, max: e.target.value }))} />
                  </div>
                </div>
                <Button variant="outline" className="w-full bg-transparent" onClick={() => {
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
                  setCurrentPage(1)
                }}>
                  {t("clearFilters")}
                </Button>
              </CardContent>
            </Card>
          </div>
          <div className="xl:w-3/4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
              <h2 className="text-2xl font-bold">{resultsCountText}</h2>
              <Select value={sortBy} onValueChange={(v: any) => { setSortBy(v); setCurrentPage(1) }}>
                <SelectTrigger className="w-full sm:w-48"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">{t("newest")}</SelectItem>
                  <SelectItem value="price-low">{t("priceLow")}</SelectItem>
                  <SelectItem value="price-high">{t("priceHigh")}</SelectItem>
                  <SelectItem value="year-new">{t("yearNew")}</SelectItem>
                  <SelectItem value="year-old">{t("yearOld")}</SelectItem>
                  <SelectItem value="mileage-low">{t("mileageLow") ?? "Yürüş: Az"}</SelectItem>
                  <SelectItem value="mileage-high">{t("mileageHigh") ?? "Yürüş: Çox"}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {loading ? (
              <div className="text-center py-12">{t("loading")}</div>
            ) : error ? (
              <div className="text-center py-12 text-red-600">{error}</div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                  {paginatedCars.map((car) => (<CarCard key={car.id} car={car} t={t} />))}
                </div>
                {paginatedCars.length === 0 && (
                  <div className="text-center py-12">
                    <Car className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">{t("noResults")}</h3>
                    <p className="text-gray-500">{t("noResultsDesc")}</p>
                  </div>
                )}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-8">
                    <Button variant="outline" onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1}>{t("prev")}</Button>
                    {renderPageButtons()}
                    <Button variant="outline" onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>{t("next")}</Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
