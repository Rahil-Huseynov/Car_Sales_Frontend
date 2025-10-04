"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Home, RefreshCw, AlertTriangle, Bug, Mail } from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { useLanguage } from "@/hooks/use-language"
import { getTranslation } from "@/lib/i18n"

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  const { language, changeLanguage } = useLanguage()
  const t = (key: string): string => {
    const val = getTranslation(language, key)
    return typeof val === "string" ? val : key
  }

  const [isLoaded, setIsLoaded] = useState(false)
  const [errorDetails, setErrorDetails] = useState<string>("")

  useEffect(() => {
    setIsLoaded(true)
    console.error("Application error:", error)
    setErrorDetails(error.message || "")
  }, [error])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="navbar-slide">
        <Navbar currentLanguage={language} onLanguageChange={changeLanguage} />
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div
            className={`mb-8 transition-all duration-1000 ${isLoaded ? "animate-fadeInUp opacity-100" : "opacity-0"}`}
          >
            <div className="relative">
              <div className="w-32 h-32 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse-slow">
                <Bug className="h-16 w-16 text-red-500" />
              </div>
            </div>
          </div>
          <Card
            className={`mb-8 border-0 bg-white/90 backdrop-blur-sm shadow-xl transition-all duration-1000 delay-300 ${isLoaded ? "animate-fadeInUp opacity-100" : "opacity-0"}`}
          >
            <CardContent className="pt-8 pb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">{t("error.title")}</h1>
              <p className="text-lg text-gray-600 mb-6">
                {t("error.message")}
              </p>

              {process.env.NODE_ENV === "development" && errorDetails && (
                <Alert className="mb-6 border-red-200 bg-red-50 text-left">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800 font-mono text-sm">{errorDetails}</AlertDescription>
                </Alert>
              )}

              <div className="text-left max-w-md mx-auto mb-8">
                <h3 className="font-semibold text-gray-700 mb-3">{t("error.whatHappened")}</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 flex-shrink-0"></span>
                    {t("error.serverIssue")}
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 flex-shrink-0"></span>
                    {t("error.dbConnectionLost")}
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 flex-shrink-0"></span>
                    {t("error.unexpectedSystemError")}
                  </li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={reset}
                  className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 btn-animate"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  {t("error.tryAgain")}
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent"
                >
                  <Link href="/">
                    <Home className="h-4 w-4 mr-2" />
                    {t("error.home")}
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card
            className={`mb-8 bg-gradient-to-r from-red-50 to-orange-50 border-red-200 transition-all duration-1000 delay-500 ${isLoaded ? "animate-fadeInUp opacity-100" : "opacity-0"}`}
          >
            <CardContent className="pt-6 pb-6">
              <h3 className="font-semibold text-red-800 mb-3 flex items-center justify-center gap-2">
                <Mail className="h-5 w-5" />
                {t("error.needHelp")}
              </h3>
              <p className="text-sm text-red-700 mb-4">
                {t("error.supportMessage")}
              </p>
              <Button asChild variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 bg-transparent">
                <Link href="/contact">
                  <Mail className="h-4 w-4 mr-2" />
                  {t("error.contactSupport")}
                </Link>
              </Button>
            </CardContent>
          </Card>

          {error.digest && (
            <div
              className={`text-xs text-gray-500 transition-all duration-1000 delay-700 ${isLoaded ? "animate-fadeInUp opacity-100" : "opacity-0"}`}
            >
              {t("error.errorIdLabel")}: {error.digest}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
