"use client"

import { useState } from "react"
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
  Users,
  Gauge,
  Palette,
  Shield,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import Image from "next/image"
import { Navbar } from "@/components/navbar"
import { useLanguage } from "@/hooks/use-language"
import { getTranslation } from "@/lib/i18n"

const car = {
  id: 1,
  brand: "BMW",
  model: "X5",
  year: 2022,
  price: 85000,
  mileage: 15000,
  fuel: "gasoline",
  transmission: "automatic",
  color: "black",
  location: "baku",
  condition: "new",
  engine: "3.0L",
  power: "340 hp",
  drivetrain: "AWD",
  images: [
    "/placeholder.svg?height=400&width=600&text=BMW+X5+Front",
    "/placeholder.svg?height=400&width=600&text=BMW+X5+Side",
    "/placeholder.svg?height=400&width=600&text=BMW+X5+Interior",
    "/placeholder.svg?height=400&width=600&text=BMW+X5+Back",
    "/placeholder.svg?height=400&width=600&text=BMW+X5+Engine",
  ],
  description:
    "Bu BMW X5 mükəmməl vəziyyətdədir. Bütün servis işləri vaxtında aparılmışdır. Avtomobil heç bir qəzaya düşməmişdir və texniki vəziyyəti əladır.",
  features: [
    "Dəri oturacaqlar",
    "Panorama dam",
    "Navigasiya sistemi",
    "Bluetooth",
    "Kamera",
    "Park sensoru",
    "Kondisioner",
    "ABS",
    "ESP",
    "Airbag",
  ],
  seller: {
    name: "Əli Məmmədov",
    phone: "+994 50 123 45 67",
    email: "ali@example.com",
    location: "Bakı",
  },
}

export default function CarDetailPage() {
  const { language } = useLanguage()
  const t = (key: string) => getTranslation(language, key)

  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % car.images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + car.images.length) % car.images.length)
  }

  const content = {
    az: {
      description: "Təsvir",
      features: "Xüsusiyyətlər",
      contactSeller: "Satıcı ilə əlaqə",
      quickInfo: "Qısa məlumat",
      brand: "Marka",
      model: "Model",
      year: "İl",
      condition: "Vəziyyət",
      location: "Yer",
      mileage: "Yürüş",
      fuel: "Yanacaq",
      transmission: "Transmissiya",
      color: "Rəng",
      engine: "Mühərrik",
      power: "Güc",
      drivetrain: "Ötürücü",
      sendEmail: "E-mail göndər",
      safetyTip: "Təhlükəsizlik məsləhəti",
      safetyText: "Avtomobili almadan əvvəl mütləq şəkildə yoxlayın və sənədləri diqqətlə nəzərdən keçirin.",
    },
    en: {
      description: "Description",
      features: "Features",
      contactSeller: "Contact Seller",
      quickInfo: "Quick Info",
      brand: "Brand",
      model: "Model",
      year: "Year",
      condition: "Condition",
      location: "Location",
      mileage: "Mileage",
      fuel: "Fuel",
      transmission: "Transmission",
      color: "Color",
      engine: "Engine",
      power: "Power",
      drivetrain: "Drivetrain",
      sendEmail: "Send Email",
      safetyTip: "Safety Tip",
      safetyText: "Be sure to inspect the car and carefully review the documents before purchasing.",
    },
    ru: {
      description: "Описание",
      features: "Особенности",
      contactSeller: "Связаться с продавцом",
      quickInfo: "Краткая информация",
      brand: "Марка",
      model: "Модель",
      year: "Год",
      condition: "Состояние",
      location: "Местоположение",
      mileage: "Пробег",
      fuel: "Топливо",
      transmission: "Коробка передач",
      color: "Цвет",
      engine: "Двигатель",
      power: "Мощность",
      drivetrain: "Привод",
      sendEmail: "Отправить Email",
      safetyTip: "Совет по безопасности",
      safetyText: "Обязательно осмотрите автомобиль и внимательно изучите документы перед покупкой.",
    },
  }

  const pageContent = content[language]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8">
          <div className="xl:col-span-2 space-y-4 md:space-y-6">
            <Card>
              <CardContent className="p-0">
                <div className="relative">
                  <Image
                    src={car.images[currentImageIndex] || "/placeholder.svg"}
                    alt={`${car.brand} ${car.model} - Image ${currentImageIndex + 1}`}
                    width={600}
                    height={400}
                    className="w-full h-64 md:h-96 object-cover rounded-t-lg"
                  />
                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white"
                    onClick={prevImage}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white"
                    onClick={nextImage}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>

                  <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded-md text-sm">
                    {currentImageIndex + 1} / {car.images.length}
                  </div>

                  <div className="absolute top-4 right-4 flex gap-2">
                    <Button size="icon" variant="secondary">
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="secondary">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-5 gap-2 p-4">
                  {car.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`relative overflow-hidden rounded-md ${
                        currentImageIndex === index ? "ring-2 ring-blue-500" : ""
                      }`}
                    >
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`${car.brand} ${car.model} thumbnail ${index + 1}`}
                        width={120}
                        height={80}
                        className="w-full h-16 object-cover hover:opacity-80 transition-opacity"
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
                      {car.year} • {t(car.condition)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-blue-600">{car.price.toLocaleString()} ₼</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
                  <div className="flex items-center gap-2">
                    <Gauge className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">{pageContent.mileage}</p>
                      <p className="font-semibold">{car.mileage.toLocaleString()} km</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Fuel className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">{pageContent.fuel}</p>
                      <p className="font-semibold">{t(car.fuel)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">{pageContent.transmission}</p>
                      <p className="font-semibold">{t(car.transmission)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Palette className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">{pageContent.color}</p>
                      <p className="font-semibold">{t(car.color)}</p>
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-500">{pageContent.engine}</p>
                    <p className="font-semibold">{car.engine}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{pageContent.power}</p>
                    <p className="font-semibold">{car.power}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{pageContent.drivetrain}</p>
                    <p className="font-semibold">{car.drivetrain}</p>
                  </div>
                </div>

                <Separator className="my-6" />

                <div>
                  <h3 className="text-lg font-semibold mb-3">{pageContent.description}</h3>
                  <p className="text-gray-700 leading-relaxed">{car.description}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{pageContent.features}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3">
                  {car.features.map((feature, index) => (
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
                <CardTitle>{pageContent.contactSeller}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-semibold">{car.seller.name}</p>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    {car.seller.location}
                  </div>
                </div>

                <div className="space-y-2">
                  <Button className="w-full" size="lg">
                    <Phone className="h-4 w-4 mr-2" />
                    {car.seller.phone}
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent">
                    <Mail className="h-4 w-4 mr-2" />
                    {pageContent.sendEmail}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{pageContent.quickInfo}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">{pageContent.brand}:</span>
                  <span className="font-semibold">{car.brand}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{pageContent.model}:</span>
                  <span className="font-semibold">{car.model}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{pageContent.year}:</span>
                  <span className="font-semibold">{car.year}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{pageContent.condition}:</span>
                  <Badge variant="outline">{t(car.condition)}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{pageContent.location}:</span>
                  <span className="font-semibold">{t(car.location)}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-yellow-200 bg-yellow-50">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-yellow-800 mb-1">{pageContent.safetyTip}</h4>
                    <p className="text-sm text-yellow-700">{pageContent.safetyText}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
