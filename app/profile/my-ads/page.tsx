"use client"

import React, { useEffect, useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
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
  PackageCheck,
  ReceiptText,
  Megaphone,
  Upload,
  ImageIcon,
  X,
  TrendingUp,
  Crown,
  Star,
  Cog,
  Zap,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/hooks/use-language"
import { getTranslation, translateString } from "@/lib/i18n"
import { apiClient } from "@/lib/api-client"
import BrandSelect from "@/components/BrandSelect"
import ModelSelect from "@/components/ModelSelect"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { bodyTypes, carStatus, cities, colors, conditions, engineOptions, features, fuels, gearboxOptions, years } from "@/lib/car-data"
import { Input } from "@/components/ui/input"
import { FeatureOption, VirtualScrollFeatures } from "@/app/sell/page"
import CountrySelect from "@/components/CountryCodeSelect"
import { Textarea } from "@/components/ui/textarea"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useAuth } from "@/lib/auth-context"
import { useDefaultLanguage } from "@/components/useLanguage"
import { findTranslationFromList } from "@/app/cars/[id]/page"

const API = process.env.NEXT_PUBLIC_API_URL || ""
const IMAGE_BASE = process.env.NEXT_PUBLIC_API_URL_FOR_IMAGE || ""
const PUBLIC_API_KEY = process.env.NEXT_PUBLIC_API_KEY || ""

export function getAuthHeaders() {
  const headers: Record<string, string> = { Accept: "application/json" }
  try {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      if (token) {
        headers["Authorization"] = `Bearer ${token}`
      }
    }
  } catch (err) {
  }
  if (!headers["Authorization"] && PUBLIC_API_KEY) {
    headers["x-api-key"] = PUBLIC_API_KEY
  }
  return headers
}

type RawCarImage = { id?: number; url?: string } | string

type RawUserCar = {
  id: number
  brand?: string
  model?: string
  year?: number
  price?: number
  mileage?: number
  fuel?: string
  transmission?: string
  color?: string
  location?: string | null
  city?: string | null
  images?: RawCarImage[]
  condition?: string
  status?: string
  createdAt?: string
  SaleType?: string
  views?: number
  calls?: number
  messages?: number
  description?: string
  allCarsListId?: number
  ban?: string
  engine?: string
  gearbox?: string
  name?: string
  viewcount?: number
  phoneCode?: string
  phone?: string
  email?: string
  features?: string[] | string
}

type CarImage = {
  id: number
  url: string
}

type UserCar = {
  id: number
  createdAt: string
  updatedAt: string
  brand?: string
  model?: string
  year?: number
  price?: number
  mileage?: number
  fuel?: string
  transmission?: string
  condition?: string
  gearbox?: string
  viewcount?: number
  color?: string
  SaleType?: string
  location?: string
  city?: string
  description?: string
  features?: string[]
  name?: string
  phone?: string
  phoneCode: string
  email?: string
  status?: string
  views?: number
  images?: CarImage[]
}

type User = {
  id: number
  firstName?: string
  lastName?: string
  email?: string
  phoneNumber?: string
  phoneCode?: string
  role?: string
  createdAt?: string
  userCars?: UserCar[]
}

type CarAd = {
  id: number
  brand: string
  model: string
  year: number
  price: number
  mileage: number
  SaleType?: string
  fuel: string
  transmission: string
  gearbox: string
  viewcount: number
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
  allCarsListId?: number
}

