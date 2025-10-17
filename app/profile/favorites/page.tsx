"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { cities, colors, conditions, fuels, gearboxOptions, years } from "@/lib/car-data";
import { Badge } from "@/components/ui/badge"
import {
  Heart,
  Eye,
  MapPin,
  Car,
  Fuel,
  Camera,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Share2,
  Cog,
  ExternalLink,
  Clipboard,
  Check,
  X,
  Zap,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useDefaultLanguage } from "@/components/useLanguage"
import { translateString } from "@/lib/i18n"
import { apiClient } from "@/lib/api-client"
import { toast } from "react-toastify"
import { CarStatusBadge } from "@/components/car-status-badge"

type ImageObj = { id?: number; url: string }
type CarFromApi = {
  id: number
  brand: string
  model: string
  year?: number
  price?: number
  mileage?: number
  SaleType?: string
  fuel?: string
  transmission?: string
  color?: string
  location?: string
  images?: ImageObj[]
  condition?: string
  gearbox: string
  viewcount: number
}

type FavoriteItem = {
  id: number
  userId?: number
  carId?: number
  createdAt: string
  allCarsListId?: number
  car: CarFromApi
}
type OptionItem = {
  key: string;
  translations: { en: string; az: string;[k: string]: string };
};

function toOption(item: any): OptionItem {
  if (typeof item === "string") {
    return { key: item, translations: { en: item, az: item } };
  }
  const key = String(item?.key ?? item);
  const translations = {
    en: String(item?.translations?.en ?? item?.en ?? key),
    az: String(item?.translations?.az ?? item?.az ?? key),
    ...(item?.translations || {}),
  };
  return { key, translations };
}

function sortByLabel(list: any[] | undefined, language: string): OptionItem[] {
  return (list ?? []).map(toOption).slice().sort((a, b) => {
    const aa = (a.translations?.[language] ?? a.translations.en ?? a.key).toString();
    const bb = (b.translations?.[language] ?? b.translations.en ?? b.key).toString();
    return aa.localeCompare(bb);
  });
}

