"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Home, Search, ArrowLeft, Car, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { useLanguage } from "@/hooks/use-language"
import { getTranslation, translateString } from "@/lib/i18n"
import { useDefaultLanguage } from "@/components/useLanguage"

export default function NotFound() {
  const { lang, setLang } = useDefaultLanguage();
  const t = (key: string) => translateString(lang, key);

  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="navbar-slide">
        <Navbar />
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div
            className={`mb-8 transition-all duration-1000 ${isLoaded ? "animate-fadeInUp opacity-100" : "opacity-0"}`}
          >
            <div className="relative">
              <h1 className="text-9xl md:text-[12rem] font-bold text-gray-200 select-none">404</h1>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center animate-bounce-slow">
                  <AlertTriangle className="h-12 w-12 text-red-500" />
                </div>
              </div>
            </div>
          </div>

          <Card
            className={`mb-8 border-0 bg-white/90 backdrop-blur-sm shadow-xl transition-all duration-1000 delay-300 ${isLoaded ? "animate-fadeInUp opacity-100" : "opacity-0"}`}
          >
            <CardContent className="pt-8 pb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">{t("pageNotFound")}</h2>
              <p className="text-lg text-gray-600 mb-6">{t("pageNotFoundDesc")}</p>
              <div className="text-left max-w-md mx-auto mb-8">
                <h3 className="font-semibold text-gray-700 mb-3">{t("possibleReasons")}:</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 flex-shrink-0"></span>
                    {t("urlTypo")}
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 flex-shrink-0"></span>
                    {t("pageRemoved")}
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 flex-shrink-0"></span>
                    {t("temporaryUnavailable")}
                  </li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 btn-animate"
                >
                  <Link href="/">
                    <Home className="h-4 w-4 mr-2" />
                    {t("goHome")}
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent"
                >
                  <Link href="/cars">
                    <Car className="h-4 w-4 mr-2" />
                    {t("browseCars")}
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card
            className={`mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 transition-all duration-1000 delay-500 ${isLoaded ? "animate-fadeInUp opacity-100" : "opacity-0"}`}
          >
            <CardContent className="pt-6 pb-6">
              <h3 className="font-semibold text-blue-800 mb-3 flex items-center justify-center gap-2">
                <Search className="h-5 w-5" />
                {t("searchInstead")}
              </h3>
              <p className="text-sm text-blue-700 mb-4">{t("searchDesc")}</p>
              <Button
                asChild
                variant="outline"
                className="border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent"
              >
                <Link href="/cars">
                  <Search className="h-4 w-4 mr-2" />
                  {t("searchCars")}
                </Link>
              </Button>
            </CardContent>
          </Card>

          <div
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 transition-all duration-1000 delay-700 ${isLoaded ? "animate-fadeInUp opacity-100" : "opacity-0"}`}
          >
            <Button asChild variant="ghost" className="h-auto p-4 flex-col gap-2 hover:bg-white/50">
              <Link href="/cars">
                <Car className="h-6 w-6 text-blue-500" />
                <span className="text-sm font-medium">{t("allCars")}</span>
              </Link>
            </Button>

            <Button asChild variant="ghost" className="h-auto p-4 flex-col gap-2 hover:bg-white/50">
              <Link href="/sell">
                <span className="text-lg">📝</span>
                <span className="text-sm font-medium">{t("sellCar")}</span>
              </Link>
            </Button>

            <Button asChild variant="ghost" className="h-auto p-4 flex-col gap-2 hover:bg-white/50">
              <Link href="/about">
                <span className="text-lg">ℹ️</span>
                <span className="text-sm font-medium">{t("about")}</span>
              </Link>
            </Button>

            <Button asChild variant="ghost" className="h-auto p-4 flex-col gap-2 hover:bg-white/50">
              <Link href="/contact">
                <span className="text-lg">📞</span>
                <span className="text-sm font-medium">{t("contact")}</span>
              </Link>
            </Button>
          </div>

          <div
            className={`mt-8 transition-all duration-1000 delay-1000 ${isLoaded ? "animate-fadeInUp opacity-100" : "opacity-0"}`}
          >
            <Button onClick={() => window.history.back()} variant="ghost" className="text-gray-500 hover:text-gray-700">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t("goBack")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