const buildImageUrl = (maybe: RawCarImage | undefined): string | null => {
  if (!maybe) return null
  if (typeof maybe === "string") {
    if (!maybe) return null
    if (maybe.startsWith("http")) return maybe
    return `${IMAGE_BASE}${maybe}`
  } else {
    const url = maybe.url ?? ""
    if (!url) return null
    if (url.startsWith("http")) return url
    return `${IMAGE_BASE}${url}`
  }
}
import {
  status as statusStatic,
} from "@/lib/car-data"
import { CarStatusBadge } from "@/components/car-status-badge"
function AdCard({
  ad,
  onEdit,
  onDelete,
  onMarkSold,
  language,
  index,
  isDeleting,
  isSelling,
}: {
  ad: CarAd
  onEdit: (id: number) => void
  onDelete: (id: number) => void
  onMarkSold: (id: number) => void
  language: string;
  index: number
  isDeleting?: boolean
  isSelling?: boolean
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const { lang, setLang } = useDefaultLanguage();
  const t = (key: string) => translateString(lang, key);

  const router = useRouter()

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
      case "basic":
        return "bg-green-100 text-green-800 border-green-200"
      case "premium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "sold":
        return "bg-purple-100 text-purple-800 border-purple-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: CarAd["status"]) => {
    switch (status) {
      case "basic":
        return <Star className="h-3 w-3" />
      case "premium":
        return <Crown className="h-3 w-3" />
      case "sold":
        return <PackageCheck className="h-3 w-3" />
      default:
        return <XCircle className="h-3 w-3" />
    }
  }

  const imageSrc = ad.images.length > 0 ? ad.images[currentImageIndex] : "/placeholder.svg"
  const isRemote = imageSrc.startsWith("http")
  const statusLabel = findTranslationFromList(statusStatic, ad.status ?? ad.status ?? "", lang) || (ad.status ?? ad.status ?? "")
  const fuelLabel = findTranslationFromList(fuels as any[], ad.fuel ?? "", lang) || (ad.fuel ?? "");
  const gearboxLabel = findTranslationFromList(gearboxOptions as any[], ad.gearbox ?? "", lang) || (ad.gearbox ?? "");
  const conditionLabel = findTranslationFromList(conditions as any[], ad.condition ?? "", lang) || (ad.condition ?? "");
  const colorLabel = findTranslationFromList(colors as any[], ad.color ?? "", lang) || (ad.color ?? "");
  const locationLabel = findTranslationFromList(cities as any[], ad.location ?? "", lang) || (ad.location ?? "");
  const viewcountLabel = ad.viewcount || 0
  return (
    <Card className={`overflow-hidden border-0 bg-white shadow-md hover:shadow-xl transition-all duration-300 ${isLoaded ? "animate-fadeInUp opacity-100" : "opacity-0"
      }`}
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="relative group overflow-hidden bg-gray-100 h-56">
        <Image
          src={imageSrc}
          alt={`${ad.brand} ${ad.model}`}
          width={600}
          height={400}
          className="w-full h-48 object-contain transition-transform duration-700 group-hover:scale-110"
          unoptimized={isRemote}
        />

        {ad.images.length > 1 && (
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
        <div className="absolute top-3 right-3 bg-black/60 text-white px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1 backdrop-blur-sm">
          <Camera className="h-3 w-3" />
          {currentImageIndex + 1}/{Math.max(1, ad.images.length)}
        </div>

        <div className="absolute bottom-3 left-3">
          <CarStatusBadge saleType={ad.SaleType} language={language} />
        </div>

      </div>
      <CardContent className="p-4">
        <div className="mb-3">
          <h3 className="font-bold text-lg text-gray-900 line-clamp-2">
            {ad.brand} {ad.model.length > 32 ? ad.model.slice(0, 40) + "..." : ad.model}
          </h3>
          <p className="text-sm text-gray-500 mt-1">{ad.year} • {conditionLabel}</p>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Zap className="h-4 w-4 text-blue-500 flex-shrink-0" />
            <span className="truncate">
              {(ad.mileage ?? 0).toLocaleString()} {t("km") || "km"}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Fuel className="h-4 w-4 text-blue-500 flex-shrink-0" />
            <span className="truncate">{fuelLabel || "—"}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Cog className="h-4 w-4 text-blue-500 flex-shrink-0" />
            <span className="truncate">{gearboxLabel || "—"}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4 text-blue-500 flex-shrink-0" />
            <span className="truncate">{locationLabel || "—"}</span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <Badge variant="secondary" className="text-xs">
            {colorLabel || "Unknown"}
          </Badge>
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Eye className="h-4 w-4" />
            <span>{viewcountLabel || 0}</span>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-2xl font-bold text-gray-900">{(ad.price ?? 0).toLocaleString()} ₼</p>
        </div>
      </CardContent>

      <CardFooter className="pt-0  gap-2">
        <Button
          variant="outline"
          className="flex-1 border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent pointer-events-auto z-20"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            router.push(`/cars/${ad.allCarsListId}`)
          }}
          title={t("viewAd")}
          aria-label={t("viewAd")}
        >
          <Eye className="h-4 w-4 mr-2" />
          {t("view")}
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="border-green-200 text-green-600 hover:bg-green-50 bg-transparent pointer-events-auto z-20"
          onClick={(e: React.MouseEvent) => {
            e.preventDefault()
            e.stopPropagation()
            onEdit(ad.id)
          }}
          title={t("editAd")}
          aria-label={t("editAd")}
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="border-red-200 text-red-600 hover:bg-red-50 bg-transparent z-20 pointer-events-auto"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onDelete(ad.id)
          }}
          disabled={isDeleting}
          title={t("deleteAd")}
          aria-label={t("deleteAd")}
        >
          {isDeleting ? <Trash2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="border-yellow-200 text-yellow-600 hover:bg-yellow-50 bg-transparent pointer-events-auto z-20"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onMarkSold(ad.id)
          }}
          disabled={isSelling || ad.status === "sold"}
          title={ad.status === "sold" ? t("alreadySold") || "Already sold" : t("markAsSold") || "Mark as sold"}
          aria-label={ad.status === "sold" ? t("alreadySold") || "Already sold" : t("markAsSold") || "Mark as sold"}
        >
          <PackageCheck className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}

