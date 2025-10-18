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
  Zap,
} from "lucide-react"
import { Navbar } from "@/components/navbar"
import { apiClient } from "@/lib/api-client"
import { useAuth } from "@/lib/auth-context"
import {
  fuels as fuelsStatic,
  gearboxOptions as gearboxStatic,
  conditions as conditionsStatic,
  colors as colorsStatic,
  carStatus as carStatusStatic,
  cities as citiesStatic,
  years as yearsStatic,
  carStatus,
} from "@/lib/car-data"
import BrandSelect from "@/components/BrandSelect"
import ModelSelect from "@/components/ModelSelect"
import { translateString } from "@/lib/i18n"
import { useDefaultLanguage } from "@/components/useLanguage"
import { useRouter } from "next/navigation"
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { CarStatusBadge } from "@/components/car-status-badge"

type CarImage = { id: number; url: string } | string
type UserCar = {
  id: number
  brand?: string
  model?: string
  year?: number
  price?: number
  mileage?: number
  fuel?: string
  gearbox?: string
  viewcount?: number
  condition?: string
  color?: string
  location?: string
  city?: string
  images?: CarImage[]
  featured?: boolean
  [k: string]: any
  isFavorited?: boolean
}

type User = {
  id: number
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  role: string
  createdAt: string
}

type OptionItem = {
  key: string
  translations: { en: string; az: string;[k: string]: string }
}

const itemsPerPage = 30

function buildQuery(params: Record<string, any>) {
  const q = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null || v === "" || v === "all") return
    q.append(k, String(v))
  })
  return q.toString()
}

function toOption(item: any): OptionItem {
  if (typeof item === "string") {
    return { key: item, translations: { en: item, az: item } }
  }
  const key = String(item?.key ?? item)
  const translations = {
    en: String(item?.translations?.en ?? item?.en ?? key),
    az: String(item?.translations?.az ?? item?.az ?? key),
    ...(item?.translations || {}),
  }
  return { key, translations }
}

function sortByLabel(list: any[] | undefined, language: string): OptionItem[] {
  return (list ?? []).map(toOption).slice().sort((a, b) => {
    const aa = (a.translations?.[language] ?? a.translations.en ?? a.key).toString()
    const bb = (b.translations?.[language] ?? b.translations.en ?? b.key).toString()
    return aa.localeCompare(bb)
  })
}

function findTranslation(list: any[] | undefined, key: string | undefined | null, language: string) {
  if (!key) return ""
  const normalized = (list ?? []).map(toOption)
  const found = normalized.find((o) => String(o.key) === String(key))
  if (found) return found.translations?.[language] ?? found.translations.en ?? found.key
  return String(key)
}

