"use client"

import React, { useEffect, useRef, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Heart,
  Phone,
  Mail,
  Share2,
  MapPin,
  Fuel,
  Gauge,
  Palette,
  Shield,
  ChevronLeft,
  ChevronRight,
  Clipboard,
  Check,
  X,
  ExternalLink,
  CarFront,
  Car,
  IdCard,
  Puzzle,
  Cog,
} from "lucide-react"
import { Navbar } from "@/components/navbar"
import { useLanguage } from "@/hooks/use-language"
import { getTranslation } from "@/lib/i18n"
import { apiClient } from "@/lib/api-client"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

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
  condition?: string
  engine?: string
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

const API_UPLOADS_BASE = (process.env.NEXT_PUBLIC_API_URL_FOR_IMAGE || "").replace(/\/+$/, "")

function safeImageUrl(i?: ImageItem) {
  if (!i) return "/placeholder.svg"
  const raw = typeof i === "string" ? i : i.url ?? ""
  if (!raw) return "/placeholder.svg"
  if (/^https?:\/\//i.test(raw)) return raw
  const cleaned = raw.replace(/^\/+/, "").replace(/^uploads\/+?/i, "")
  return API_UPLOADS_BASE ? `${API_UPLOADS_BASE}/${cleaned}` : `/${cleaned}`
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
  const { language } = useLanguage()
  const t = (key: string): string => {
    const val = getTranslation(language, key)
    return typeof val === "string" ? val : key
  }
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
  }, [language])

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
              aria-label="Open link in new tab"
            >
              <ExternalLink className="h-4 w-4 text-gray-600" /> {t("open")}
            </button>

            <button onClick={onClose} className="rounded-full p-2 text-gray-600 hover:bg-gray-100" aria-label="Close share modal">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="px-6 py-5">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-shrink-0">
              <div className="h-28 w-40 overflow-hidden rounded-lg bg-gray-100">
                {image ? (
                  <img src={image} alt={title ?? "preview"} className="h-full w-full object-contain" />
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
                  aria-label="Copy link"
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
                  Facebook
                </button>

                <button onClick={() => openSocial("telegram")} className="inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm hover:bg-gray-50">
                  Telegram
                </button>

                <button onClick={() => openSocial("whatsapp")} className="inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm hover:bg-gray-50">
                  WhatsApp
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
              const subject = encodeURIComponent(title ?? "Link")
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

type ContactModalProps = {
  isOpen: boolean
  onClose: () => void
  toEmail?: string | null
  subject?: string
  prefillPhone?: string | null
  carTitle?: string
}

function ContactModal({ isOpen, onClose, toEmail, subject, prefillPhone, carTitle }: ContactModalProps) {
  const overlayRef = useRef<HTMLDivElement | null>(null)
  const [name, setName] = useState("")
  const [fromEmail, setFromEmail] = useState("")
  const [message, setMessage] = useState("")
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null | undefined>(null)
  const { language } = useLanguage()
  const t = (key: string): string => {
    const val = getTranslation(language, key)
    return typeof val === "string" ? val : key
  }
  useEffect(() => {
    if (isOpen) {
      setError(null)
      setSent(false)
      setTimeout(() => overlayRef.current?.querySelector<HTMLInputElement>("input")?.focus(), 60)
      document.body.style.overflow = "hidden"
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const lang = (language || "").toString().toLowerCase()
    let defaultMsg = ""
    if (lang.startsWith("az")) {
      defaultMsg = `Salam,\n\nMən ${carTitle ?? ""} avtomobili ilə maraqlanıram. Xahiş edirəm əlavə məlumat və təklif etdiyiniz şərtlər haqqında ətraflı məlumat verəsiniz.\n\nƏvvəlcədən təşəkkür edirəm.\n`
    } else {
      defaultMsg = `Hello,\n\nI'm interested in the ${carTitle ?? ""} car. Please send more details and the terms you offer.\n\nThank you in advance.\n`
    }
    setMessage(defaultMsg)
  }, [isOpen, language, carTitle])

  if (!isOpen) return null

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose()
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSending(true)
    setError(null)

    const payload = {
      to: toEmail || "",
      subject: subject || `${t("interestedIn")}: ${carTitle ?? ""}`,
      name,
      from: fromEmail,
      message,
      phone: prefillPhone || undefined,
    }

    try {
      if (apiClient && typeof (apiClient as any).sendEmail === "function") {
        try {
          const res = await apiClient.sendEmail(payload)
          if (res.success) {
            setSent(true)
            toast.success(t("messageSentSuccessfully"))
            setTimeout(() => {
              window.location.reload()
            }, 2000)
          } else {
            throw new Error("Server göndərmə xətası")
          }
        } catch (err: any) {
          console.error(err)
          const errMsg = err?.message || t("sendError")
          setError(errMsg)
          toast.error(errMsg)
        }
      } else {
        const API_BASE = process.env.NEXT_PUBLIC_API_URL || ""
        if (API_BASE) {
          try {
            const res = await apiClient.sendEmail(payload)
            setSent(true)
            toast.success(t("messageSentSuccessfully"))
          } catch (err: any) {
            console.error(err)
            const errMsg = err?.message || t("serverSendError")
            setError(errMsg)
            toast.error(errMsg)
          }
        } else {
          const mailtoTo = encodeURIComponent(String(toEmail || ""))
          const mailSubj = encodeURIComponent(payload.subject || "")
          const mailBody = encodeURIComponent(
            `${payload.message}\n\n${t("name")}: ${payload.name || ""}\n${t("email")}: ${payload.from || ""}\n${t("phone")}: ${payload.phone || ""}`
          )
          window.location.href = `mailto:${mailtoTo}?subject=${mailSubj}&body=${mailBody}`
          setSent(true)
          toast.success(t("messageSentSuccessfully"))
        }
      }
    } catch (err: any) {
      console.error(err)
      const errMsg = err?.message || t("sendError")
      setError(errMsg)
      toast.error(errMsg)
    } finally {
      setSending(false)
    }
  }

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
    >
      <form onSubmit={handleSubmit} className="w-full max-w-md transform overflow-hidden rounded-xl bg-white shadow-lg ring-1 ring-black/5">
        <div className="flex items-center justify-between px-5 py-3 border-b">
          <div>
            <h3 className="text-lg font-semibold">{t("sendMessageToSeller")}</h3>
            <p className="text-xs text-gray-500 mt-0.5">{t("writeYourQuestion")}</p>
          </div>

          <button type="button" onClick={onClose} className="text-gray-600 rounded-full p-2 hover:bg-gray-100">
            ✕
          </button>
        </div>

        <div className="px-5 py-4 space-y-3">
          {sent ? <div className="rounded-md bg-green-50 px-4 py-3 text-green-700">{t("messageSentSuccessfully")}</div> : null}
          {error ? <div className="rounded-md bg-red-50 px-4 py-3 text-red-700">{error}</div> : null}

          <div>
            <label className="text-xs text-gray-500">{t("nameOptional")}</label>
            <input
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("enterYourName")}
            />
          </div>

          <div>
            <label className="text-xs text-gray-500">{t("emailForContact")}</label>
            <input
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={fromEmail}
              onChange={(e) => setFromEmail(e.target.value)}
              placeholder={t("yourEmail")}
              type="email"
            />
          </div>

          <div>
            <label className="text-xs text-gray-500">{t("message")}</label>
            <textarea
              className="mt-1 h-28 w-full rounded-md border resize-none px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs text-gray-500">{t("sellersEmail")}</label>
            <input readOnly value={toEmail ?? ""} className="mt-1 w-full rounded-md border bg-gray-50 px-3 py-2 text-sm" />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t px-5 py-3">
          <button
            type="button"
            onClick={() => {
              const mailtoTo = encodeURIComponent(String(toEmail || ""))
              const mailSubj = encodeURIComponent(subject || `${t("interestedIn")}: ${carTitle ?? ""}`)
              const mailBody = encodeURIComponent(`${message}\n\n${t("name")}: ${name}\n${t("email")}: ${fromEmail}\n${t("phone")}: ${prefillPhone || ""}`)
              window.location.href = `mailto:${mailtoTo}?subject=${mailSubj}&body=${mailBody}`
            }}
            className="rounded-md px-3 py-2 text-sm hover:bg-gray-100"
          >
            {t("openWithMailClient")}
          </button>

          <button type="submit" disabled={sending} className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
            {sending ? t("sending") : t("sendMessage")}
          </button>
        </div>
      </form>
    </div>
  )
}

