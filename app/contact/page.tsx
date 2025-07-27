"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { useLanguage } from "@/hooks/use-language"

export default function ContactPage() {
  const { language } = useLanguage()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })

  const content = {
    az: {
      title: "Bizimlə Əlaqə",
      subtitle: "Suallarınız varsa, bizimlə əlaqə saxlayın",
      contactInfo: "Əlaqə Məlumatları",
      sendMessage: "Mesaj Göndər",
      name: "Ad Soyad",
      email: "E-poçt",
      phone: "Telefon",
      subject: "Mövzu",
      message: "Mesaj",
      send: "Göndər",
      address: "Ünvan",
      workingHours: "İş Saatları",
      monday: "Bazar ertəsi - Cümə",
      saturday: "Şənbə",
      sunday: "Bazar günü bağlıdır",
    },
    en: {
      title: "Contact Us",
      subtitle: "If you have any questions, please contact us",
      contactInfo: "Contact Information",
      sendMessage: "Send Message",
      name: "Full Name",
      email: "Email",
      phone: "Phone",
      subject: "Subject",
      message: "Message",
      send: "Send",
      address: "Address",
      workingHours: "Working Hours",
      monday: "Monday - Friday",
      saturday: "Saturday",
      sunday: "Sunday closed",
    },
    ru: {
      title: "Свяжитесь с нами",
      subtitle: "Если у вас есть вопросы, свяжитесь с нами",
      contactInfo: "Контактная информация",
      sendMessage: "Отправить сообщение",
      name: "Полное имя",
      email: "Электронная почта",
      phone: "Телефон",
      subject: "Тема",
      message: "Сообщение",
      send: "Отправить",
      address: "Адрес",
      workingHours: "Рабочие часы",
      monday: "Понедельник - Пятница",
      saturday: "Суббота",
      sunday: "Воскресенье закрыто",
    },
  }

  const t = content[language]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Contact form submitted:", formData)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t.title}</h1>
          <p className="text-xl text-blue-100">{t.subtitle}</p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>{t.contactInfo}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">{t.address}</p>
                    <p className="text-gray-600">Bakı şəhəri, Nəsimi rayonu, Azadlıq prospekti 123</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">{t.phone}</p>
                    <p className="text-gray-600">+994 12 345 67 89</p>
                    <p className="text-gray-600">+994 50 123 45 67</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">{t.email}</p>
                    <p className="text-gray-600">info@eurocar.az</p>
                    <p className="text-gray-600">support@eurocar.az</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">{t.workingHours}</p>
                    <p className="text-gray-600">{t.monday}: 09:00 - 18:00</p>
                    <p className="text-gray-600">{t.saturday}: 10:00 - 16:00</p>
                    <p className="text-gray-600">{t.sunday}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-0">
                <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">
                    {language === "az"
                      ? "Xəritə burada olacaq"
                      : language === "en"
                        ? "Map will be here"
                        : "Здесь будет карта"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                {t.sendMessage}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">{t.name}</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email">{t.email}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phone">{t.phone}</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="subject">{t.subject}</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData((prev) => ({ ...prev, subject: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="message">{t.message}</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                    rows={5}
                    required
                  />
                </div>

                <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-blue-700">
                  <Send className="h-4 w-4 mr-2" />
                  {t.send}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