function CarCard({
  car,
  t,
  language,
  fuelsList,
  transmissionsList,
  conditionsList,
  colorsList,
  carStatusList,
  citiesList,
  index,
  onFavoriteToggle
}: {
  car: UserCar
  t: (k: string) => string
  language: string
  fuelsList: OptionItem[]
  index: number
  transmissionsList: OptionItem[]
  conditionsList: OptionItem[]
  colorsList: OptionItem[]
  carStatusList: OptionItem[]
  citiesList: OptionItem[]
  onFavoriteToggle: (carId: number, currentlyFavorited: boolean) => Promise<void>
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFavorited, setIsFavorited] = useState<boolean>(Boolean(car.isFavorited))
  const { logout } = useAuth()
  const router = useRouter()
  useEffect(() => {
    setIsFavorited(Boolean(car.isFavorited))
  }, [car.isFavorited])

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

  const handleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const prev = isFavorited
    setIsFavorited(!prev)

    try {
      await onFavoriteToggle(car.id!, prev)
    } catch (err: any) {
      setIsFavorited(prev)
      console.error("Favorite error (Card):", err)
      if (err?.response?.status === 401 || err?.status === 401 || err?.statusCode === 401 || String(err?.message).includes("401")) {
        logout()
        toast.error(t("sessionExpired") || "Your session has expired. Please log in again.")
        router.push("/auth/login")
      } else {
        toast.error(t("favoriteError") || "Failed to update favorite status")
      }
    }
  }

  const fuelLabel = findTranslation(fuelsList, car.fuel ?? "", language) || (car.fuel ?? "")
  const gearboxLabel = findTranslation(transmissionsList, car.gearbox ?? "", language) || (car.gearbox ?? "")
  const conditionLabel = findTranslation(conditionsList, car.condition ?? "", language) || (car.condition ?? "")
  const colorLabel = findTranslation(colorsList, car.color ?? "", language) || (car.color ?? "")
  const carStatusLabel = findTranslation(carStatusList, car.SaleType ?? "", language) || (car.SaleType ?? "")
  const locationLabel = findTranslation(citiesList, car.location ?? car.city ?? "", language) || (car.location ?? car.city ?? "")
  const viewcount = car.viewcount || 0
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), index * 80);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <Card
      className={`overflow-hidden border-0 bg-white shadow-md hover:shadow-xl transition-all duration-300 ${isLoaded ? "animate-fadeInUp opacity-100" : "opacity-0"
        }`}
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="relative group overflow-hidden bg-gray-100 h-56">
        <Image
          src={imageUrls[currentImageIndex] || "/placeholder.svg"}
          alt={`${car.brand ?? ""} ${car.model ?? ""}`}
          width={300}
          height={200}
          className="w-full h-48 object-contain"
        />

        {imageUrls.length > 1 && (
          <>
            <Button
              size="icon"
              variant="ghost"
              className="absolute opacity-1 left-2 top-1/2 -translate-y-1/2 bg-blue-900 hover:bg-blue-800 text-white hover:text-white md:opacity-0 group-hover:opacity-100 transition-all duration-300 h-9 w-9 rounded-full shadow-md"
              onClick={prevImage}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            <Button
              size="icon"
              variant="ghost"
              className="absolute opacity-1 right-2 top-1/2 -translate-y-1/2 bg-blue-900 hover:bg-blue-800 text-white hover:text-white md:opacity-0 group-hover:opacity-100 transition-all duration-300 h-9 w-9 rounded-full shadow-md"
              onClick={nextImage}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>

          </>
        )}

        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {imageUrls.map((_, idx) => (
            <button
              key={idx}
              className={`rounded-full transition-all duration-300 ${idx === currentImageIndex
                ? "bg-gray-400 w-2 h-2"
                : "bg-gray-300 w-1.5 h-1.5 hover:bg-gray-400"
                }`}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setCurrentImageIndex(idx)
              }}
            />
          ))}
        </div>

        <div className="absolute top-3 right-3 bg-black/60 text-white px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1 backdrop-blur-sm">
          <Camera className="h-3 w-3" />
          {currentImageIndex + 1}/{Math.max(1, imageUrls.length)}
        </div>

        <Button
          size="icon"
          variant="ghost"
          className={`absolute top-3 left-3 bg-white/90 hover:bg-white rounded-full h-9 w-9 shadow-md transition-all duration-300 ${isFavorited ? "text-red-500" : "text-gray-600 hover:text-red-500"
            }`}
          onClick={handleFavorite}
        >
          <Heart className="h-5 w-5" fill={isFavorited ? "currentColor" : "none"} />
        </Button>
        {/* <div className="absolute bottom-3 left-3">
          <CarStatusBadge saleType={car.SaleType} language={language} />
        </div> */}

      </div>
      <CardContent className="p-4">
        <div className="mb-3">
          <h3 className="font-bold text-lg text-gray-900 line-clamp-2">
            {car.brand} {car.model}
          </h3>
          <p className="text-sm text-gray-500 mt-1">{car.year}</p>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Zap className="h-4 w-4 text-blue-500 flex-shrink-0" />
            <span className="truncate">
              {(car.mileage ?? 0).toLocaleString()} {t("km") || "km"}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Fuel className="h-4 w-4 text-blue-500 flex-shrink-0" />
            <span className="truncate">{car.fuel || "—"}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Cog className="h-4 w-4 text-blue-500 flex-shrink-0" />
            <span className="truncate">{car.gearbox || "—"}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4 text-blue-500 flex-shrink-0" />
            <span className="truncate">{car.location || "—"}</span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <Badge variant="secondary" className="text-xs">
            {car.color || "Unknown"}
          </Badge>
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Eye className="h-4 w-4" />
            <span>{car.viewcount || 0}</span>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-2xl font-bold text-gray-900">{(car.price ?? 0).toLocaleString()} ₼</p>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          asChild
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all duration-300"
        >
          <Link href={`/cars/${car.id}`}>{t("details") || "View Details"}</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

