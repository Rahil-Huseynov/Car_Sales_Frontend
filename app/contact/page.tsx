"use client"

import React, { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { useLanguage } from "@/hooks/use-language"
import { getTranslation, translateString } from "@/lib/i18n"
import { apiClient } from "@/lib/api-client"
import { useAuth } from "@/lib/auth-context"
import { useDefaultLanguage } from "@/components/useLanguage"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import ReCAPTCHA from "react-google-recaptcha"

type User = {
  id: number
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  role: string
  createdAt: string
}

export default function ContactPage() {
  const { language, changeLanguage } = useLanguage()
  const { lang, setLang } = useDefaultLanguage();
  const recaptchaRef = useRef<ReCAPTCHA>(null)
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const t = (key: string) => translateString(lang, key);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [profileData, setProfileData] = useState<User | null>(null)
  const { logout } = useAuth()
  const [loading, setLoading] = useState(true)
  const [submitLoading, setSubmitLoading] = useState(false)

  const handleCaptcha = (token: string | null) => {
    setCaptchaToken(token)
  }

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
      if (!token) {
        setLoading(false)
        return
      }
      try {
        const data = await apiClient.getCurrentUser()
        setProfileData(data)
      } catch (err: any) {
        logout()
        toast.error(t("contact.sessionExpired") || "Session expired. Please login again.")
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
    const interval = setInterval(fetchUser, 10000)
    return () => clearInterval(interval)
  }, [logout])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitLoading) return;
    setSubmitLoading(true);

    if (!captchaToken) {
      toast.error(t("captchaRequired") || "Please complete the CAPTCHA", { position: "top-right", autoClose: 4000 })
      setSubmitLoading(false)
      return
    }


    try {
      await apiClient.sendContactMessage(formData)
      toast.success(t("contact.sentSuccess") || "Message sent — we will contact you soon.");
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        (t("contact.sendError") || "Error sending message");
      toast.error(msg);
    } finally {
      setSubmitLoading(false);
      recaptchaRef.current?.reset()
      setCaptchaToken(null)
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t("contact.title")}</h1>
          <p className="text-xl text-blue-100">{t("contact.subtitle")}</p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>{t("contact.contactInfo")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">{t("contact.addressLabel")}</p>
                    <p className="text-gray-600">{t("contact.addressValue")}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">{t("contact.phoneLabel")}</p>
                    <p className="text-gray-600">{t("contact.phone1")}</p>
                    <p className="text-gray-600">{t("contact.phone2")}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">{t("contact.emailLabel")}</p>
                    <p className="text-gray-600">{t("contact.email1")}</p>
                    <p className="text-gray-600">{t("contact.email2")}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">{t("contact.workingHoursLabel")}</p>
                    <p className="text-gray-600">{t("contact.monday")}: 09:00 - 18:00</p>
                    <p className="text-gray-600">{t("contact.saturday")}: 10:00 - 16:00</p>
                    <p className="text-gray-600">{t("contact.sunday")}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-0">
                <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">{t("contact.mapPlaceholder")}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                {t("contact.sendMessage")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4" aria-busy={submitLoading}>
                <div>
                  <Label htmlFor="name">{t("contact.name")}</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email">{t("contact.emailLabel")}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phone">{t("contact.phoneLabel")}</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="subject">{t("contact.subject")}</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData((prev) => ({ ...prev, subject: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="message">{t("contact.messageLabel")}</Label>
                  <Textarea
                    id="message"
                    className="resize-none"
                    value={formData.message}
                    onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                    rows={5}
                    required
                  />
                </div>
                <div className="grid place-items-center w-full">
                  <ReCAPTCHA
                    ref={recaptchaRef}
                    sitekey={process.env.NEXT_PUBLIC_SITE_KEY!}
                    onChange={handleCaptcha}
                    theme="light"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
                  disabled={submitLoading || !captchaToken}
                  aria-disabled={submitLoading}
                >
                  {submitLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="h-4 w-4 mr-2 animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.25"></circle>
                        <path d="M22 12a10 10 0 00-10-10" stroke="currentColor" strokeWidth="4" strokeLinecap="round"></path>
                      </svg>
                      {t("contact.sending") || "Loading..."}
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <Send className="h-4 w-4 mr-2" />
                      {t("contact.send")}
                    </span>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
