"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, ArrowLeft, Calendar, User, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { useLanguage } from "@/hooks/use-language"
import { translateString,translations } from "@/lib/i18n"
import { useDefaultLanguage } from "@/components/useLanguage"

interface TermsSection {
  title: string
  content: string
}

interface TermsData {
  lastUpdated?: string
  sections?: TermsSection[]
}

export default function TermsPage() {
 const { lang, setLang } = useDefaultLanguage();
  const t = (key: string) => translateString(lang, key);

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600)
    return () => clearTimeout(timer)
  }, [])

  const termsDataRaw = translateString(lang, "termsitem")
  const termsData = translations[lang]["termsitem"] as
    | { lastUpdated?: string; sections?: { title: string; content: string }[] }
    | undefined

  const pageLastUpdated = termsData?.lastUpdated ?? "October 08, 2025"
  const sections = termsData?.sections ?? []

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/3 mb-6"></div>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="bg-white rounded-lg p-6">
                  <div className="h-6 bg-gray-300 rounded w-1/4 mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-300 rounded"></div>
                    <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-300 rounded w-4/6"></div>
                  </div>
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
      <div className="navbar-slide">
        <Navbar />
      </div>
      <section className="bg-gradient-to-br from-indigo-500 via-indigo-600 to-indigo-700 text-white py-12 md:py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-400/10 to-transparent"></div>
        <div className="absolute top-10 right-10 w-32 h-32 bg-indigo-400/10 rounded-full blur-xl animate-pulse-slow"></div>
        <div className="absolute bottom-10 left-10 w-24 h-24 bg-indigo-300/10 rounded-full blur-lg animate-bounce-slow"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="hero-title">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
              <FileText className="h-8 w-8 text-indigo-200" />
              {t("termsOfService")}
            </h1>
            <p className="text-indigo-100">{t("termsSubtitle")}</p>
            <div className="flex items-center gap-2 mt-4 text-indigo-200">
              <Calendar className="h-4 w-4" />
              <span className="text-sm">{pageLastUpdated}</span>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Button asChild variant="outline" className="mb-6 animate-fadeInUp bg-transparent">
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t("backToHome")}
            </Link>
          </Button>

          <Card className="mb-8 border-yellow-200 bg-yellow-50 animate-fadeInUp">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-yellow-800 mb-1">{t("importantNotice")}</h4>
                  <p className="text-sm text-yellow-700">{t("termsNotice")}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            {sections.map((section, index) => (
              <Card
                key={index}
                className={`animate-fadeInUp border-0 bg-white/90 backdrop-blur-sm hover-lift`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <CardTitle className="text-xl text-gray-800 flex items-center gap-2">
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                      <span className="text-indigo-600 font-bold text-sm">{index + 1}</span>
                    </div>
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-gray max-w-none">
                    {section.content.split("\n\n").map((paragraph, pIndex) => (
                      <p key={pIndex} className="text-gray-700 leading-relaxed mb-4 last:mb-0">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mt-8 bg-gradient-to-r from-indigo-50 to-blue-50 border-indigo-200 animate-fadeInUp">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-indigo-800">
                <User className="h-5 w-5" />
                {t("needHelp")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-indigo-700 mb-4">{t("contactUsForHelp")}</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild className="bg-indigo-600 hover:bg-indigo-700">
                  <Link href="/contact">{t("contactUs")}</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-indigo-200 text-indigo-600 hover:bg-indigo-50 bg-transparent"
                >
                  <Link href="/privacy">{t("privacyPolicy")}</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}