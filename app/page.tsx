"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Filter,
  Heart,
  Eye,
  MapPin,
  Car,
  Fuel,
  Camera,
  ChevronLeft,
  ChevronRight,
  Cog,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { useLanguage } from "@/hooks/use-language";
import { getTranslation } from "@/lib/i18n";
import { apiClient } from "@/lib/api-client";
import { useAuth } from "@/lib/auth-context";
import { cities, colors, conditions, fuels, gearboxOptions, years } from "@/lib/car-data";
import BrandSelect from "@/components/BrandSelect";
import ModelSelect from "@/components/ModelSelect";

type CarImage = { id: number; url: string };
type UserCar = {
  id: number;
  createdAt?: string;
  updatedAt?: string;
  brand: string;
  model: string;
  year?: number;
  price?: number;
  mileage?: number;
  fuel?: string;
  transmission?: string;
  condition?: string;
  gearbox?: string;
  color?: string;
  location?: string;
  city?: string;
  description?: string;
  features?: string[];
  name?: string;
  phone?: string;
  email?: string;
  status?: string;
  views?: number;
  images: CarImage[];
};

function buildImageUrl(raw: string) {
  if (!raw) return "/placeholder.svg";
  if (/^https?:\/\//i.test(raw)) return raw;
  const base = (process.env.NEXT_PUBLIC_API_URL_FOR_IMAGE ?? "").replace(/\/+$/, "");
  let path = raw.replace(/^\/+/, "");
  path = path.replace(/^(uploads\/)+/i, "");
  if (!base) return `/${path}`;
  return `${base}/${path}`;
}

function CarCard({ car, t, index }: { car: UserCar; t: (k: string) => string; index: number }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), index * 80);
    return () => clearTimeout(timer);
  }, [index]);

  const images = car.images && car.images.length > 0 ? car.images.map((i) => i.url || "/placeholder.svg") : ["/placeholder.svg"];
  const currentRaw = images[currentImageIndex] ?? "/placeholder.svg";
  const imageUrl = buildImageUrl(currentRaw);

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((p) => (p + 1) % images.length);
  };
  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((p) => (p - 1 + images.length) % images.length);
  };
  return (
    <Card className={`overflow-hidden card-hover border-0 bg-white/90 backdrop-blur-sm transition-all duration-500 ${isLoaded ? "animate-fadeInUp opacity-100" : "opacity-0"}`} style={{ animationDelay: `${index * 0.05}s` }}>
      <div className="relative group">
        <div className="overflow-hidden">
          <Image src={imageUrl} alt={`${car.brand} ${car.model}`} width={300} height={200} className="w-full h-48 object-contain transition-transform duration-700 group-hover:scale-110" />
        </div>

        {images.length > 1 && (
          <>
            <Button size="icon" variant="ghost" className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 h-8 w-8 hover:scale-110" onClick={prevImage}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 h-8 w-8 hover:scale-110" onClick={nextImage}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}

        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1">
          {images.map((_, idx) => (
            <button key={idx} className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === currentImageIndex ? "bg-white scale-125" : "bg-white/50 hover:bg-white/75"}`} onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCurrentImageIndex(idx); }} />
          ))}
        </div>

        <div className="absolute bottom-3 left-3 bg-black/70 text-white px-2 py-1 rounded-md text-xs flex items-center gap-1 backdrop-blur-sm">
          <Camera className="h-3 w-3" />
          {currentImageIndex + 1}/{images.length}
        </div>

        <Button size="icon" variant="ghost" className="absolute top-3 right-3 bg-white/90 hover:bg-white backdrop-blur-sm z-10 transition-all duration-300 hover:scale-110 hover:text-red-500" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
          <Heart className="h-4 w-4" />
        </Button>
      </div>

      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold h-16 text-lg text-gray-800 break-word group-hover:text-blue-600 transition-colors duration-300">
              {car.brand} {car.model.length > 32 ? car.model.slice(0, 40) + "..." : car.model}
            </h3>
            <p className="text-sm text-gray-600">{car.year} • {t(car.condition ?? "") || car.condition}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 pb-24">
        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-1 transition-colors duration-300 hover:text-blue-600"><Car className="h-4 w-4 text-blue-500" />{(car.mileage ?? 0).toLocaleString()} {t("km") || "km"}</div>
          <div className="flex items-center gap-1 transition-colors duration-300 hover:text-blue-600"><Fuel className="h-4 w-4 text-blue-500" />{t(car.fuel ?? "") || car.fuel}</div>
          <div className="flex items-center gap-1 transition-colors duration-300 hover:text-blue-600"><Cog className="h-4 w-4 text-blue-500" />{t(car.gearbox ?? "") || car.gearbox}</div>
          <div className="flex items-center gap-1 transition-colors duration-300 hover:text-blue-600"><MapPin className="h-4 w-4 text-blue-500" />{t(car.location ?? "") || car.location}</div>
        </div>
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="mb-2 border-blue-200 text-blue-600 hover:bg-blue-50 transition-colors duration-300">{t(car.color ?? "") || car.color}</Badge>
          <div className="text-right">
            <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">{(car.price ?? 0).toLocaleString()} ₼</p>
          </div>
        </div>
      </CardContent>


      <CardFooter className="absolute bottom-3 left-0 w-full gap-2 px-4">
        <Button asChild className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 btn-animate transition-all duration-300 hover:scale-105">
          <Link href={`/cars/${car.id}`}><Eye className="h-4 w-4 mr-2" />{t("details")}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function HomePage() {
  const { logout } = useAuth();

  const [cars, setCars] = useState<UserCar[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState<string>("all");
  const [selectedModel, setSelectedModel] = useState<string>("all");
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [selectedFuel, setSelectedFuel] = useState<string>("all");
  const [selectedTransmission, setSelectedTransmission] = useState<string>("all");
  const [selectedCondition, setSelectedCondition] = useState<string>("all");
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [selectedColor, setSelectedColor] = useState<string>("all");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const { language, changeLanguage } = useLanguage()
  const t = (key: string): string => {
    const val = getTranslation(language, key)
    return typeof val === "string" ? val : key
  }
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(30);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [sortBy, setSortBy] = useState<string>("createdAt_desc");

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<any | null>(null);

  const fetchCarsFromApi = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params: any = {
        page,
        limit,
        search: searchTerm || undefined,
        brand: selectedBrand !== "all" ? selectedBrand : undefined,
        model: selectedModel !== "all" ? selectedModel : undefined,
        year: selectedYear !== "all" ? Number(selectedYear) : undefined,
        fuel: selectedFuel !== "all" ? selectedFuel : undefined,
        transmission: selectedTransmission !== "all" ? selectedTransmission : undefined,
        condition: selectedCondition !== "all" ? selectedCondition : undefined,
        color: selectedColor !== "all" ? selectedColor : undefined,
        city: selectedCity !== "all" ? selectedCity : undefined,
        minPrice: priceRange.min ? Number(priceRange.min) : undefined,
        maxPrice: priceRange.max ? Number(priceRange.max) : undefined,
        sortBy: sortBy === "createdAt_desc" ? undefined : sortBy,
      };

      const res = await apiClient.getPremiumCars(params);
      let carsArray: any[] = [];
      if (Array.isArray(res)) {
        carsArray = res;
        setTotalPages(1);
      } else if (res && Array.isArray(res.cars)) {
        carsArray = res.cars;
        setTotalPages(res.totalPages ?? Math.ceil((res.totalCount ?? carsArray.length) / limit));
      } else {
        carsArray = res?.data ?? [];
        setTotalPages(res?.totalPages ?? 1);
      }

      const normalized = carsArray.map((car: any) => ({
        id: car.id,
        brand: car.brand ?? "",
        model: car.model ?? "",
        year: car.year ?? 0,
        price: car.price ?? 0,
        mileage: car.mileage ?? 0,
        fuel: car.fuel ?? "",
        transmission: car.transmission ?? "",
        condition: car.condition ?? "",
        color: car.color ?? "",
        location: car.location ?? "",
        gearbox: car.gearbox ?? "",
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
      })) as UserCar[];

      setCars(normalized);
    } catch (err: any) {
      console.error("Failed to fetch premium cars", err);
      setError(err?.message ?? t("errorOccurred"));
      setCars([]);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return;
      const user = await apiClient.getCurrentUser();
      setProfileData(user);
    } catch (err) {
      logout();
    }
  };

  useEffect(() => {
    fetchCarsFromApi();
  }, [page, selectedBrand, selectedModel, selectedYear, selectedFuel, selectedTransmission, selectedCondition, selectedCity, selectedColor, priceRange.min, priceRange.max, searchTerm, sortBy]);

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    setSelectedModel("all");
    setPage(1);
  }, [selectedBrand]);
  const fuelsList = fuels.slice().sort((a, b) => a.localeCompare(b));
  const transmissionsList = gearboxOptions.slice().sort((a, b) => a.localeCompare(b));
  const conditionsList = conditions.slice().sort((a, b) => a.localeCompare(b));
  const colorsList = colors.slice().sort((a, b) => a.localeCompare(b));
  const citiesList = cities.slice().sort((a, b) => a.localeCompare(b));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="navbar-slide">
        <Navbar currentLanguage={language} onLanguageChange={changeLanguage} />
      </div>
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-12 md:py-20 relative overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="hero-title text-3xl md:text-5xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">{t("heroTitle")}</h1>
          <p className="hero-subtitle text-lg md:text-xl mb-6 md:mb-8 text-blue-100">{t("heroSubtitle")}</p>
          <div className="hero-search max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-2.5 top-5 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
              <Input placeholder={t("searchPlaceholder")} value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }} className="pl-12 pr-4 py-4 text-base md:text-lg bg-white/95 backdrop-blur-sm border-0 shadow-lg search-input rounded-xl" />
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col xl:flex-row gap-6 md:gap-8">
          <div className="xl:w-1/4 filter-slide">
            <Card className="xl:sticky xl:top-4 shadow-sm border-0 bg-white/80 backdrop-blur-sm hover-lift">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-lg">
                <div className="flex items-center gap-2"><Filter className="h-5 w-5 text-blue-600" /><h3 className="text-lg font-semibold text-blue-800">{t("filters")}</h3></div>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
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
                  <label className="text-sm font-medium mb-2 block text-gray-700">{t("year")}</label>
                  <Select value={selectedYear} onValueChange={(v) => { setSelectedYear(v); setPage(1); }}>
                    <SelectTrigger className="border-gray-200 focus:border-blue-400 transition-colors duration-300"><SelectValue placeholder={t("selectYear")} /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t("all")}</SelectItem>
                      {years.map((y) => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block text-gray-700">{t("fuel")}</label>
                  <Select value={selectedFuel} onValueChange={(v) => { setSelectedFuel(v); setPage(1); }}>
                    <SelectTrigger className="border-gray-200 focus:border-blue-400 transition-colors duration-300"><SelectValue placeholder={t("selectFuel")} /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t("all")}</SelectItem>
                      {fuelsList.map((f) => <SelectItem key={f} value={f}>{t(f) ?? f}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block text-gray-700">{t("transmission")}</label>
                  <Select value={selectedTransmission} onValueChange={(v) => { setSelectedTransmission(v); setPage(1); }}>
                    <SelectTrigger className="border-gray-200 focus:border-blue-400 transition-colors duration-300"><SelectValue placeholder={t("selectTransmission")} /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t("all")}</SelectItem>
                      {transmissionsList.map((tr) => <SelectItem key={tr} value={tr}>{t(tr) ?? tr}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block text-gray-700">{t("condition")}</label>
                  <Select value={selectedCondition} onValueChange={(v) => { setSelectedCondition(v); setPage(1); }}>
                    <SelectTrigger className="border-gray-200 focus:border-blue-400 transition-colors duration-300"><SelectValue placeholder={t("selectCondition")} /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t("all")}</SelectItem>
                      {conditionsList.map((c) => <SelectItem key={c} value={c}>{t(c) ?? c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block text-gray-700">{t("city")}</label>
                  <Select value={selectedCity} onValueChange={(v) => { setSelectedCity(v); setPage(1); }}>
                    <SelectTrigger className="border-gray-200 focus:border-blue-400 transition-colors duration-300"><SelectValue placeholder={t("selectCity")} /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t("all")}</SelectItem>
                      {citiesList.map((c) => <SelectItem key={c} value={c}>{t(c) ?? c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block text-gray-700">{t("color")}</label>
                  <Select value={selectedColor} onValueChange={(v) => { setSelectedColor(v); setPage(1); }}>
                    <SelectTrigger className="border-gray-200 focus:border-blue-400 transition-colors duration-300"><SelectValue placeholder={t("selectColor")} /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t("all")}</SelectItem>
                      {colorsList.map((c) => <SelectItem key={c} value={c}>{t(c) ?? c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block text-gray-700">{t("priceRange")}</label>
                  <div className="flex gap-2">
                    <Input placeholder={t("min")} value={priceRange.min} onChange={(e) => { setPriceRange(prev => ({ ...prev, min: e.target.value })); setPage(1); }} className="border-gray-200 focus:border-blue-400 transition-colors duration-300" />
                    <Input placeholder={t("max")} value={priceRange.max} onChange={(e) => { setPriceRange(prev => ({ ...prev, max: e.target.value })); setPage(1); }} className="border-gray-200 focus:border-blue-400 transition-colors duration-300" />
                  </div>
                </div>

                <Button variant="outline" className="w-full bg-transparent border-blue-200 text-blue-600 hover:bg-blue-50 btn-animate transition-all duration-300 hover:scale-105" onClick={() => {
                  setSelectedBrand("all"); setSelectedModel("all"); setSelectedYear("all"); setSelectedFuel("all");
                  setSelectedTransmission("all"); setSelectedCondition("all"); setSelectedCity("all"); setSelectedColor("all");
                  setPriceRange({ min: "", max: "" }); setSearchTerm(""); setSortBy("createdAt_desc"); setPage(1);
                }}>{t("clearFilters")}</Button>
              </CardContent>
            </Card>
          </div>

          <div className="lg:w-3/4">
            <div className="flex justify-between items-center mb-6 animate-fadeInUp">
              <h2 className="text-2xl font-bold text-gray-800"></h2>
              <div className="flex items-center gap-3">
                <Select value={sortBy} onValueChange={(v) => { setSortBy(v); setPage(1); }}>
                  <SelectTrigger className="w-48 border-gray-200 transition-colors duration-300 hover:border-blue-400"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="createdAt_desc">{t("newest")}</SelectItem>
                    <SelectItem value="price-low">{t("priceLow")}</SelectItem>
                    <SelectItem value="price-high">{t("priceHigh")}</SelectItem>
                    <SelectItem value="year-new">{t("yearNew")}</SelectItem>
                    <SelectItem value="year-old">{t("yearOld")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600 animate-pulse">{t("loading")}</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-4 md:gap-6">
                  {cars.map((car, idx) => <CarCard key={car.id} car={car} t={t} index={idx} />)}
                </div>

                {cars.length === 0 && (
                  <div className="text-center py-12 animate-fadeInUp">
                    <Car className="h-16 w-16 mx-auto text-gray-400 mb-4 animate-bounce-slow" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">{t("noResults")}</h3>
                    <p className="text-gray-500">{t("noResultsDesc")}</p>
                  </div>
                )}

                <div className="mt-8 flex items-center justify-center gap-3">
                  <Button size="sm" variant="outline" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}>{t("prev")}</Button>
                  <div className="px-3 py-1 bg-white rounded shadow-sm">{page} / {totalPages}</div>
                  <Button size="sm" variant="outline" onClick={() => setPage(p => (totalPages ? Math.min(totalPages, p + 1) : p + 1))} disabled={!!totalPages && page >= totalPages}>{t("next")}</Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