export default function CarsPage() {
  const { logout, user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedBrand, setSelectedBrand] = useState("all")
  const [selectedYear, setSelectedYear] = useState("all")
  const [selectedFuel, setSelectedFuel] = useState("all")
  const [selectedGearbox, setSelectedGearbox] = useState("all")
  const [selectedCondition, setSelectedCondition] = useState("all")
  const [priceRange, setPriceRange] = useState({ min: "", max: "" })
  const [selectedModel, setSelectedModel] = useState("all")
  const [selectedLocation, setSelectedLocation] = useState("all")
  const [selectedColor, setSelectedColor] = useState("all")
  const [selectedCarStatus, setSelectedCarStatus] = useState<string>("all");
  const [sortBy, setSortBy] = useState("newest")
  const [currentPage, setCurrentPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
  const [cars, setCars] = useState<UserCar[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [totalCount, setTotalCount] = useState<number | null>(null)
  const [totalPagesFromServer, setTotalPagesFromServer] = useState<number | null>(null)
  const [isServerPagination, setIsServerPagination] = useState(false)
  const { lang } = useDefaultLanguage();
  const t = (key: string) => translateString(lang, key);
  const years = useMemo(() => (Array.isArray(yearsStatic) ? yearsStatic.slice() : []), [])
  const fuelsList = useMemo(() => sortByLabel(fuelsStatic as any[], lang), [lang])
  const transmissionsList = useMemo(() => sortByLabel(gearboxStatic as any[], lang), [lang])
  const conditionsList = useMemo(() => sortByLabel(conditionsStatic as any[], lang), [lang])
  const colorsList = useMemo(() => sortByLabel(colorsStatic as any[], lang), [lang])
  const carStatusList = useMemo(() => sortByLabel(carStatusStatic as any[], lang), [lang])
  const citiesList = useMemo(() => sortByLabel(citiesStatic as any[], lang), [lang])
  const [profileData, setProfileData] = useState<User | null>(null)
  const [favorites, setFavorites] = useState<Set<number>>(new Set())
  const [favoritesMap, setFavoritesMap] = useState<Record<number, number>>({});

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
      if (!token) {
        setLoading(false)
        return
      }
      try {
        const data = await apiClient.getCurrentUser()
        setProfileData(data)
      } catch {
        logout()
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
    const interval = setInterval(fetchUser, 10000)
    return () => clearInterval(interval)
  }, [logout])

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
      if (selectedGearbox !== "all") params.gearbox = selectedGearbox
      if (selectedCondition !== "all") params.status = selectedCondition
      if (selectedLocation !== "all") params.location = selectedLocation
      if (selectedColor !== "all") params.color = selectedColor
      if (selectedCarStatus !== "all") params.SaleType = selectedCarStatus
      if (priceRange.min) params.minPrice = Number(priceRange.min)
      if (priceRange.max) params.maxPrice = Number(priceRange.max)
      if (sortBy) params.sortBy = sortBy

      let resp: any = null
      if (apiClient?.GetForSaleCars) {
        resp = await apiClient.GetForSaleCars(params)
      } else {
        const qs = buildQuery(params)
        const r = await fetch(`/car/for-sale?${qs}`)
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
      const IMAGE_BASE = process.env.NEXT_PUBLIC_API_URL_FOR_IMAGE?.replace(/\/+$/, "") ?? ""
      const mapped = (fetchedCars ?? []).map((c: any) => {
        const imgs = (c.images ?? []).map((img: any) => {
          if (!img) return "/placeholder.svg"
          const rawUrl = typeof img === "string" ? img : img.url ?? ""
          if (!rawUrl) return "/placeholder.svg"
          if (/^https?:\/\//i.test(rawUrl)) return rawUrl
          const cleanedUrl = rawUrl.replace(/^\/?uploads\/?/, "")
          return IMAGE_BASE ? `${IMAGE_BASE}/${cleanedUrl}` : `/${cleanedUrl}`
        })
        return { ...c, images: imgs, isFavorited: favorites.has(c.id) }
      })
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

  const fetchFavorites = async () => {
    if (!user) return;
    try {
      const favs: { id: number; carId: number }[] = await apiClient.getFavorites();
      const favSet = new Set<number>(favs.map((f) => f.carId));
      const favMap: Record<number, number> = {};
      favs.forEach((f) => {
        favMap[f.carId] = f.id;
      });
      setFavorites(favSet);
      setFavoritesMap(favMap);
      setCars((prev) => prev.map((c) => ({ ...c, isFavorited: favSet.has(c.id) })))
    } catch (err) {
      console.error("Failed to fetch favorites", err);
    }
  };

  const toggleFavoriteForCar = async (carId: number, currentlyFavorited: boolean) => {
    try {
      if (currentlyFavorited) {
        const favId = favoritesMap[carId];
        if (favId) {
          await apiClient.removeFavorite(favId)
        } else if (typeof (apiClient as any).removeFavoriteByCarId === "function") {
          await (apiClient as any).removeFavoriteByCarId(carId)
        } else {
          await apiClient.removeFavorite(carId).catch((err: any) => {
            throw err
          })
        }
        setFavorites(prev => {
          const s = new Set(prev);
          s.delete(carId);
          return s;
        });
        setFavoritesMap(prev => {
          const copy = { ...prev };
          delete copy[carId];
          return copy;
        });
        setCars(prev => prev.map(c => c.id === carId ? { ...c, isFavorited: false } : c));
        toast.success(t("removedFromFavorites"));
        return
      } else {
        const res = await apiClient.addFavorite(carId)
        const createdFavId = res?.id ?? res?.favorite?.id ?? undefined
        setFavorites(prev => {
          const s = new Set(prev);
          s.add(carId);
          return s;
        })
        if (createdFavId) {
          setFavoritesMap(prev => ({ ...prev, [carId]: createdFavId }))
        }
        setCars(prev => prev.map(c => c.id === carId ? { ...c, isFavorited: true } : c));
        toast.success(t("addedToFavorites"));
        return
      }
    } catch (err: any) {
      console.error("toggleFavoriteForCar error:", err)
      throw err
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [user]);

  useEffect(() => {
    fetchCars()
  }, [currentPage, searchTerm, selectedBrand, selectedModel, selectedYear, selectedFuel, selectedGearbox, selectedCondition, selectedLocation, selectedColor, selectedCarStatus, priceRange.min, priceRange.max, sortBy, favorites])

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
      <Navbar />
      <section className="bg-white border-b py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{t("forSale")}</h1>
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
                    onChange={(v) => { setSelectedBrand(v); setSelectedModel("all"); setCurrentPage(1); }}
                    placeholder={t("all")}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block text-gray-700">{t("model")}</label>
                  <ModelSelect
                    value={selectedModel}
                    brand={selectedBrand}
                    onChange={(v) => { setSelectedModel(v); setCurrentPage(1); }}
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
                      {fuelsList.map((f) => (
                        <SelectItem key={f.key} value={f.key}>
                          {f.translations[lang] ?? f.translations.en}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">{t("transmission")}</label>
                  <Select value={selectedGearbox} onValueChange={(v: any) => { setSelectedGearbox(v); setCurrentPage(1) }}>
                    <SelectTrigger><SelectValue placeholder={t("selectTransmission")} /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t("all")}</SelectItem>
                      {transmissionsList.map((tr) => (
                        <SelectItem key={tr.key} value={tr.key}>
                          {tr.translations[lang] ?? tr.translations.en}
                        </SelectItem>
                      ))}

                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">{t("condition")}</label>
                  <Select value={selectedCondition} onValueChange={(v: any) => { setSelectedCondition(v); setCurrentPage(1) }}>
                    <SelectTrigger><SelectValue placeholder={t("selectCondition")} /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t("all")}</SelectItem>
                      {conditionsList.map((c) => (
                        <SelectItem key={c.key} value={c.key}>
                          {c.translations[lang] ?? c.translations.en}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">{t("city")}</label>
                  <Select value={selectedLocation} onValueChange={(v: any) => { setSelectedLocation(v); setCurrentPage(1) }}>
                    <SelectTrigger><SelectValue placeholder={t("selectCity")} /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t("all")}</SelectItem>
                      {citiesList.map((ci) => (
                        <SelectItem key={ci.key} value={ci.key}>
                          {ci.translations[lang] ?? ci.translations.en}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">{t("color")}</label>
                  <Select value={selectedColor} onValueChange={(v: any) => { setSelectedColor(v); setCurrentPage(1) }}>
                    <SelectTrigger><SelectValue placeholder={t("selectColor")} /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t("all")}</SelectItem>
                      {colorsList.map((c) => (
                        <SelectItem key={c.key} value={c.key}>
                          {c.translations[lang] ?? c.translations.en}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">{t("carStatus")}</label>
                  <Select value={selectedCarStatus} onValueChange={(v) => { setSelectedCarStatus(v); setCurrentPage(1); }}>
                    <SelectTrigger><SelectValue placeholder={t("selectCarStatus")} /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t("all")}</SelectItem>
                      {carStatusList.map((c) => (
                        <SelectItem key={c.key} value={c.key}>
                          {c.translations[lang] ?? c.translations.en}
                        </SelectItem>
                      ))}
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
                  setSelectedGearbox("all")
                  setSelectedCondition("all")
                  setSelectedLocation("all")
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
                  {paginatedCars.map((car, idx) => (
                    <CarCard
                      key={car.id}
                      car={car}
                      t={t}
                      language={lang}
                      fuelsList={fuelsList}
                      index={idx}
                      transmissionsList={transmissionsList}
                      conditionsList={conditionsList}
                      colorsList={colorsList}
                      carStatusList={carStatusList}
                      citiesList={citiesList}
                      onFavoriteToggle={toggleFavoriteForCar}
                    />
                  ))}
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
      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />
    </div>
  )
}