function buildImageUrls(images?: { id?: number; url: string }[]) {
  const base = (process.env.NEXT_PUBLIC_API_URL_FOR_IMAGE || "").replace(/\/+$/, "")
  if (!images || images.length === 0) return ["/placeholder.svg"]
  return images.map((img) => {
    if (!img?.url) return "/placeholder.svg"
    if (/^https?:\/\//i.test(img.url)) return img.url
    return `${base}/${img.url.replace(/^\/+/, "")}`
  })
}
function findTranslation(list: any[] | undefined, key: string | undefined, language: string) {
  if (!key) return "";
  const normalized = (list ?? []).map(toOption);
  const found = normalized.find((o) => String(o.key) === String(key));
  if (found) return found.translations?.[language] ?? found.translations.en ?? found.key;
  return String(key);
}

type ShareModalProps = {
  isOpen: boolean
  onClose: () => void
  shareUrl: string
  title?: string
  subtitle?: string
  image?: string
}

function ShareModal({ isOpen, onClose, shareUrl, title, subtitle, image }: ShareModalProps) {
  const overlayRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const lastActiveRef = useRef<HTMLElement | null>(null)
  const [isCopying, setIsCopying] = useState(false)
  const [copied, setCopied] = useState(false)
  const { lang } = useDefaultLanguage();
  const t = (key: string) => translateString(lang, key);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
      if (e.key === "Tab") {
        const focusable = overlayRef.current?.querySelectorAll<HTMLElement>(
          "button, [href], input, textarea, [tabindex]:not([tabindex='-1'])",
        )
        if (!focusable || focusable.length === 0) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    if (isOpen) {
      lastActiveRef.current = document.activeElement as HTMLElement
      document.addEventListener("keydown", onKey)
      setTimeout(() => inputRef.current?.focus(), 60)
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", onKey)
      lastActiveRef.current?.focus?.()
      document.body.style.overflow = ""
    }
  }, [isOpen, onClose])

  useEffect(() => {
    setCopied(false)
    setIsCopying(false)
  }, [lang])

  if (!isOpen) return null

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose()
  }

  const handleCopy = async () => {
    if (!shareUrl) return
    try {
      setIsCopying(true)
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      toast.success(t("copied"))
      setTimeout(() => setCopied(false), 1800)
    } catch (err) {
      console.error(err)
      toast.error(t("copyFailed"))
    } finally {
      setIsCopying(false)
    }
  }

  const handleNativeShare = async () => {
    if (!shareUrl) return
    if (navigator.share) {
      try {
        await navigator.share({
          title: title ?? document.title,
          text: subtitle ?? undefined,
          url: shareUrl,
        })
        onClose()
      } catch (err) {
        console.error("Share failed", err)
        toast.error(t("shareFailed"))
      }
    } else {
      await handleCopy()
    }
  }

  const openSocial = (service: "facebook" | "telegram" | "whatsapp") => {
    const enc = encodeURIComponent(shareUrl)
    let url = ""
    if (service === "facebook") url = `https://www.facebook.com/sharer/sharer.php?u=${enc}`
    if (service === "telegram") url = `https://t.me/share/url?url=${enc}`
    if (service === "whatsapp")
      url = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${title ? title + " - " : ""}${shareUrl}`)}`
    window.open(url, "_blank", "noopener,noreferrer,width=600,height=600")
  }

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      aria-modal="true"
      role="dialog"
    >
      <div className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5">
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 p-2 text-white">
              <Share2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold leading-none">{title ?? t("share")}</h3>
              {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (!shareUrl) return
                window.open(shareUrl, "_blank", "noopener,noreferrer")
              }}
              className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              aria-label={t("open_link")}
            >
              <ExternalLink className="h-4 w-4 text-gray-600" /> {t("open")}
            </button>

            <button onClick={onClose} className="rounded-full p-2 text-gray-600 hover:bg-gray-100" aria-label={t("close_share_modal")}>
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="px-6 py-5">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-shrink-0">
              <div className="h-28 w-40 overflow-hidden rounded-lg bg-gray-100">
                {image ? (
                  <img src={image} alt={title ?? t("preview")} className="h-full w-full object-contain" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-gray-400">{t("preview")}</div>
                )}
              </div>
            </div>

            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-500 mb-2">{t("link")}</label>
              <div className="flex w-full gap-2">
                <input
                  ref={inputRef}
                  readOnly
                  value={shareUrl}
                  onFocus={(e) => e.currentTarget.select()}
                  className="flex-1 rounded-lg border border-gray-200 px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />

                <button
                  onClick={handleCopy}
                  disabled={isCopying}
                  className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium ${copied ? "bg-green-50 text-green-700 ring-1 ring-green-100" : "bg-gray-100 text-gray-700"}`}
                  aria-label={t("copy_link")}
                >
                  {copied ? <Check className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />}
                  <span>{copied ? t("copied") : t("copy")}</span>
                </button>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button
                  onClick={handleNativeShare}
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow"
                >
                  <Share2 className="h-4 w-4" /> {t("share")}
                </button>

                <button onClick={() => openSocial("facebook")} className="inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm hover:bg-gray-50">
                  {t("Facebook")}
                </button>

                <button onClick={() => openSocial("telegram")} className="inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm hover:bg-gray-50">
                  {t("Telegram")}
                </button>

                <button onClick={() => openSocial("whatsapp")} className="inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm hover:bg-gray-50">
                  {t("Whatsapp")}
                </button>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <p className="text-xs text-gray-400">{t("urlAssurance")}</p>
                <div className="text-xs text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t px-6 py-4">
          <button
            onClick={() => {
              if (!shareUrl) return
              const subject = encodeURIComponent(title ?? t("link"))
              const body = encodeURIComponent(`${subtitle ? subtitle + "\n\n" : ""}${shareUrl}`)
              window.location.href = `mailto:?subject=${subject}&body=${body}`
            }}
            className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-gray-100"
          >
            {t("sendByMail")}
          </button>

          <button onClick={onClose} className="rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            {t("close")}
          </button>
        </div>
      </div>
    </div>
  )
}

const API_UPLOADS_BASE = (process.env.NEXT_PUBLIC_API_URL_FOR_IMAGE || "").replace(/\/+$/, "")

function safeImageUrl(i?: ImageItem) {
  if (!i) return "/placeholder.svg"
  const raw = typeof i === "string" ? i : i.url ?? ""
  if (!raw) return "/placeholder.svg"
  if (/^https?:\/\//i.test(raw)) return raw
  const cleaned = raw.replace(/^\/+/, "").replace(/^uploads\/+?/i, "")
  return API_UPLOADS_BASE ? `${API_UPLOADS_BASE}/${cleaned}` : `/${cleaned}`
}

function FavoriteCarCard({
  car,
  favoriteId,
  allCarsListId,
  onRemove,
  onShare,
  language,
  index,
}: {
  car: CarFromApi & { addedToFavorites?: string; images?: string[] }
  favoriteId: number
  allCarsListId?: number
  language: string
  onRemove: (favoriteId: number) => void
  onShare: (car: CarFromApi & { addedToFavorites?: string; images?: string[] }, allCarsListId?: number) => void
  index: number
}) {
  const { lang } = useDefaultLanguage()
  const t = (key: string) => translateString(lang, key)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), index * 100)
    return () => clearTimeout(timer)
  }, [index])

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev + 1) % (car.images?.length || 1))
  }

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev - 1 + (car.images?.length || 1)) % (car.images?.length || 1))
  }
  const images = car.images && car.images.length ? car.images.map(safeImageUrl) : ["/placeholder.svg"]
  const fuelLabel = findTranslation(fuels as any[], car.fuel ?? "", language) || (car.fuel ?? "");
  const gearboxLabel = findTranslation(gearboxOptions as any[], car.gearbox ?? "", language) || (car.gearbox ?? "");
  const conditionLabel = findTranslation(conditions as any[], car.condition ?? "", language) || (car.condition ?? "");
  const colorLabel = findTranslation(colors as any[], car.color ?? "", language) || (car.color ?? "");
  const locationLabel = findTranslation(cities as any[], car.location ?? "", language) || (car.location ?? "");
  const viewcountLabel = car.viewcount || 0

  return (
    <Card
      className={`overflow-hidden border-0 bg-white shadow-md hover:shadow-xl transition-all duration-300 ${isLoaded ? "animate-fadeInUp opacity-100" : "opacity-0"
        }`}
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="relative group overflow-hidden bg-gray-100 h-56">
        <Image
          src={car.images?.[currentImageIndex] || "/placeholder.svg"}
          alt={`${car.brand} ${car.model}`}
          width={300}
          height={200}
          unoptimized
          className="w-full h-48 object-contain transition-transform duration-700 group-hover:scale-110"
        />
        {/* {car.condition === "premium" || car.condition === "Premium" || car.condition === "New" ? (
          <Badge className="absolute top-3 left-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 z-10">
            {t("featured")}
          </Badge>
        ) : null} */}

        {images.length > 1 && (
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

        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1">
          {(car.images || []).map((_, imgIndex) => (
            <button
              key={imgIndex}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${imgIndex === currentImageIndex ? "bg-white scale-125" : "bg-white/50"
                }`}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setCurrentImageIndex(imgIndex)
              }}
            />
          ))}
        </div>

        <div className="absolute top-1 left-3 bg-black/70 text-white px-2 py-1 rounded-md text-xs flex items-center gap-1">
          <Camera className="h-3 w-3" />
          {currentImageIndex + 1}/{car.images?.length || 1}
        </div>
        <div className="absolute bottom-3 left-3">
          <CarStatusBadge saleType={car.SaleType} language={language} />
        </div>

        <div className="absolute top-3 right-3 flex gap-2">
          <Button
            size="icon"
            variant="ghost"
            className="bg-white/90 hover:bg-white backdrop-blur-sm z-10 transition-all duration-300 hover:scale-110"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onShare(car, allCarsListId)
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
              onRemove(favoriteId)
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
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
    </Card>)
}


