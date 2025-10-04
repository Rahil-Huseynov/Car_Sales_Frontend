"use client"
import React, { useEffect, useMemo, useState, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Upload, Car, User, X, Plus, Camera, ImageIcon, Phone } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { useLanguage } from "@/hooks/use-language"
import { getTranslation } from "@/lib/i18n"
import { apiClient } from "@/lib/api-client"
import { useAuth } from "@/lib/auth-context"
import { bodyTypes, cities, colors, conditions, engineOptions, features, fuels, gearboxOptions, years } from "@/lib/car-data"
import CountryCodeSelect from "@/components/CountryCodeSelect"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import BrandSelect from "@/components/BrandSelect"
import ModelSelect from "@/components/ModelSelect"

type UserType = {
  id: number
  firstName?: string
  lastName?: string
  email?: string
  phoneNumber?: string
  role?: string
  createdAt?: string
}

type ImageItem = {
  id: string
  url: string
  name: string
  file: File
}

const VirtualScrollFeatures = ({
  features,
  selectedFeatures,
  onFeatureChange,
  language
}: {
  features: string[]
  selectedFeatures: string[]
  onFeatureChange: (feature: string, checked: boolean) => void
  language: string
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 40 })
  const [searchTerm, setSearchTerm] = useState("")

  const itemHeight = 50
  const itemWidth = 200
  const columns = 4

  const filteredFeatures = useMemo(() => {
    if (!searchTerm) return features
    return features.filter((feature) =>
      feature.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [features, searchTerm])

  const totalRows = Math.ceil(filteredFeatures.length / columns)

  const updateVisibleRange = useCallback(() => {
    if (!containerRef.current) return
    const scrollTop = containerRef.current.scrollTop
    const containerHeight = containerRef.current.clientHeight || 0

    const startRow = Math.floor(scrollTop / itemHeight)
    const visibleRows = Math.ceil(containerHeight / itemHeight)
    const buffer = 4

    const newStart = Math.max(0, startRow * columns - buffer * columns)
    const newEnd = Math.min(
      filteredFeatures.length,
      (startRow + visibleRows + buffer) * columns
    )

    setVisibleRange({ start: newStart, end: newEnd })
  }, [filteredFeatures.length])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    updateVisibleRange()
    el.addEventListener("scroll", updateVisibleRange)
    const ro = new ResizeObserver(updateVisibleRange)
    ro.observe(el)
    return () => {
      el.removeEventListener("scroll", updateVisibleRange)
      ro.disconnect()
    }
  }, [updateVisibleRange])

  const visibleFeatures = filteredFeatures.slice(visibleRange.start, visibleRange.end)

  return (
    <div className="space-y-4">
      <Input
        placeholder={language === "az" ? "Xüsusiyyət axtar..." : "Search features..."}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div
        ref={containerRef}
        className="border rounded-lg overflow-auto bg-gray-50"
        style={{ height: "400px", position: "relative" }}
      >
        <div
          style={{
            height: `${totalRows * itemHeight}px`,
            width: `${columns * itemWidth}px`,
            position: "relative",
          }}
        >
          {visibleFeatures.map((feature, i) => {
            const idx = visibleRange.start + i
            const row = Math.floor(idx / columns)
            const col = idx % columns

            return (
              <div
                key={feature + "-" + idx}
                className="flex items-center space-x-2 p-2 hover:bg-white rounded-lg transition-colors absolute"
                style={{
                  top: `${row * itemHeight}px`,
                  left: `${col * itemWidth}px`,
                  width: `${itemWidth}px`,
                  height: `${itemHeight}px`,
                  boxSizing: "border-box",
                }}
              >
                <Checkbox
                  id={`feature-${idx}`}
                  checked={selectedFeatures.includes(feature)}
                  onCheckedChange={(checked) =>
                    onFeatureChange(feature, checked as boolean)
                  }
                />
                <Label
                  htmlFor={`feature-${idx}`}
                  className="text-sm flex-1 cursor-pointer select-none"
                >
                  {feature}
                </Label>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default function SellPage() {
  const router = useRouter()
  const { logout } = useAuth()
  const [page, setPage] = useState<number>(1);
  const [profileData, setProfileData] = useState<UserType | null>(null)
  const [loadingProfile, setLoadingProfile] = useState(true)
  const [selectedBrand, setSelectedBrand] = useState<string>("all");
  const [selectedModel, setSelectedModel] = useState<string>("all");
  const { language, changeLanguage } = useLanguage()
  const t = (key: string): string => {
    const val = getTranslation(language, key)
    return typeof val === "string" ? val : key
  }
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await apiClient.getCurrentUser()
        setProfileData(data)
      } catch {
        logout()
      } finally {
        setLoadingProfile(false)
      }
    }
    fetchUser()
  }, [logout])

  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    year: "",
    price: "",
    mileage: "",
    fuel: "",
    transmission: "",
    condition: "",
    color: "",
    ban: "",
    location: "",
    engine: "",
    gearbox: "",
    description: "",
    features: [] as string[],
    name: "",
    phone: "",
    email: "",
    userId: profileData?.id ?? null,
    status: ""
  })

  useEffect(() => {
    if (profileData) {
      let initialPhone = profileData.phoneNumber || ""
      let detectedCode = "+93"
      let numberPart = initialPhone

      if (initialPhone.startsWith("+")) {
        const m = initialPhone.match(/^\+[\d]{1,4}/)
        if (m) {
          detectedCode = m[0]
          numberPart = initialPhone.slice(m[0].length)
        }
      }

      setPhoneCode(detectedCode)
      setFormData((prev) => ({
        ...prev,
        userId: profileData.id,
        name: `${profileData.firstName || ""} ${profileData.lastName || ""}`.trim(),
        email: profileData.email || "",
        phone: numberPart || ""
      }))
    }
  }, [profileData])

  const [images, setImages] = useState<ImageItem[]>([])
  const [phoneCode, setPhoneCode] = useState<string>("+93")

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken")
    if (!accessToken) router.push("/auth/login")
  }, [router])

  const handleFeatureChange = useCallback((feature: string, checked: boolean) => {
    setFormData((prev) => {
      const s = new Set(prev.features)
      if (checked) s.add(feature)
      else s.delete(feature)
      return { ...prev, features: Array.from(s) }
    })
  }, [])

  const MAX_FILE_SIZE = 1 * 1024 * 1024

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const remainingSlots = 10 - images.length
    if (remainingSlots <= 0) {
      toast.warning(t("maxImages"), { position: "top-right" })
      return
    }
    const filesArray = Array.from(files)
    const filesToConsider = filesArray.slice(0, remainingSlots)
    const oversized = filesToConsider.filter((f) => f.size > MAX_FILE_SIZE)
    const validFiles = filesToConsider.filter((f) => f.size <= MAX_FILE_SIZE)
    if (oversized.length > 0) {
      const names = oversized.map((f) => f.name).join(", ")
      const msg = t("oversizedFiles").replace("{names}", names)
      toast.error(msg, { position: "top-right", autoClose: 6000 })
    }

    if (validFiles.length === 0) {
      if (e.target) e.target.value = ""
      return
    }

    const newImages = validFiles.map((file, i) => ({
      id: `${Date.now()}-${i}-${file.name}`,
      url: URL.createObjectURL(file),
      name: file.name,
      file,
    }))

    setImages((prev) => {
      const combined = [...prev, ...newImages].slice(0, 10)
      return combined
    })
    if (e.target) e.target.value = ""
  }

  const removeImage = (id: string) => {
    setImages((prev) => {
      const toRemove = prev.find((p) => p.id === id)
      if (toRemove) {
        try { URL.revokeObjectURL(toRemove.url) } catch { }
      }
      return prev.filter((img) => img.id !== id)
    })
  }

  const moveImage = (from: number, to: number) => {
    setImages((prev) => {
      const arr = [...prev]
      const [moved] = arr.splice(from, 1)
      arr.splice(to, 0, moved)
      return arr
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const brandVal = (formData.brand || "").toString().trim() || (selectedBrand && selectedBrand !== "all" ? selectedBrand : "");
    const modelVal = (formData.model || "").toString().trim() || (selectedModel && selectedModel !== "all" ? selectedModel : "");
    const yearVal = (formData.year || "").toString().trim();
    const priceVal = (formData.price || "").toString().trim();
    const mileageVal = (formData.mileage || "").toString().trim();

    if (!brandVal || !modelVal || !yearVal || !priceVal || !mileageVal) {
      toast.warn(t("fillRequired"), { position: "top-right", autoClose: 3000 })
      return;
    }
    const priceNum = Number(priceVal)
    const mileageNum = Number(mileageVal)
    if (isNaN(priceNum) || priceNum <= 0) {
      toast.warn(t("pricePositive"), { position: "top-right" })
      return
    }
    if (isNaN(mileageNum) || mileageNum < 0) {
      toast.warn(t("mileageValid"), { position: "top-right" })
      return
    }
    try {
      const payload = {
        brand: brandVal || null,
        model: modelVal || null,
        year: Number(yearVal),
        price: priceNum,
        mileage: mileageNum,
        fuel: formData.fuel || null,
        condition: formData.condition || null,
        color: formData.color || null,
        ban: formData.ban || null,
        location: formData.location || null,
        engine: formData.engine || null,
        gearbox: formData.gearbox || null,
        description: formData.description || null,
        features: formData.features || [],
        name: formData.name || null,
        phone: formData.phone ? `${phoneCode}${formData.phone}` : null,
        email: formData.email || null,
        userId: formData.userId,
        status: "Standart"
      }

      const userCar = await apiClient.addcardata(payload)
      const userCarId = userCar?.newUserCar?.id ?? userCar?.id ?? null

      if (!userCarId) throw new Error("UserCar ID is missing from API response")

      if (images.length > 0) {
        const fd = new FormData()
        images.forEach((img) => fd.append("images", img.file))
        fd.append("userCarId", String(userCarId))
        await apiClient.addcarimagedata(fd)
      }

      toast.success(t("carAddedSuccess"), { position: "top-right", autoClose: 3000 })
      router.push("/profile/my-ads")
    } catch (err: any) {
      console.error(err)
      toast.error(err?.message || t("errorOccurred"), { position: "top-right", autoClose: 5000 })
    }
  }


  return (
    <div className="min-h-screen bg-gray-50">
      <style jsx global>{`
        input[type=number]::-webkit-outer-spin-button,
        input[type=number]::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type=number] {
          -moz-appearance: textfield;
        }
      `}</style>

      <Navbar currentLanguage={language} onLanguageChange={changeLanguage} />
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">{t("sellTitle")}</h1>
            <p className="text-gray-600">{t("sellSubtitle")}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="h-5 w-5" />
                  {t("carInfo")}
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div>
                    <label className="text-sm font-medium mb-2 block text-gray-700">{t("brand")}</label>
                    <BrandSelect
                      value={selectedBrand}
                      onChange={(v) => {
                        setSelectedBrand(v);
                        setSelectedModel("all");
                        setFormData((p) => ({ ...p, brand: v === "all" ? "" : v, model: "" }));
                        setPage(1);
                      }}
                      placeholder={t("all")}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block text-gray-700">{t("model")}</label>
                  <ModelSelect
                    value={selectedModel}
                    brand={selectedBrand}
                    onChange={(v) => {
                      setSelectedModel(v);
                      setFormData((p) => ({ ...p, model: v === "all" ? "" : v }));
                      setPage(1);
                    }}
                    placeholder={t("all")}
                  />
                </div>
                <div>
                  <Label htmlFor="year">{t("year")}</Label>
                  <Select value={formData.year} onValueChange={(v) => setFormData((p) => ({ ...p, year: v }))} required>
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
                  <Input id="price" type="number" required min={0} value={formData.price} onChange={(e) => setFormData((p) => ({ ...p, price: e.target.value }))} placeholder="50000" />
                </div>

                <div>
                  <Label htmlFor="mileage">{t("mileage") || "Mileage (km)"}</Label>
                  <Input id="mileage" required min={0} type="number" value={formData.mileage} onChange={(e) => setFormData((p) => ({ ...p, mileage: e.target.value }))} placeholder="50000" />
                </div>

                <div>
                  <Label htmlFor="fuel">{t("fuel")}</Label>
                  <Select value={formData.fuel} onValueChange={(v) => setFormData((p) => ({ ...p, fuel: v }))} required>
                    <SelectTrigger>
                      <SelectValue placeholder={t("selectFuel")} />
                    </SelectTrigger>
                    <SelectContent>
                      {fuels.map((f) => (
                        <SelectItem key={f} value={f}>{t(f) ?? f}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="condition">{t("condition")}</Label>
                  <Select value={formData.condition} onValueChange={(v) => setFormData((p) => ({ ...p, condition: v }))} required>
                    <SelectTrigger>
                      <SelectValue placeholder={t("selectCondition")} />
                    </SelectTrigger>
                    <SelectContent>
                      {conditions.map((c) => (
                        <SelectItem key={c} value={c}>{t(c) ?? c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="color">{t("color")}</Label>
                  <Select value={formData.color} onValueChange={(v) => setFormData((p) => ({ ...p, color: v }))} required>
                    <SelectTrigger>
                      <SelectValue placeholder={t("selectColor")} />
                    </SelectTrigger>
                    <SelectContent>
                      {colors.map((c) => (
                        <SelectItem key={c} value={c}>{t(c) ?? c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="ban">{t("ban")}</Label>
                  <Select value={formData.ban} onValueChange={(v) => setFormData((p) => ({ ...p, ban: v }))}>
                    <SelectTrigger>
                      <SelectValue placeholder={t("selectBan")} />
                    </SelectTrigger>
                    <SelectContent>
                      {bodyTypes.map((b) => (
                        <SelectItem key={b} value={b}>{b}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="engine">{t("engine")}</Label>
                  <Select value={formData.engine} onValueChange={(v) => setFormData((p) => ({ ...p, engine: v }))}>
                    <SelectTrigger>
                      <SelectValue placeholder={t("selectEngine")} />
                    </SelectTrigger>
                    <SelectContent>
                      {engineOptions.map((eng) => (
                        <SelectItem key={eng} value={eng}>{eng}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="gearbox">{t("gearbox")}</Label>
                  <Select value={formData.gearbox} onValueChange={(v) => setFormData((p) => ({ ...p, gearbox: v }))}>
                    <SelectTrigger>
                      <SelectValue placeholder={t("selectGearbox")} />
                    </SelectTrigger>
                    <SelectContent>
                      {gearboxOptions.map((g) => (
                        <SelectItem key={g} value={g}>{g}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="city">{t("city")}</Label>
                  <Select value={formData.location} onValueChange={(v) => setFormData((p) => ({ ...p, location: v }))} required>
                    <SelectTrigger>
                      <SelectValue placeholder={t("selectCity")} />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((c) => (
                        <SelectItem key={c} value={c}>{t(c) ?? c}</SelectItem>
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
                <VirtualScrollFeatures
                  features={features}
                  selectedFeatures={formData.features}
                  onFeatureChange={handleFeatureChange}
                  language={language}
                />
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
                    <input required={images.length === 0} type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" id="image-upload" disabled={images.length >= 10} />
                    <Button type="button" variant="outline" className="bg-transparent" onClick={() => document.getElementById("image-upload")?.click()} disabled={images.length >= 10}>
                      <Plus className="h-4 w-4 mr-2" />
                      {t("chooseImages")}
                    </Button>
                    {images.length >= 10 && (
                      <p className="text-sm text-orange-600 mt-2">{t("maxImages")}</p>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <ImageIcon className="h-5 w-5 text-gray-600" />
                      <h3 className="text-lg font-semibold text-gray-800">{t("uploadedImages")}</h3>
                      <Badge variant="outline" className="ml-auto">{images.length}/10</Badge>
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
                          <div key={image.id} className="relative group bg-white rounded-lg border shadow-sm overflow-hidden">
                            <div className="aspect-video relative">
                              <Image src={image.url || "/placeholder.svg"} alt={`Car image ${index + 1}`} width={300} height={200} className="w-full h-full object-cover" />
                              <Button type="button" size="icon" variant="destructive" className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => removeImage(image.id)}>
                                <X className="h-4 w-4" />
                              </Button>
                              {index === 0 && (
                                <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">{t("mainImage")}</div>
                              )}
                              <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">{index + 1}/10</div>
                            </div>
                            <div className="p-3">
                              <p className="text-sm font-medium text-gray-800 truncate">{image.name}</p>
                              <div className="flex items-center justify-between mt-2">
                                <p className="text-xs text-gray-500">{index === 0 ? t("mainImage") || (language === "az" ? "Əsas şəkil" : "Main image") : `${t("image") || (language === "az" ? "Şəkil" : "Image")} ${index + 1}`}</p>
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
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  {t("contactInfo")}
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">{t("fullName")}</Label>
                  <Input id="name" required value={formData.name} onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))} placeholder={t("namePlaceholder")} />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="phone">{t("phone")}</Label>
                  <div className="flex gap-2 items-center">
                    <div className="max-w-[150px]">
                      <CountryCodeSelect value={phoneCode} onChange={setPhoneCode} />
                    </div>
                    <div className="flex-1 relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder={t("phonePlaceholder")}
                        value={formData.phone}
                        onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                        required
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="email">{t("email")}</Label>
                  <Input id="email" type="email" required value={formData.email} onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))} placeholder="example@email.com" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("description")}</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea className="resize-none h-[200px]" value={formData.description} onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))} placeholder={t("descriptionPlaceholder")} rows={4} />
              </CardContent>
            </Card>

            <div className="text-center">
              <Button type="submit" size="lg" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-8">{t("postAds")}</Button>
            </div>

          </form>
        </div>
      </div>
    </div>
  )
}
