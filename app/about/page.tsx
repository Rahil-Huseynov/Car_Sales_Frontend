"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Award, Shield, Globe, Heart, User } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { useLanguage } from "@/hooks/use-language"
import { useEffect, useState } from "react"
import { apiClient } from "@/lib/api-client"
import { useAuth } from "@/lib/auth-context"

type User = {
  id: number
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  role: string
  createdAt: string
}

export default function AboutPage() {
  const { language } = useLanguage()
  const [profileData, setProfileData] = useState<User | null>(null)
  const { logout } = useAuth()
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("accessToken")
      if (!token) {
        setLoading(false)
        return
      }
      try {
        const data = await apiClient.getCurrentUser()
        setProfileData(data)
      } catch {
        logout()
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [logout])



  const content = {
    az: {
      title: "Euro Car Haqqında",
      subtitle: "Avropa keyfiyyətində avtomobil satış platforması",
      mission: "Missiyamız",
      missionText:
        "Euro Car olaraq, müştərilərimizə ən yaxşı avtomobil alış-satış təcrübəsini təqdim etmək və Azərbaycanda avtomobil bazarını inkişaf etdirmək missiyamızdır.",
      values: "Dəyərlərimiz",
      team: "Komandamız",
      stats: "Statistikalar",
      experience: "İl Təcrübə",
      cars: "Avtomobil",
      customers: "Müştəri",
      cities: "Şəhər",
    },
    en: {
      title: "About Euro Car",
      subtitle: "European quality car sales platform",
      mission: "Our Mission",
      missionText:
        "As Euro Car, our mission is to provide our customers with the best car buying and selling experience and to develop the automotive market in Azerbaijan.",
      values: "Our Values",
      team: "Our Team",
      stats: "Statistics",
      experience: "Years Experience",
      cars: "Cars",
      customers: "Customers",
      cities: "Cities",
    },
    ru: {
      title: "О Euro Car",
      subtitle: "Платформа продажи автомобилей европейского качества",
      mission: "Наша миссия",
      missionText:
        "Как Euro Car, наша миссия - предоставить нашим клиентам лучший опыт покупки и продажи автомобилей и развивать автомобильный рынок в Азербайджане.",
      values: "Наши ценности",
      team: "Наша команда",
      stats: "Статистика",
      experience: "Лет опыта",
      cars: "Автомобилей",
      customers: "Клиентов",
      cities: "Городов",
    },
  }

  const t = content[language]

  const values = [
    {
      icon: Shield,
      title: language === "az" ? "Etibarlılıq" : language === "en" ? "Reliability" : "Надежность",
      description:
        language === "az"
          ? "Hər bir avtomobil yoxlanılır və təsdiqlənir"
          : language === "en"
            ? "Every car is checked and verified"
            : "Каждый автомобиль проверяется и подтверждается",
    },
    {
      icon: Award,
      title: language === "az" ? "Keyfiyyət" : language === "en" ? "Quality" : "Качество",
      description:
        language === "az"
          ? "Yalnız yüksək keyfiyyətli avtomobillər"
          : language === "en"
            ? "Only high quality cars"
            : "Только высококачественные автомобили",
    },
    {
      icon: Heart,
      title:
        language === "az"
          ? "Müştəri Məmnuniyyəti"
          : language === "en"
            ? "Customer Satisfaction"
            : "Удовлетворенность клиентов",
      description:
        language === "az"
          ? "Müştərilərimizin məmnuniyyəti bizim prioritetimizdir"
          : language === "en"
            ? "Customer satisfaction is our priority"
            : "Удовлетворенность клиентов - наш приоритет",
    },
    {
      icon: Globe,
      title: language === "az" ? "Qlobal Standartlar" : language === "en" ? "Global Standards" : "Глобальные стандарты",
      description:
        language === "az"
          ? "Beynəlxalq standartlara uyğun xidmət"
          : language === "en"
            ? "Service according to international standards"
            : "Обслуживание по международным стандартам",
    },
  ]

  const team = [
    {
      name: "Elvin Məmmədov",
      position: language === "az" ? "Baş Direktor" : language === "en" ? "CEO" : "Генеральный директор",
      experience: language === "az" ? "15 il təcrübə" : language === "en" ? "15 years experience" : "15 лет опыта",
    },
    {
      name: "Aysel Həsənova",
      position: language === "az" ? "Satış Meneceri" : language === "en" ? "Sales Manager" : "Менеджер по продажам",
      experience: language === "az" ? "10 il təcrübə" : language === "en" ? "10 years experience" : "10 лет опыта",
    },
    {
      name: "Rəşad Əliyev",
      position:
        language === "az" ? "Texniki Direktor" : language === "en" ? "Technical Director" : "Технический директор",
      experience: language === "az" ? "12 il təcrübə" : language === "en" ? "12 years experience" : "12 лет опыта",
    },
  ]

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
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl text-center">{t.mission}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-gray-600 text-center max-w-4xl mx-auto leading-relaxed">{t.missionText}</p>
          </CardContent>
        </Card>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-blue-600 mb-2">8+</div>
              <div className="text-sm text-gray-600">{t.experience}</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-blue-600 mb-2">5000+</div>
              <div className="text-sm text-gray-600">{t.cars}</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-blue-600 mb-2">15000+</div>
              <div className="text-sm text-gray-600">{t.customers}</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-blue-600 mb-2">25+</div>
              <div className="text-sm text-gray-600">{t.cities}</div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">{t.values}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <value.icon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
                  <p className="text-gray-600 text-sm">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-3xl font-bold text-center mb-8">{t.team}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {team.map((member, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <User className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-1">{member.name}</h3>
                  <p className="text-blue-600 font-medium mb-2">{member.position}</p>
                  <Badge variant="outline">{member.experience}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