type ImageItem = string | { id?: number; url?: string }

type Seller = {
  id?: number
  firstName?: string
  lastName?: string
  email?: string
  phoneNumber?: string | null
  phoneCode?: string | null
}

type CarType = {
  id: number
  brand: string
  model: string
  year?: number
  price?: number
  mileage?: number
  fuel?: string
  gearbox?: string
  transmission?: string
  color?: string
  location?: string
  bodyType?: string
  condition?: string
  engine?: string
  viewcount?: number
  power?: string
  email?: string | null
  name?: string | null
  phone?: string | null
  phoneCode?: string | null
  drivetrain?: string
  images?: ImageItem[]
  description?: string
  features?: string[]
  seller?: {
    name?: string
    phoneNumber?: string
    phoneCode?: string
    email?: string
    location?: string
  }
  user?: Seller
  status?: string
  ban?: string
  createdAt?: string
}

export default function FavoritesPage() {
  const { lang } = useDefaultLanguage()
  const t = (key: string) => translateString(lang, key)
  const [favorites, setFavorites] = useState<FavoriteItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isShareOpen, setIsShareOpen] = useState(false)
  const [shareUrl, setShareUrl] = useState<string>("")
  const [selectedCar, setSelectedCar] = useState<(CarFromApi & { addedToFavorites?: string; images?: string[] }) | null>(null)


  useEffect(() => {
    let mounted = true
    const fetchFavorites = async () => {
      try {
        const res = await apiClient.getFavorites()
        if (!Array.isArray(res)) {
          console.warn("getFavorites returned unexpected shape:", res)
          toast.error(t("loadFavoritesFailed"))
          setFavorites([])
        } else if (mounted) {
          const normalized: FavoriteItem[] = res.map((fav: any) => {
            const car: CarFromApi = fav.car || {}
            const imageUrls = buildImageUrls(car.images as ImageObj[])
            const carWithImages = { ...car, images: imageUrls, addedToFavorites: fav.createdAt }
            return { ...fav, car: carWithImages }
          })
          setFavorites(normalized)
        }
      } catch (err) {
        toast.error(t("loadFavoritesFailed"))
        setFavorites([])
      } finally {
        if (mounted) setIsLoading(false)
      }
    }

    fetchFavorites()
    return () => {
      mounted = false
    }
  }, [])

  const removeFavorite = async (favoriteId: number) => {
    setFavorites(prev => prev.filter(f => f.id !== favoriteId));
    try {
      await apiClient.removeFavorite(favoriteId);
    } catch (err) {
      toast.error(t("removeFavoriteFailed"))
    }
  };

  const handleShare = (car: CarFromApi & { addedToFavorites?: string; images?: string[] }, allCarsListId?: number) => {
    setSelectedCar(car)
    setShareUrl(`${window.location.origin}/cars/${allCarsListId}`)
    setIsShareOpen(true)
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
      <section className="bg-gradient-to-br from-red-500 rounded-md via-red-600 to-red-700 text-white py-12 md:py-16 relative overflow-hidden">
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
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {favorites.length === 0 ? (
          <div className="text-center py-16 animate-fadeInUp">
            <Heart className="h-24 w-24 mx-auto text-gray-300 mb-6" />
            <h2 className="text-2xl font-bold text-gray-600 mb-4">{t("noFavorites")}</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">{t("noFavoritesDesc")}</p>
            <Button asChild className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
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
              {favorites.map((fav, index) => (
                <FavoriteCarCard
                  key={fav.id}
                  favoriteId={fav.id}
                  allCarsListId={fav.allCarsListId}
                  car={fav.car as any}
                  language={lang}
                  onRemove={removeFavorite}
                  onShare={handleShare}
                  index={index}
                />
              ))}
            </div>
          </>
        )}
      </div>
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        shareUrl={shareUrl}
        title={`${selectedCar?.brand ?? ''} ${selectedCar?.model ?? ''}`}
        subtitle={`${selectedCar?.price ?? ""} ₼`}
        image={selectedCar?.images?.[0] ?? "/placeholder.svg"}
      />
    </div>
  )
}