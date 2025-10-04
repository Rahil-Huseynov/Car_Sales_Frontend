"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, ArrowLeft, Calendar, Lock, Eye, Database, Cookie } from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { useLanguage } from "@/hooks/use-language"
import { getTranslation, translateString } from "@/lib/i18n"

export default function PrivacyPage() {
  const [isLoading, setIsLoading] = useState(true)
  const { language, changeLanguage } = useLanguage()
  const t = (key: string) => translateString(language, key)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  const pageContent = {
    lastUpdated: t("privacy.lastUpdated"),
    sections: [
      {
        title: t("privacy.sections.collection.title"),
        icon: <Database className="h-5 w-5" />,
        content: t("privacy.sections.collection.content"),
      },
      {
        title: t("privacy.sections.usage.title"),
        icon: <Eye className="h-5 w-5" />,
        content: t("privacy.sections.usage.content"),
      },
      {
        title: t("privacy.sections.sharing.title"),
        icon: <Shield className="h-5 w-5" />,
        content: t("privacy.sections.sharing.content"),
      },
      {
        title: t("privacy.sections.cookies.title"),
        icon: <Cookie className="h-5 w-5" />,
        content: t("privacy.sections.cookies.content"),
      },
      {
        title: t("privacy.sections.security.title"),
        icon: <Lock className="h-5 w-5" />,
        content: t("privacy.sections.security.content"),
      },
      {
        title: t("privacy.sections.rights.title"),
        icon: <Shield className="h-5 w-5" />,
        content: t("privacy.sections.rights.content"),
      },
      {
        title: t("privacy.sections.children.title"),
        icon: <Shield className="h-5 w-5" />,
        content: t("privacy.sections.children.content"),
      },
      {
        title: t("privacy.sections.transfer.title"),
        icon: <Database className="h-5 w-5" />,
        content: t("privacy.sections.transfer.content"),
      },
      {
        title: t("privacy.sections.changes.title"),
        icon: <Calendar className="h-5 w-5" />,
        content: t("privacy.sections.changes.content"),
      },
    ],
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar currentLanguage={language} onLanguageChange={changeLanguage} />
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
        <Navbar currentLanguage={language} onLanguageChange={changeLanguage} />
      </div>

      <section className="bg-gradient-to-br from-teal-500 via-teal-600 to-teal-700 text-white py-12 md:py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-400/10 to-transparent"></div>
        <div className="absolute top-10 right-10 w-32 h-32 bg-teal-400/10 rounded-full blur-xl animate-pulse-slow"></div>
        <div className="absolute bottom-10 left-10 w-24 h-24 bg-teal-300/10 rounded-full blur-lg animate-bounce-slow"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="hero-title">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
              <Shield className="h-8 w-8 text-teal-200" />
              {t("privacyPolicy")}
            </h1>
            <p className="text-teal-100">{t("privacySubtitle")}</p>
            <div className="flex items-center gap-2 mt-4 text-teal-200">
              <Calendar className="h-4 w-4" />
              <span className="text-sm">{pageContent.lastUpdated}</span>
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

          <div className="space-y-6">
            {pageContent.sections.map((section, index) => (
              <Card
                key={index}
                className="animate-fadeInUp border-0 bg-white/90 backdrop-blur-sm hover-lift"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <CardTitle className="text-xl text-gray-800 flex items-center gap-3">
                    <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                      {section.icon}
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

          <Card className="mt-8 bg-gradient-to-r from-teal-50 to-cyan-50 border-teal-200 animate-fadeInUp">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-teal-800">
                <Shield className="h-5 w-5" />
                {t("dataProtection")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-teal-700 mb-4">{t("dataProtectionDesc")}</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild className="bg-teal-600 hover:bg-teal-700">
                  <Link href="/contact">{t("contactUs")}</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-teal-200 text-teal-600 hover:bg-teal-50 bg-transparent"
                >
                  <Link href="/terms">{t("termsOfService")}</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