export default function CarDetailPage() {
  const params = useParams()
  const router = useRouter()
  const idParam = Array.isArray(params?.id) ? params?.id[0] : params?.id
  const id = idParam ? Number(idParam) : NaN

  const [loading, setLoading] = useState(true)
  const [car, setCar] = useState<CarType | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [error, setError] = useState<string | null | undefined>(null)

  const [isShareOpen, setIsShareOpen] = useState(false)
  const [shareUrl, setShareUrl] = useState<string>("")

  const [contactOpen, setContactOpen] = useState(false)

  const [descExpanded, setDescExpanded] = useState(false)
  const descRef = useRef<HTMLDivElement | null>(null)
  const animDuration = 300
  const transitionProperty = `max-height ${animDuration}ms ease, opacity ${Math.round(animDuration * 0.7)}ms ease, transform ${animDuration}ms cubic-bezier(.2,.8,.2,1)`
  const { language, changeLanguage } = useLanguage()
  const t = (key: string): string => {
    const val = getTranslation(language, key)
    return typeof val === "string" ? val : key
  }
  useEffect(() => {
    const el = descRef.current
    if (!el) return
    el.style.overflow = "hidden"
    el.style.transition = transitionProperty
    el.style.maxHeight = "0px"
    el.style.opacity = "0"
    el.style.transform = "translateY(-6px)"
    el.style.display = "none"
  }, [])

  function toggleDesc() {
    const el = descRef.current
    if (!el) {
      setDescExpanded((s) => !s)
      return
    }

    const clone = el.cloneNode(true) as HTMLDivElement
    el.parentNode?.replaceChild(clone, el)
    descRef.current = clone
    const node = descRef.current!

    node.style.overflow = "hidden"
    node.style.transition = transitionProperty

    const cleanupEnd = (wasExpanding: boolean) => {
      if (wasExpanding) {
        node.style.maxHeight = "none"
        node.style.opacity = "1"
        node.style.transform = "translateY(0)"
      } else {
        node.style.display = "none"
      }
    }

    let fallbackTimer: number | undefined
    const setFallback = (wasExpanding: boolean) => {
      window.clearTimeout((fallbackTimer as unknown) as number)
      fallbackTimer = window.setTimeout(() => cleanupEnd(wasExpanding), animDuration + 120)
    }

    if (!descExpanded) {
      node.style.display = "block"
      node.style.maxHeight = "0px"
      node.style.opacity = "0"
      node.style.transform = "translateY(-6px)"
      void node.offsetHeight
      const target = node.scrollHeight
      node.style.maxHeight = `${target}px`
      node.style.opacity = "1"
      node.style.transform = "translateY(0)"
      const onEnd = (e: TransitionEvent) => {
        if (e.propertyName !== "max-height") return
        node.removeEventListener("transitionend", onEnd)
        cleanupEnd(true)
        window.clearTimeout((fallbackTimer as unknown) as number)
      }
      node.addEventListener("transitionend", onEnd)
      setFallback(true)
      setDescExpanded(true)
      setTimeout(() => {
        try {
          node.scrollIntoView({ behavior: "smooth", block: "nearest" })
        } catch { }
      }, animDuration + 20)
    } else {
      const height = node.scrollHeight
      node.style.maxHeight = `${height}px`
      node.style.opacity = "1"
      node.style.transform = "translateY(0)"
      void node.offsetHeight
      node.style.maxHeight = `0px`
      node.style.opacity = "0"
      node.style.transform = "translateY(-6px)"
      const onEnd = (e: TransitionEvent) => {
        if (e.propertyName !== "max-height") return
        node.removeEventListener("transitionend", onEnd)
        cleanupEnd(false)
        window.clearTimeout((fallbackTimer as unknown) as number)
      }
      node.addEventListener("transitionend", onEnd)
      setFallback(false)
      setDescExpanded(false)
    }
  }
  useEffect(() => {
    if (!id || Number.isNaN(id)) {
      const msg = t("invalidId") || t("fetchError")
      setError(msg)
      setLoading(false)
      toast.error(msg)
      return
    }

    const controller = new AbortController()
    const signal = controller.signal

    async function fetchCar() {
      setLoading(true)
      setError(null)
      try {
        const res = await apiClient.getCarId(id)
        if (!res) {
          const msg = t("carNotFound")
          setError(msg)
          setCar(null)
          setLoading(false)
          toast.error(msg)
          return
        }
        setCar(res)
        setCurrentImageIndex(0)
      } catch (e: any) {
        console.error(e)
        const msg = (e && (e as any).message) ? String((e as any).message) : t("fetchError")
        setError(msg)
        toast.error(msg)
      } finally {
        setLoading(false)
      }
    }

    fetchCar()
    return () => controller.abort()
  }, [id, language])

  useEffect(() => {
    if (!car) return
    const base = process.env.NEXT_PUBLIC_SITE_URL || (typeof window !== "undefined" ? window.location.origin : "")
    setShareUrl(`${base}/cars/${car.id}`)
  }, [car])

  const nextImage = () => {
    if (!car?.images?.length) return
    setCurrentImageIndex((prev) => (prev + 1) % (car.images!.length || 1))
  }

  const prevImage = () => {
    if (!car?.images?.length) return
    setCurrentImageIndex((prev) => (prev - 1 + (car.images!.length || 1)) % (car.images!.length || 1))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar currentLanguage={language} onLanguageChange={changeLanguage} />
        <div className="container mx-auto px-4 py-10">{t("loading")}</div>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar currentLanguage={language} onLanguageChange={changeLanguage} />
        <div className="container mx-auto px-4 py-6">
          <Card>
            <CardContent>
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={() => router.back()}>{t("back")}</Button>
            </CardContent>
          </Card>
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    )
  }

  if (!car) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar currentLanguage={language} onLanguageChange={changeLanguage} />
        <div className="container mx-auto px-4 py-6">
          <Card>
            <CardContent>
              <p>{t("carNotFound")}</p>
              <Button onClick={() => router.push("/")}>{t("toHome")}</Button>
            </CardContent>
          </Card>
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    )
  }

  const images = car.images && car.images.length ? car.images.map(safeImageUrl) : ["/placeholder.svg"]
  const sellerName = car.user ? `${car.user.firstName ?? ""} ${car.user.lastName ?? ""}`.trim() : car.name
  const sellerEmail = car.email ?? car.user?.email
  const phoneCode = car.seller?.phoneCode ?? car.user?.phoneCode ?? "";
  const phone = car.seller?.phoneNumber ?? car.user?.phoneNumber ?? "";
  const sellerPhone = `${phoneCode}${phone}`;
  console.log(phone)
  console.log(phoneCode)
  const descriptionText = String(car.description ?? "")
  const isLongDesc = descriptionText.length > 200
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar currentLanguage={language} onLanguageChange={changeLanguage} />

      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8">
          <div className="xl:col-span-2 space-y-4 md:space-y-6">
            <Card>
              <CardContent className="p-0">
                <div className="relative">
                  <Image
                    src={images[currentImageIndex] || "/placeholder.svg"}
                    alt={`${car.brand} ${car.model} - Image ${currentImageIndex + 1}`}
                    width={600}
                    height={400}
                    className="w-full h-64 md:h-96 object-contain rounded-t-lg"
                  />

                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white"
                    onClick={prevImage}
                    aria-label={t("previousImage")}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white"
                    onClick={nextImage}
                    aria-label={t("nextImage")}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>

                  <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded-md text-sm">
                    {currentImageIndex + 1} / {images.length}
                  </div>

                  <div className="absolute top-4 right-4 flex gap-2">
                    <Button size="icon" variant="secondary" aria-label={t("favorite")}>
                      <Heart className="h-4 w-4" />
                    </Button>

                    <Button
                      size="icon"
                      variant="secondary"
                      onClick={() => setIsShareOpen(true)}
                      aria-label={t("share")}
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-5 gap-2 p-4">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`relative overflow-hidden rounded-md ${currentImageIndex === index ? "ring-2 ring-blue-500" : ""}`}
                    >
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`${car.brand} ${car.model} thumbnail ${index + 1}`}
                        width={120}
                        height={80}
                        className="w-full h-16 object-contain hover:opacity-80 transition-opacity"
                      />
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-3xl">
                      {car.brand} {car.model}
                    </CardTitle>
                    <p className="text-gray-600 text-lg">
                      {car.year} • {t(car.condition ?? "")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-blue-600">{(car.price ?? 0).toLocaleString()} ₼</p>
                    {car.status ? (
                      <div className="mt-2">
                        <Badge>{car.status}</Badge>
                      </div>
                    ) : null}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
                  <div className="flex items-center gap-2">
                    <Gauge className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">{t("mileage")}</p>
                      <p className="font-semibold">{(car.mileage ?? 0).toLocaleString()} km</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Fuel className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">{t("fuel")}</p>
                      <p className="font-semibold">{t(car.fuel ?? "")}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Cog className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">{t("gearbox")}</p>
                      <p className="font-semibold">{car.gearbox ?? car.transmission ?? t("-")}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Palette className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">{t("color")}</p>
                      <p className="font-semibold">{t(car.color ?? "")}</p>
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <CarFront className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">{t("engine")}</p>
                      <p className="font-semibold">{car.engine}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Car className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">{t("bodyType")}</p>
                      <p className="font-semibold">{car.ban}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <IdCard className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">{t("brand")}</p>
                      <p className="font-semibold">{car.brand}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Puzzle className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">{t("model")}</p>
                      <p className="font-semibold">{car.model}</p>
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                <div>
                  <h3 className="text-lg font-semibold mb-3">{t("description")}</h3>

                  <p className="text-gray-700 leading-relaxed">
                    {descriptionText.slice(0, 200)}
                    {isLongDesc && !descExpanded ? "..." : ""}
                  </p>

                  {isLongDesc ? (
                    <>
                      <div
                        id="car-description-more"
                        ref={descRef}
                        className="overflow-hidden mt-2"
                        aria-hidden={!descExpanded}
                        style={{ display: descExpanded ? "block" : "none" }}
                      >
                        <p className="text-gray-700 leading-relaxed">{descriptionText.slice(200)}</p>
                      </div>

                      <button
                        onClick={toggleDesc}
                        aria-expanded={descExpanded}
                        aria-controls="car-description-more"
                        className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:underline"
                      >
                        {descExpanded ? t("showLess") : t("showMore")}
                      </button>
                    </>
                  ) : null}
                </div>

              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("features")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3">
                  {(car.features ?? []).map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-green-500" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t("contactSeller")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-semibold">{sellerName}</p>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    {car.location}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href={sellerPhone ? `tel:${String(sellerPhone).replace(/\s+/g, "")}` : "#"}
                      className="inline-flex items-center justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700"
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      {sellerPhone ?? t("noPhone")}
                    </a>

                    <button type="button" onClick={() => setContactOpen(true)} className="inline-flex items-center justify-center rounded-md border px-3 py-2 text-sm font-medium hover:bg-gray-50">
                      <Mail className="h-4 w-4 mr-2" />
                      {t("sendEmail")}
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("quickInfo")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">{t("brand")}:</span>
                  <span className="font-semibold">{car.brand}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t("model")}:</span>
                  <span className="font-semibold">{car.model}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t("year")}:</span>
                  <span className="font-semibold">{car.year}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t("condition")}:</span>
                  <Badge variant="outline">{t(car.condition ?? "")}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t("location")}:</span>
                  <span className="font-semibold">{t(car.location ?? "")}</span>
                </div>
                {car.createdAt ? (
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t("Creation_date")}:</span>
                    <span className="font-semibold">{new Date(car.createdAt).toLocaleDateString()}</span>
                  </div>
                ) : null}
              </CardContent>
            </Card>

            <Card className="border-yellow-200 bg-yellow-50">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-yellow-800 mb-1">{t("safetyTip")}</h4>
                    <p className="text-sm text-yellow-700">{t("safetyText")}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        shareUrl={shareUrl}
        title={`${car.brand} ${car.model}`}
        subtitle={`${car.price ?? ""} ₼`}
        image={images[0]}
      />
      <ContactModal
        isOpen={contactOpen}
        onClose={() => setContactOpen(false)}
        toEmail={sellerEmail}
        prefillPhone={sellerPhone}
        subject={`${car.brand} ${car.model}`}
        carTitle={`${car.brand} ${car.model}`}
      />

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  )
}
