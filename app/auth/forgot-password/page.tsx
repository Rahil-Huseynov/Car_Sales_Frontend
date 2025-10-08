"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Mail, Send, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { getTranslation, translateString } from "@/lib/i18n"
import { useDefaultLanguage } from "@/components/useLanguage"
import apiClient from "@/lib/api-client"

export default function ForgotPasswordPage() {
  const { lang, setLang } = useDefaultLanguage();
  const t = (key: string) => translateString(lang, key);


  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (!email || !email.includes("@")) {
      setError(t("invalidEmail"))
      setIsLoading(false)
      return
    }

    try {
      await apiClient.forgotPassword(email);
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setIsSuccess(true)
    } catch (err) {
      setError(t("resetError"))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="navbar-slide">
        <Navbar />
      </div>
      <section className="bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 text-white py-12 md:py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-400/10 to-transparent"></div>
        <div className="absolute top-10 right-10 w-32 h-32 bg-orange-400/10 rounded-full blur-xl animate-pulse-slow"></div>
        <div className="absolute bottom-10 left-10 w-24 h-24 bg-orange-300/10 rounded-full blur-lg animate-bounce-slow"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="hero-title text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center justify-center gap-3">
              <Mail className="h-8 w-8 text-orange-200" />
              {t("forgotPassword")}
            </h1>
            <p className="text-orange-100">{t("forgotPasswordSubtitle")}</p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Button asChild variant="outline" className="mb-6 animate-fadeInUp bg-transparent">
            <Link href="/auth/login">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t("backToLogin")}
            </Link>
          </Button>

          <Card className="animate-fadeInUp border-0 bg-white/90 backdrop-blur-sm shadow-xl">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-orange-600" />
              </div>
              <CardTitle className="text-2xl text-gray-800">
                {isSuccess ? t("checkEmail") : t("resetPassword")}
              </CardTitle>
              <p className="text-gray-600 text-sm">{isSuccess ? t("resetLinkSent") : t("resetPasswordDesc")}</p>
            </CardHeader>

            <CardContent>
              {isSuccess ? (
                <div className="text-center space-y-4 animate-fadeInUp">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>

                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      {t("resetEmailSent")} <strong>{email}</strong>
                    </AlertDescription>
                  </Alert>

                  <div className="text-sm text-gray-600 space-y-2">
                    <p>{t("checkSpamFolder")}</p>
                    <p>{t("linkExpires")}</p>
                  </div>

                  <div className="flex flex-col gap-3 pt-4">
                    <Button
                      onClick={() => {
                        setIsSuccess(false)
                        setEmail("")
                      }}
                      variant="outline"
                      className="w-full bg-transparent"
                    >
                      {t("sendAgain")}
                    </Button>

                    <Button
                      asChild
                      className="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800"
                    >
                      <Link href="/auth/login">{t("backToLogin")}</Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <Alert className="border-red-200 bg-red-50 animate-fadeInUp">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-red-800">{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-700">
                      {t("emailAddress")}
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder={t("enterEmail")}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 border-gray-200 focus:border-orange-400 transition-colors duration-300"
                        required
                      />
                    </div>
                    <p className="text-xs text-gray-500">{t("resetInstructions")}</p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 btn-animate"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        {t("sending")}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Send className="h-4 w-4" />
                        {t("sendResetLink")}
                      </div>
                    )}
                  </Button>

                  <div className="text-center pt-4">
                    <p className="text-sm text-gray-600">
                      {t("rememberPassword")}{" "}
                      <Link
                        href="/auth/login"
                        className="text-orange-600 hover:text-orange-700 font-medium transition-colors duration-300"
                      >
                        {t("signIn")}
                      </Link>
                    </p>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>

          <Card className="mt-6 bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200 animate-fadeInUp">
            <CardContent className="pt-6">
              <div className="text-center">
                <h4 className="font-semibold text-orange-800 mb-2">{t("needHelp")}</h4>
                <p className="text-sm text-orange-700 mb-4">{t("contactSupport")}</p>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="border-orange-200 text-orange-600 hover:bg-orange-50 bg-transparent"
                >
                  <Link href="/contact">{t("contactUs")}</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