function Modal({ open, onClose, title, children }: any) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={onClose} />
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-auto max-h-[90vh] p-6">
        <div className="flex items-start justify-between gap-4">
          <h3 id="modal-title" className="text-xl font-semibold">{title}</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>✕</Button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  )
}

export default function MyAdsPage() {
  const [ads, setAds] = useState<CarAd[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"all"
    | "basic"
    | "premium"
    | "sold">("all")
  const [deletingIds, setDeletingIds] = useState<number[]>([])
  const [sellingIds, setSellingIds] = useState<number[]>([])
  const [editingId, setEditingId] = useState<number | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingData, setEditingData] = useState<any>(null)
  const [images, setImages] = useState<Array<{ id?: number; url: string }>>([])
  const [isSaving, setIsSaving] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { lang, setLang } = useDefaultLanguage();
  const t = (key: string) => translateString(lang, key);

  const { logout } = useAuth()
  const [profileData, setProfileData] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
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
    const fetch = async () => {
      try {
        const profile = await (apiClient as any).getCurrentUser()
        const rawCars: RawUserCar[] = profile?.userCars ?? []

        const normalized: CarAd[] = rawCars.map((c): CarAd => {
          const images: string[] =
            (c.images ?? [])
              .map((img) => buildImageUrl(img))
              .filter(Boolean) as string[]

          if (images.length === 0) images.push("/placeholder.svg")

          const status = c.status ?? "basic"

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
            SaleType: c.SaleType ?? "",
            calls: c.calls ?? 0,
            messages: c.messages ?? 0,
            viewcount: c.viewcount ?? 0,
            gearbox: c.gearbox ?? "",
            description: c.description,
            allCarsListId: c.allCarsListId
          }
        })

        setAds(normalized)
      } catch (err) {
        console.error("Failed to load profile or cars", err)
        setAds([])
        toast.error(t("failedLoadProfile") || "Profil yüklənmədi")
      } finally {
        setIsLoading(false)
      }
    }

    fetch()
  }, [])

  const openEditModal = async (id: number) => {
    setEditingId(id)
    setIsModalOpen(true)
    setEditingData(null)
    setImages([])

    try {
      let car: any = null
      if (apiClient && typeof (apiClient as any).get === "function") {
        const res = await (apiClient as any).get(`/user-cars/${id}`)
        car = res?.data ?? res
      } else {
        const headers = getAuthHeaders()
        const res = await fetch(`${API}/user-cars/${id}`, { headers, credentials: "include" })
        if (!res.ok) {
          const text = await res.text().catch(() => null)
          console.error("user-cars fetch failed", res.status, text)
          throw new Error("Failed to fetch car")
        }
        car = await res.json()
      }

      const imgs = (car.images ?? []).map((img: any) => ({
        id: img.id,
        url: img.url && img.url.startsWith("http") ? img.url : `${IMAGE_BASE}${img.url}`,
      }))

      setEditingData({
        brand: car.brand ?? "",
        model: car.model ?? "",
        year: car.year ?? new Date().getFullYear(),
        price: car.price ?? 0,
        mileage: car.mileage ?? 0,
        fuel: car.fuel ?? "",
        condition: car.condition ?? "",
        color: car.color ?? "",
        vinCode: car.vinCode || null,
        SaleType: car.SaleType,
        location: car.location ?? "",
        description: car.description ?? "",
        features: car.features || [],
        ban: car.ban ?? "",
        engine: car.engine ?? "",
        gearbox: car.gearbox ?? "",
        name: car.name ?? "",
        phoneCode: car.phoneCode || "",
        phone: car.phone ?? "",
        email: car.email ?? "",
      })

      setImages(imgs)
    } catch (err) {
      console.error(err)
      toast.error(t("failedLoadCar") || "Could not load car data. Check API URL and backend auth.")
      setIsModalOpen(false)
      setEditingId(null)
    }
  }

  const handleEdit = (id: number) => openEditModal(id)

  const handleDelete = async (id: number) => {
    const confirmed = typeof window !== "undefined" ? window.confirm(t("confirmDelete") || "Silmək istədiyinizə əminsiniz?") : true
    if (!confirmed) return

    setDeletingIds((prev) => [...prev, id])

    try {
      if (apiClient && typeof (apiClient as any).delete === "function") {
        await (apiClient as any).delete(`/user-cars/${id}`)
      } else {
        const headers = getAuthHeaders()
        const res = await fetch(`${API}/user-cars/${id}`, { method: "DELETE", headers, credentials: "include" })
        if (!res.ok) {
          const txt = await res.text().catch(() => null)
          console.error("delete car failed", res.status, txt)
          throw new Error("Delete failed")
        }
      }
      setAds((prev) => prev.filter((a) => a.id !== id))
      toast.success(t("deleted") || "Silindi")
    } catch (err) {
      console.error("Failed to delete ad", err)
      toast.error(t("deleteFailed") || "Silinmə alınmadı. Xahiş edirəm yenidən cəhd edin.")
    } finally {
      setDeletingIds((prev) => prev.filter((x) => x !== id))
    }
  }

  const filteredAds = ads.filter((ad) => (activeTab === "all" ? true : ad.status === activeTab))
  const getTabCount = (status: "all"
    | "basic"
    | "premium"
    | "sold") => (status === "all" ? ads.length : ads.filter((a) => a.status === status).length)

  const handleInputChange = (k: string, v: any) => {
    setEditingData((prev: any) => ({ ...prev, [k]: v }))
  }
  const MAX_IMAGES = 10

  const handleFileChange = async (files: FileList | null) => {
    if (!files || !editingId) return

    const incoming = Array.from(files)
    const allowedRemaining = MAX_IMAGES - images.length

    if (allowedRemaining <= 0) {
      toast.error(`Ümumi ${MAX_IMAGES} şəkildən artıq yükləməyə icazə yoxdur.`)
      return
    }

    if (incoming.length > allowedRemaining) {
      toast.error(`Siz yalnız ${allowedRemaining} əlavə şəkil yükləyə bilərsiniz.`)
      return
    }

    const fd = new FormData()
    for (let i = 0; i < incoming.length; i++) fd.append("images", incoming[i])
    fd.append("userCarId", String(editingId))

    try {
      let created: any = null
      if (apiClient && typeof (apiClient as any).post === "function") {
        const res = await (apiClient as any).post("/car-images/upload", fd)
        created = res?.data ?? res
      } else {
        const headers = getAuthHeaders()
        const res = await fetch(`${API}/car-images/upload`, { method: "POST", body: fd, headers: headers, credentials: "include" })
        if (!res.ok) {
          const txt = await res.text().catch(() => null)
          console.error("upload failed", res.status, txt)
          throw new Error("Upload failed")
        }
        created = await res.json()
      }

      const newImgs = (created ?? []).map((img: any) => ({
        id: img.id,
        url: img.url && img.url.startsWith("http") ? img.url : `${IMAGE_BASE}${img.url}`,
      }))

      setImages((prev) => [...prev, ...newImgs])
      toast.success(t("uploadSuccess") || "Şəkil(lər) yükləndi")
    } catch (err) {
      console.error(err)
      toast.error(t("uploadFailed") || "Image upload failed")
    }
  }

  const handleDeleteImage = async (img: { id?: number; url: string }) => {
    if (!img.id) {
      setImages((prev) => prev.filter((i) => i.url !== img.url))
      toast.success(t("imageRemoved") || "Şəkil silindi")
      return
    }

    try {
      if (apiClient && typeof (apiClient as any).delete === "function") {
        await (apiClient as any).delete(`/car-images/${img.id}`)
      } else {
        const headers = getAuthHeaders()
        const res = await fetch(`${API}/car-images/${img.id}`, { method: "DELETE", headers, credentials: "include" })
        if (!res.ok) {
          const txt = await res.text().catch(() => null)
          console.error("delete image failed", res.status, txt)
          throw new Error("Delete failed")
        }
      }
      setImages((prev) => prev.filter((i) => i.id !== img.id))
      toast.success(t("imageDeleted") || "Şəkil silindi")
    } catch (err) {
      console.error(err)
      toast.error(t("deleteFailed") || "Could not delete image")
    }
  }

  const moveImage = (from: number, to: number) => {
    if (to < 0 || to >= images.length) return;
    setImages((prev) => {
      const newArr = [...prev];
      const [item] = newArr.splice(from, 1);
      newArr.splice(to, 0, item);
      return newArr;
    });
  };

  const handleSave = async () => {
    if (!editingId || !editingData) return;

    if (!editingData.brand || String(editingData.brand).trim() === "") {
      toast.error(t("brandRequired"))
      return
    }
    if (!editingData.model || String(editingData.model).trim() === "") {
      toast.error(t("modelRequired"))
      return
    }

    setIsSaving(true);
    let featuresPayload: string[] = [];
    if (Array.isArray(editingData.features)) {
      featuresPayload = editingData.features;
    } else if (typeof editingData.features === "string" && editingData.features.trim().length > 0) {
      featuresPayload = editingData.features.split(",").map((s: string) => s.trim()).filter(Boolean);
    }

    const payload: any = {
      brand: editingData.brand,
      model: editingData.model,
      year: Number(editingData.year) || undefined,
      price: Number(editingData.price) || undefined,
      mileage: Number(editingData.mileage) || undefined,
      fuel: editingData.fuel,
      vinCode: editingData.vinCode || null,
      SaleType: editingData.SaleType,
      condition: editingData.condition,
      color: editingData.color,
      location: editingData.location,
      description: editingData.description,
      features: featuresPayload,
      ban: editingData.ban,
      engine: editingData.engine,
      gearbox: editingData.gearbox,
      images: images.map((img) => ({ id: img.id })),
    };

    try {
      let updated: any = null;
      if (apiClient && typeof (apiClient as any).put === "function") {
        const res = await (apiClient as any).put(`/user-cars/${editingId}`, payload);
        updated = res?.data ?? res;
      } else {
        const headers = { ...getAuthHeaders(), "Content-Type": "application/json" };
        const res = await fetch(`${API}/user-cars/${editingId}`, {
          method: "PUT",
          headers,
          credentials: "include",
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const txt = await res.text().catch(() => null);
          console.error("update failed", res.status, txt);
          throw new Error("Update failed");
        }
        updated = await res.json();
      }
      const normalizedImages: string[] =
        (updated.images ?? []).map((img: any) => {
          const u = img?.url ?? "";
          if (!u) return "/placeholder.svg";
          if (/^https?:\/\//i.test(u)) return u;
          const cleaned = String(u).replace(/^\/+/, "");
          return IMAGE_BASE ? `${IMAGE_BASE}${cleaned}` : cleaned;
        });

      setAds((prev) =>
        prev.map((a) =>
          a.id === updated.id
            ? {
              ...a,
              brand: updated.brand ?? a.brand,
              model: updated.model ?? a.model,
              year: updated.year ?? a.year,
              price: updated.price ?? a.price,
              mileage: updated.mileage ?? a.mileage,
              color: updated.color ?? a.color,
              vinCode: updated.vinCode || null,
              SaleType: updated.SaleType,
              fuel: updated.fuel ?? a.fuel,
              condition: updated.condition ?? a.condition,
              location: updated.location ?? a.location,
              description: updated.description ?? a.description,
              images: normalizedImages.length ? normalizedImages : a.images,
            }
            : a
        )
      );

      setIsModalOpen(false);
      setEditingId(null);
      setEditingData(null);
      toast.success(t("saved"))
    } catch (err) {
      console.error(err);
      toast.error(t("saveFailed"));
    } finally {
      setIsSaving(false);
    }
  };
  const handleFeatureChange = useCallback((featureKey: string, checked: boolean) => {
    setEditingData((prev: any) => {
      const s = new Set(prev.features)
      if (checked) s.add(featureKey)
      else s.delete(featureKey)
      return { ...prev, features: Array.from(s) }
    })
  }, [])

  const handleMarkSold = async (id: number) => {
    if (!id) return
    setSellingIds(prev => [...prev, id])
    try {
      const payload = { status: "sold" }
      if (apiClient && typeof (apiClient as any).put === "function") {
        await (apiClient as any).put(`/user-cars/${id}`, payload)
      } else {
        const headers = { ...getAuthHeaders(), "Content-Type": "application/json" }
        const res = await fetch(`${API}/user-cars/${id}`, { method: "PUT", headers, credentials: "include", body: JSON.stringify(payload) })
        if (!res.ok) {
          const txt = await res.text().catch(() => null)
          console.error("mark sold failed", res.status, txt)
          throw new Error("Mark as sold failed")
        }
      }

      setAds(prev => prev.map(a => a.id === id ? { ...a, status: "sold" } : a))
      toast.success(t("markedSold"))
    } catch (err) {
      console.error(err)
      toast.error(t("markSoldFailed"))
    } finally {
      setSellingIds(prev => prev.filter(x => x !== id))
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <p className="text-gray-400 text-lg">{t("loading")}...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer position="top-right" autoClose={4000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />

      <section className="bg-gradient-to-br from-green-500 via-green-600 rounded-md to-green-700 text-white py-12 md:py-16 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10 grid gap-2 sm:flex justify-between items-center">
          <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-green-200" />
            {t("myAds")}
          </h1>
          <Button asChild className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm">
            <Link href="/sell">
              <Plus className="h-4 w-4 mr-2" />
              <Megaphone className="h-4 w-4" />
              {t("newAd")}
            </Link>
          </Button>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "all"
          | "basic"
          | "premium"
          | "sold")} className="w-full">
          <TabsList className="grid grid-cols-1 sm:grid-cols-2 h-full w-full md:grid-cols-3 mb-8">
            <TabsTrigger value="all" className="flex items-center gap-2">
              <ReceiptText className="h-4 w-4" />
              {t("all")} ({getTabCount("all")})
            </TabsTrigger>
            <TabsTrigger value="basic" className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              {t("basic")} ({getTabCount("basic")})
            </TabsTrigger>
            {/* <TabsTrigger value="Premium" className="flex items-center gap-2">
              <Crown className="h-4 w-4" />
              {t("Premium")} ({getTabCount("premium")})
            </TabsTrigger> */}
            <TabsTrigger value="sold" className="flex items-center gap-2">
              <PackageCheck className="h-4 w-4" />
              {t("Sold")} ({getTabCount("sold")})
            </TabsTrigger>
            <TabsTrigger value="all" className="invisible" />
          </TabsList>

          <TabsContent value={activeTab}>
            {filteredAds.length === 0 ? (
              <div className="text-center py-16 animate-fadeInUp">
                <BarChart3 className="h-24 w-24 mx-auto text-gray-300 mb-6" />
                <h2 className="text-2xl font-bold text-gray-600 mb-4">{t("noAds")}</h2>
                <Button asChild className="bg-gradient-to-r from-green-600 to-green-700">
                  <Link href="/sell">
                    <Plus className="h-4 w-4 mr-2" />
                    {t("addAd")}
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAds.map((ad, index) => (
                  <AdCard key={ad.id} ad={ad} onEdit={handleEdit} onDelete={handleDelete} onMarkSold={handleMarkSold} index={index} isDeleting={deletingIds.includes(ad.id)} isSelling={sellingIds.includes(ad.id)} language={lang} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingData ? `${t("editAd")}: ${editingData.brand} ${editingData.model}` : t("loading")}>
        {editingData ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex	items-center gap-2">
                    <Car className="h-5 w-5" />
                    {t("carInfo")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-1 gap-4">
                  <div>
                    <div>
                      <label className="text-sm font-medium mb-2 block text-gray-700">{t("brand")}</label>
                      <BrandSelect
                        value={editingData.brand}
                        onChange={(v) => handleInputChange("brand", v)}
                        placeholder={t("all")}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block text-gray-700">{t("model")}</label>
                    <ModelSelect
                      value={editingData.model}
                      brand={editingData.brand}
                      onChange={(v) => handleInputChange("model", v)}
                      placeholder={t("all")}
                    />
                  </div>

                  <div>
                    <Label htmlFor="year">{t("year")}</Label>
                    <Select
                      value={editingData.year !== undefined && editingData.year !== null ? String(editingData.year) : ""}
                      onValueChange={(v) => handleInputChange("year", Number(v))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t("selectYear")} />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map((yr) => (
                          <SelectItem key={yr} value={String(yr)}>{yr}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="price">{t("priceWithCurrency") || t("price")}</Label>
                    <Input id="price" type="number" required min={0} value={editingData.price} onChange={(e) => handleInputChange("price", Number(e.target.value))} />
                  </div>

                  <div>
                    <Label htmlFor="mileage">{t("mileage") || "Mileage (km)"}</Label>
                    <Input id="mileage" required min={0} type="number" value={editingData.mileage} onChange={(e) => handleInputChange("mileage", Number(e.target.value))} placeholder="50000" />
                  </div>

                  <div>
                    <Label htmlFor="vinCode">{t("vinCode")}</Label>
                    <Input
                      type="text"
                      value={editingData.vinCode}
                      onChange={(e) => handleInputChange("vinCode", e.target.value)}
                      placeholder={t("vin.placeholder")}
                      maxLength={17}
                    />
                  </div>

                  <div>
                    <Label htmlFor="fuel">{t("fuel")}</Label>
                    <Select value={editingData.fuel} onValueChange={(v) => handleInputChange("fuel", v)} required>
                      <SelectTrigger>
                        <SelectValue placeholder={t("selectFuel")} />
                      </SelectTrigger>
                      <SelectContent>
                        {fuels.map(fuels => (
                          <SelectItem key={fuels.key} value={fuels.key}>
                            {fuels.translations[lang] ?? fuels.translations.en}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="condition">{t("condition")}</Label>
                    <Select value={editingData.condition} onValueChange={(v) => handleInputChange("condition", v)} required>
                      <SelectTrigger>
                        <SelectValue placeholder={t("selectCondition")} />
                      </SelectTrigger>
                      <SelectContent>
                        {conditions.map(conditions => (
                          <SelectItem key={conditions.key} value={conditions.key}>
                            {conditions.translations[lang] ?? conditions.translations.en}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="color">{t("color")}</Label>
                    <Select value={editingData.color} onValueChange={(v) => handleInputChange("color", v)} required>
                      <SelectTrigger>
                        <SelectValue placeholder={t("selectColor")} />
                      </SelectTrigger>
                      <SelectContent>
                        {colors.map(colors => (
                          <SelectItem key={colors.key} value={colors.key}>
                            {colors.translations[lang] ?? colors.translations.en}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="ban">{t("ban")}</Label>
                    <Select value={editingData.ban} onValueChange={(v) => handleInputChange("ban", v)}>
                      <SelectTrigger>
                        <SelectValue placeholder={t("selectBan")} />
                      </SelectTrigger>
                      <SelectContent>
                        {bodyTypes.map(bodyTypes => (
                          <SelectItem key={bodyTypes.key} value={bodyTypes.key}>
                            {bodyTypes.translations[lang] ?? bodyTypes.translations.en}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="engine">{t("engine")}</Label>
                    <Select value={editingData.engine} onValueChange={(v) => handleInputChange("engine", v)}>
                      <SelectTrigger>
                        <SelectValue placeholder={t("selectEngine")} />
                      </SelectTrigger>
                      <SelectContent>
                        {engineOptions.map(engineOptions => (
                          <SelectItem key={engineOptions.key} value={engineOptions.key}>
                            {engineOptions.translations[lang] ?? engineOptions.translations.en}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="gearbox">{t("gearbox")}</Label>
                    <Select value={editingData.gearbox} onValueChange={(v) => handleInputChange("gearbox", v)}>
                      <SelectTrigger>
                        <SelectValue placeholder={t("selectGearbox")} />
                      </SelectTrigger>
                      <SelectContent>
                        {gearboxOptions.map(gearboxOptions => (
                          <SelectItem key={gearboxOptions.key} value={gearboxOptions.key}>
                            {gearboxOptions.translations[lang] ?? gearboxOptions.translations.en}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="city">{t("city")}</Label>
                    <Select value={editingData.location} onValueChange={(v) => handleInputChange("location", v)} required>
                      <SelectTrigger>
                        <SelectValue placeholder={t("selectCity")} />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map(cities => (
                          <SelectItem key={cities.key} value={cities.key}>
                            {cities.translations[lang] ?? cities.translations.en}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="SaleType">{t("carStatus")}</Label>
                    <Select value={editingData.SaleType ?? ""} onValueChange={(v) => handleInputChange("SaleType", v)} required>
                      <SelectTrigger>
                        <SelectValue placeholder={t("selectCarStatus")} />
                      </SelectTrigger>
                      <SelectContent>
                        {carStatus.map((c) => (
                          <SelectItem key={c.key} value={c.key}>
                            {c.translations[lang] ?? c.translations.en}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t("features")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <VirtualScrollFeatures features={features} selectedFeatures={editingData.features} onFeatureChange={handleFeatureChange} language={lang} />
                </CardContent>
              </Card>


              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Camera className="h-5 w-5" />
                    {t("images")}
                  </CardTitle>
                  <p className="text-sm text-gray-600">{t("imagesDesc")}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                      <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-600 mb-2">{t("dragDrop")}</p>
                      <p className="text-sm text-gray-500 mb-4">{t("supportedFormats")}</p>
                      <input
                        required={images.length === 0}
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => handleFileChange(e.target.files)}
                        className="hidden"
                        id="image-upload"
                        disabled={images.length >= MAX_IMAGES}
                        ref={fileInputRef}
                      />
                      <Button type="button" variant="outline" className="bg-transparent" onClick={() => document.getElementById("image-upload")?.click()} disabled={images.length >= MAX_IMAGES}>
                        <Plus className="h-4 w-4 mr-2" />
                        {t("chooseImages")}
                      </Button>
                      {images.length >= MAX_IMAGES && (
                        <p className="text-sm text-orange-600 mt-2">{`Ümumi maksimum ${MAX_IMAGES} şəkilə icazə verilir.`}</p>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <ImageIcon className="h-5 w-5 text-gray-600" />
                        <h3 className="text-lg font-semibold text-gray-800">{t("uploadedImages")}</h3>
                        <Badge variant="outline" className="ml-auto">{images.length}/{MAX_IMAGES}</Badge>
                      </div>

                      {images.length === 0 ? (
                        <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                          <ImageIcon className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                          <p className="text-gray-500 mb-2">{t("noImages")}</p>
                          <p className="text-sm text-gray-400">{t("addFirstImage")}</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {images.map((image, index) => (
                            <div key={image.id ?? image.url} className="relative group bg-white rounded-lg border shadow-sm overflow-hidden">
                              <div className="aspect-video relative">
                                <Image src={image.url || "/placeholder.svg"} alt={`Car image ${index + 1}`} width={300} height={200} className="w-full h-full object-cover" />
                                <Button type="button" size="icon" variant="destructive" className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleDeleteImage(image)}>
                                  <X className="h-4 w-4" />
                                </Button>
                                {index === 0 && (
                                  <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">{t("mainImage")}</div>
                                )}
                                <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">{index + 1}/{MAX_IMAGES}</div>
                              </div>
                              <div className="p-3">
                                <p className="text-sm font-medium text-gray-800 truncate">{`Image ${index + 1}`}</p>
                                <div className="flex items-center justify-between mt-2">
                                  <p className="text-xs text-gray-500">{index === 0 ? t("mainImage") || "Main image" : `${t("image") || "Image"} ${index + 1}`}</p>
                                  <div className="flex gap-1">
                                    {index > 0 && (
                                      <Button type="button" size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => moveImage(index, index - 1)}>←</Button>
                                    )}
                                    {index < images.length - 1 && (
                                      <Button type="button" size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => moveImage(index, index + 1)}>→</Button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>{t("description")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea className="resize-none h-[200px]" value={editingData.description} onChange={(e) => handleInputChange("description", e.target.value)} placeholder={t("descriptionPlaceholder")} rows={4} />
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>{t("cancel")}</Button>
              <Button onClick={handleSave} disabled={isSaving} className="bg-green-600">{isSaving ? t("saving") : t("save")}</Button>
            </div>
          </div>
        ) : (
          <p>{t("loading")}</p>
        )}
      </Modal>
    </div>
  )
}