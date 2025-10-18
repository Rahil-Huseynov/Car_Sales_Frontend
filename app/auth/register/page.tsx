"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Car, Eye, EyeOff, Mail, Lock, User, Phone } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import apiClient from "@/lib/api-client"
import { Navbar } from "@/components/navbar"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import CountryCodeSelect from "@/components/CountryCodeSelect"
import { translateString } from "@/lib/i18n"
import { useDefaultLanguage } from "@/components/useLanguage"
import ReCAPTCHA from "react-google-recaptcha"

export default function RegisterPage() {
  const { lang, setLang } = useDefaultLanguage();
  const t = (key: string) => translateString(lang, key);


  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [phoneCode, setPhoneCode] = useState<string>("")
  const [phoneNumber, setPhoneNumber] = useState<string>("")
  const [agreeToTerms, setAgreeToTerms] = useState<boolean>(false)
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)

  const router = useRouter()
  const timeoutRef = useRef<number | null>(null)
  const recaptchaRef = useRef<ReCAPTCHA>(null)

  useEffect(() => {
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current)
    }
  }, [])

  const clearStatusAfter = (ms = 4000) => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current)
    timeoutRef.current = window.setTimeout(() => setStatusMessage(null), ms)
  }

  const handleCaptcha = (token: string | null) => {
    setCaptchaToken(token)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsPending(true)
    setStatusMessage(null)

    if (!captchaToken) {
      setIsPending(false)
      const msg = t("captchaRequired") || "Please complete the CAPTCHA"
      setStatusMessage({ type: "error", text: msg })
      toast.error(msg, { position: "top-right", autoClose: 4000 })
      clearStatusAfter(4000)
      return
    }

    const form = event.currentTarget
    const formData = new FormData(form)

    const password = String(formData.get("password") ?? "")
    const confirmPassword = String(formData.get("confirmPassword") ?? "")

    if (password !== confirmPassword) {
      setIsPending(false)
      const msg = t("passwordsDoNotMatch")
      setStatusMessage({ type: "error", text: msg })
      toast.error(msg, { position: "top-right", autoClose: 4000 })
      clearStatusAfter(4000)
      return
    }

    if (!agreeToTerms) {
      setIsPending(false)
      const msg = t("mustAcceptTerms")
      setStatusMessage({ type: "error", text: msg })
      toast.error(msg, { position: "top-right", autoClose: 4000 })
      clearStatusAfter(4000)
      return
    }

    const fixedFormData = new FormData()
    fixedFormData.append("email", String(formData.get("email") ?? ""))
    fixedFormData.append("password", password)
    fixedFormData.append("firstName", String(formData.get("firstName") ?? ""))
    fixedFormData.append("lastName", String(formData.get("lastName") ?? ""))
    fixedFormData.append("phoneNumber", phoneNumber)
    fixedFormData.append("phoneCode", phoneCode)
    fixedFormData.append("role", "basic")

    try {
      const response = await apiClient.register(fixedFormData)
      setIsPending(false)

      if (response?.success) {
        if (response.access_token) {
          try {
            localStorage.setItem("access_token", response.access_token)
            sessionStorage.setItem("access_token", response.access_token);
          } catch { }
        }
        const msg = response.message || t("registrationSuccess")
        setStatusMessage({ type: "success", text: msg })
        toast.success(msg, { position: "top-right", autoClose: 3000 })
        if (timeoutRef.current) window.clearTimeout(timeoutRef.current)
        timeoutRef.current = window.setTimeout(() => {
          setStatusMessage(null)
          router.push("/auth/login")
        }, 1200)
      } else {
        const msg = response?.message || t("registrationFailed")
        setStatusMessage({ type: "error", text: msg })
        toast.error(msg, { position: "top-right", autoClose: 4000 })
        clearStatusAfter(4000)
      }
    } catch (error: any) {
      setIsPending(false)
      const errorMessage = error?.data?.message || error?.message || t("serverError")
      setStatusMessage({ type: "error", text: errorMessage })
      toast.error(errorMessage, { position: "top-right", autoClose: 4000 })
      clearStatusAfter(4000)
    } finally {
      recaptchaRef.current?.reset()
      setCaptchaToken(null)
    }
  }

  return (
    <>
      <Navbar />
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

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md mx-4">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-blue-600 p-3 rounded-full">
                <Car className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">{t("createAccount")}</CardTitle>
            <CardDescription>{t("registerDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">{t("firstName")}</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input id="firstName" name="firstName" placeholder={t("firstNamePlaceholder")} className="pl-10" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">{t("lastName")}</Label>
                  <Input id="lastName" name="lastName" placeholder={t("lastNamePlaceholder")} required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">{t("email")}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input id="email" type="email" name="email" placeholder={t("emailPlaceholder")} className="pl-10" required />
                </div>
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
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      required
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{t("Password")}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder={t("passwordPlaceholder")}
                    className="pl-10 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{t("confirmPassword")}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder={t("confirmPasswordPlaceholder")}
                    className="pl-10 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  id="terms"
                  name="agreeToTerms"
                  type="checkbox"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="terms" className="text-sm">
                  <span>
                    {t("iAccept")}{" "}
                    <Link href="/terms" className="text-blue-600 hover:underline">{t("terms")}</Link>{" "}
                    {t("and")}{" "}
                    <Link href="/privacy" className="text-blue-600 hover:underline">{t("privacy")}</Link>
                  </span>
                </Label>
              </div>

              <div className="grid place-items-center w-full">
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey={process.env.NEXT_PUBLIC_SITE_KEY!}
                  onChange={handleCaptcha}
                  theme="light"
                />
              </div>

              <Button type="submit" className="w-full" disabled={isPending || !captchaToken}>
                {isPending ? t("registering") : t("register")}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-gray-600">{t("alreadyHaveAccount")} </span>
              <Link href="/auth/login" className="text-blue-600 hover:underline font-medium">{t("login")}</Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}