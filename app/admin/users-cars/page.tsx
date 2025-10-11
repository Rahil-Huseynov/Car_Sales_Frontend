"use client"

import React, { useCallback, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Search,
  Eye,
  ChevronLeft,
  ChevronRight,
  Save,
  ExternalLink,
  Camera,
  X,
} from "lucide-react"
import BrandSelect from "@/components/BrandSelect"
import ModelSelect from "@/components/ModelSelect"
import { apiClient } from "@/lib/api-client"
import { useDefaultLanguage } from "@/components/useLanguage"
import { translateString } from "@/lib/i18n"
import { getAuthHeaders } from "@/app/profile/my-ads/page"
import { bodyTypes, cities, colors, conditions, engineOptions, features, fuels, gearboxOptions, years } from "@/lib/car-data"
import { VirtualScrollFeatures } from "@/app/sell/page"

const API = process.env.NEXT_PUBLIC_API_URL || ""

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
  condition?: string
  viewcount?: number
  color?: string
  ban?: string
  location?: string
  engine?: string
  gearbox?: string
  description?: string
  features?: string[]
  status?: string
  userId?: number
  allCarsListId?: number
  images?: Array<string> | Array<{ id?: number; url?: string }>
}

export default function UserCarsPage() {
  const [cars, setCars] = useState<UserCar[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [selectedCar, setSelectedCar] = useState<UserCar | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalImageIndex, setModalImageIndex] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const pageSize = 12
  const { lang } = useDefaultLanguage()
  const t = (key: string) => translateString(lang, key)

  useEffect(() => {
    loadCars(currentPage, searchTerm, statusFilter)
  }, [currentPage, statusFilter])

  async function fetchCarsFromApi(page = 1, pageSize = 12, search?: string, status?: string | null) {
    try {
      if ((apiClient as any)?.AllUserCars) {
        const res = await (apiClient as any).AllUserCars()
        return { data: res || [], totalPages: 1 }
      }
    } catch (e) {
      console.warn("apiClient.AllUserCars failed, falling back to fetch", e)
    }

    const params = new URLSearchParams()
    params.set("page", String(page))
    params.set("limit", String(pageSize))
    if (search) params.set("search", search)
    if (status) params.set("status", status)

    const headers = getAuthHeaders ? getAuthHeaders() : {}
    const res = await fetch(`${API.replace(/\/+$/, "")}/user-cars?${params.toString()}`, { headers, credentials: "include" })
    if (!res.ok) throw new Error("Failed to fetch user cars")
    const json = await res.json()
    return { data: json.items || json || [], totalPages: json.totalPages || 1 }
  }

  const loadCars = async (page = 1, search?: string, status?: string | null) => {
    try {
      setIsLoading(true)
      const result = await fetchCarsFromApi(page, pageSize, search, status)
      setCars(result.data || [])
      setTotalPages(result.totalPages || 1)
    } catch (error) {
      console.error("Failed to load cars:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const normalizeImages = (raw: any[] | undefined): string[] => {
    if (!raw) return []
    return raw.map((it) => (typeof it === "string" ? it : it?.url ?? "")).filter(Boolean)
  }

  const openCarModal = async (car: UserCar) => {
    try {
      setIsLoading(true)
      const headers = getAuthHeaders ? getAuthHeaders() : {}
      const res = await fetch(`${API.replace(/\/+$/, "")}/user-cars/${car.id}`, { headers, credentials: "include" })
      if (!res.ok) throw new Error("Failed to fetch car")
      const json = await res.json()
      const imgs = normalizeImages(json.images ?? json.imagesUrls ?? [])
      setSelectedCar({ ...json, images: imgs })
      setModalImageIndex(0)
      setIsModalOpen(true)
    } catch (error) {
      console.error("openCarModal error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedCar(null)
    setModalImageIndex(0)
  }

  const handleSave = async () => {
    if (!selectedCar) return
    try {
      setIsLoading(true)
      const headers = { ...getAuthHeaders?.(), "Content-Type": "application/json" }
      const body = { ...selectedCar, features: selectedCar.features || [] }
      const res = await fetch(`${API.replace(/\/+$/, "")}/user-cars/${selectedCar.id}`, {
        method: "PUT",
        headers,
        credentials: "include",
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error("Failed to update car")
      setCars((prev) => prev.map((c) => (c.id === selectedCar.id ? selectedCar : c)))
      setIsModalOpen(false)
    } catch (error) {
      console.error("Save error:", error)
      alert(t("SaveFailed") || "Save failed")
    } finally {
      setIsLoading(false)
    }
  }

  const handleFieldChange = (field: keyof UserCar, value: any) => {
    setSelectedCar((prev) => (prev ? { ...prev, [field]: value } : prev))
  }

  const openPublicCar = (allCarsListId?: number) => {
    if (!allCarsListId) return
    const url = `/cars/${allCarsListId}`
    window.open(url, "_blank")
  }

  const prevImage = () => {
    if (!selectedCar?.images || selectedCar.images.length === 0) return
    setModalImageIndex((i) => (i - 1 + (selectedCar.images as string[]).length) % (selectedCar.images as string[]).length)
  }
  const nextImage = () => {
    if (!selectedCar?.images || selectedCar.images.length === 0) return
    setModalImageIndex((i) => (i + 1) % (selectedCar.images as string[]).length)
  }
  const handleFeatureChange = useCallback((featureKey: string, checked: boolean) => {
    setSelectedCar((prev: any) => {
      const s = new Set(prev.features)
      if (checked) s.add(featureKey)
      else s.delete(featureKey)
      return { ...prev, features: Array.from(s) }
    })
  }, [])
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{t("UserCars")}</span>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  className="pl-8"
                  placeholder={t("SearchPlaceholder") || "Search by brand, model, year..."}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={async (e) => {
                    if (e.key === "Enter") {
                      setCurrentPage(1)
                      await loadCars(1, searchTerm, statusFilter)
                    }
                  }}
                />
              </div>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />
              ))}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-left">{t("ID") || "ID"}</TableHead>
                      <TableHead className="text-left">{t("BrandModel") || "Brand / Model"}</TableHead>
                      <TableHead className="text-left">{t("Year") || "Year"}</TableHead>
                      <TableHead className="text-left">{t("Price") || "Price"}</TableHead>
                      <TableHead className="text-left">{t("Mileage") || "Mileage"}</TableHead>
                      <TableHead className="text-left">{t("Status") || "Status"}</TableHead>
                      <TableHead className="text-left">{t("Views") || "Views"}</TableHead>
                      <TableHead className="text-right">{t("Actions") || "Actions"}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cars.map((car) => (
                      <TableRow key={car.id} className="hover:bg-muted">
                        <TableCell className="w-16">{car.allCarsListId}</TableCell>
                        <TableCell>{car.brand} <span className="text-sm text-muted-foreground">{car.model}</span></TableCell>
                        <TableCell>{car.year}</TableCell>
                        <TableCell>{car.price}</TableCell>
                        <TableCell>{car.mileage}</TableCell>
                        <TableCell className="capitalize">
                          <Badge className="capitalize" variant={car.status === "active" ? "default" : car.status === "pending" ? "outline" : "destructive"}>
                            {car.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{car.viewcount}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button size="sm" variant="ghost" onClick={() => openCarModal(car)}>
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => openPublicCar(car.allCarsListId)}>
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center space-x-2">
                  <Button variant="outline" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>
                    <ChevronLeft className="w-4 h-4 mr-1" /> {t("Previous")}
                  </Button>
                  <div className="text-sm text-muted-foreground">{t("Page")} {currentPage} / {totalPages}</div>
                  <Button variant="outline" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
                    {t("Next")} <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>

                <div className="text-sm text-muted-foreground">{cars.length} {t("Results") || "results"}</div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-6xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between pr-4">
              <div className="flex items-center gap-3">
                <Camera className="h-5 w-5" />
                <span>{selectedCar ? `${selectedCar.brand ?? ""} ${selectedCar.model ?? ""}` : t("loading")}</span>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={() => openPublicCar(selectedCar?.allCarsListId)}>
                  {t("OpenPublic") || "Open public"}
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
                <Button size="sm" onClick={handleSave}>
                  <Save className="w-4 h-4 mr-2" /> {t("Save") || "Save"}
                </Button>
              </div>
            </DialogTitle>
          </DialogHeader>

          <CardContent>
            <ScrollArea className="max-h-[70vh] pr-4 overflow-auto">
              {selectedCar ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Camera className="h-5 w-5" />
                          {t("carInfo") || "Car info"}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block text-gray-700">{t("brand")}</label>
                          <BrandSelect value={selectedCar.brand ?? ""} onChange={(v: any) => handleFieldChange("brand", v)} placeholder={t("all")} />
                        </div>

                        <div>
                          <label className="text-sm font-medium mb-2 block text-gray-700">{t("model")}</label>
                          <ModelSelect value={selectedCar.model ?? ""} brand={selectedCar.brand ?? ""} onChange={(v: any) => handleFieldChange("model", v)} placeholder={t("all")} />
                        </div>

                        <div>
                          <Label htmlFor="year">{t("year")}</Label>
                          <Select value={selectedCar.year ? String(selectedCar.year) : ""} onValueChange={(v) => handleFieldChange("year", Number(v))}>
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
                          <Input id="price" type="number" min={0} value={selectedCar.price ?? ""} onChange={(e) => handleFieldChange("price", Number(e.target.value))} />
                        </div>

                        <div>
                          <Label htmlFor="mileage">{t("mileage") || "Mileage (km)"}</Label>
                          <Input id="mileage" type="number" min={0} value={selectedCar.mileage ?? ""} onChange={(e) => handleFieldChange("mileage", Number(e.target.value))} />
                        </div>

                        <div>
                          <Label htmlFor="fuel">{t("fuel")}</Label>
                          <Select value={selectedCar.fuel ?? ""} onValueChange={(v) => handleFieldChange("fuel", v)}>
                            <SelectTrigger>
                              <SelectValue placeholder={t("selectFuel")} />
                            </SelectTrigger>
                            <SelectContent>
                              {fuels.map((f) => (
                                <SelectItem key={f.key} value={f.key}>{f.translations[lang] ?? f.translations.en}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="condition">{t("condition")}</Label>
                          <Select value={selectedCar.condition ?? ""} onValueChange={(v) => handleFieldChange("condition", v)}>
                            <SelectTrigger>
                              <SelectValue placeholder={t("selectCondition")} />
                            </SelectTrigger>
                            <SelectContent>
                              {conditions.map((c) => (
                                <SelectItem key={c.key} value={c.key}>{c.translations[lang] ?? c.translations.en}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="color">{t("color")}</Label>
                          <Select value={selectedCar.color ?? ""} onValueChange={(v) => handleFieldChange("color", v)}>
                            <SelectTrigger>
                              <SelectValue placeholder={t("selectColor")} />
                            </SelectTrigger>
                            <SelectContent>
                              {colors.map((c) => (
                                <SelectItem key={c.key} value={c.key}>{c.translations[lang] ?? c.translations.en}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="ban">{t("ban")}</Label>
                          <Select value={selectedCar.ban ?? ""} onValueChange={(v) => handleFieldChange("ban", v)}>
                            <SelectTrigger>
                              <SelectValue placeholder={t("selectBan")} />
                            </SelectTrigger>
                            <SelectContent>
                              {bodyTypes.map((b) => (
                                <SelectItem key={b.key} value={b.key}>{b.translations[lang] ?? b.translations.en}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="engine">{t("engine")}</Label>
                          <Select value={selectedCar.engine ?? ""} onValueChange={(v) => handleFieldChange("engine", v)}>
                            <SelectTrigger>
                              <SelectValue placeholder={t("selectEngine")} />
                            </SelectTrigger>
                            <SelectContent>
                              {engineOptions.map((en) => (
                                <SelectItem key={en.key} value={en.key}>{en.translations[lang] ?? en.translations.en}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="gearbox">{t("gearbox")}</Label>
                          <Select value={selectedCar.gearbox ?? ""} onValueChange={(v) => handleFieldChange("gearbox", v)}>
                            <SelectTrigger>
                              <SelectValue placeholder={t("selectGearbox")} />
                            </SelectTrigger>
                            <SelectContent>
                              {gearboxOptions.map((g) => (
                                <SelectItem key={g.key} value={g.key}>{g.translations[lang] ?? g.translations.en}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="city">{t("city")}</Label>
                          <Select value={selectedCar.location ?? ""} onValueChange={(v) => handleFieldChange("location", v)}>
                            <SelectTrigger>
                              <SelectValue placeholder={t("selectCity")} />
                            </SelectTrigger>
                            <SelectContent>
                              {cities.map((c) => (
                                <SelectItem key={c.key} value={c.key}>{c.translations[lang] ?? c.translations.en}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="status">{t("Status") || "Status"}</Label>
                          <Select value={selectedCar.status ?? ""} onValueChange={(v) => handleFieldChange("status", v)}>
                            <SelectTrigger>
                              <SelectValue className="capitalize" placeholder={t("selectStatus") || "Select status"} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="premium" className="capitalize">{t("premium")}</SelectItem>
                              <SelectItem value="standart" className="capitalize">{t("standart")}</SelectItem>
                              <SelectItem value="sold" className="capitalize">{t("sold")}</SelectItem>
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
                          selectedFeatures={selectedCar.features ?? []}
                          onFeatureChange={handleFeatureChange}
                          language={lang}
                        />
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Camera className="h-5 w-5" />
                          {t("images") || "Images"}
                        </CardTitle>
                        <p className="text-sm text-gray-600">{t("imagesDesc")}</p>
                      </CardHeader>
                      <CardContent>
                        {Array.isArray(selectedCar.images) && selectedCar.images.length > 0 ? (
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {(selectedCar.images as string[]).map((img, idx) => (
                              <div key={idx} className="h-36 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                                <img src={`${img}`} alt={`img-${idx}`} className="object-contain w-full h-full" />
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                            <Camera className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                            <p className="text-gray-500 mb-2">{t("noImages") || "No images"}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>{t("description")}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Textarea
                          className="resize-none h-[160px]"
                          value={selectedCar.description || ""}
                          onChange={(e) => handleFieldChange("description", e.target.value)}
                        />
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center">{t("loading")}</div>
              )}
            </ScrollArea>
          </CardContent>
        </DialogContent>
      </Dialog>
    </div>
  )
}
