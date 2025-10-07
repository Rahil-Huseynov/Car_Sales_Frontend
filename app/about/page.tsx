"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Award, Shield, Globe, Heart, User } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { useLanguage } from "@/hooks/use-language"
import { useEffect, useState } from "react"
import { apiClient } from "@/lib/api-client"
import { useAuth } from "@/lib/auth-context"
import { getTranslation, translateString } from "@/lib/i18n"
import { useDefaultLanguage } from "@/components/useLanguage"

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
  const { language, changeLanguage } = useLanguage()
  const { lang, setLang } = useDefaultLanguage();
  const t = (key: string) => translateString(lang, key);


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

  const values = [
    {
      icon: Shield,
      title: t("about.values.reliability.title"),
      description: t("about.values.reliability.description"),
    },
    {
      icon: Award,
      title: t("about.values.quality.title"),
      description: t("about.values.quality.description"),
    },
    {
      icon: Heart,
      title: t("about.values.customerSatisfaction.title"),
      description: t("about.values.customerSatisfaction.description"),
    },
    {
      icon: Globe,
      title: t("about.values.globalStandards.title"),
      description: t("about.values.globalStandards.description"),
    },
  ]

  const team = [
    {
      name: t("about.team.members.0.name"),
      position: t("about.team.members.0.position"),
      experience: t("about.team.members.0.experience"),
    },
    {
      name: t("about.team.members.1.name"),
      position: t("about.team.members.1.position"),
      experience: t("about.team.members.1.experience"),
    },
    {
      name: t("about.team.members.2.name"),
      position: t("about.team.members.2.position"),
      experience: t("about.team.members.2.experience"),
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t("about.title")}</h1>
          <p className="text-xl text-blue-100">{t("about.subtitle")}</p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl text-center">{t("about.mission")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-gray-600 text-center max-w-4xl mx-auto leading-relaxed">{t("about.missionText")}</p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-blue-600 mb-2">8+</div>
              <div className="text-sm text-gray-600">{t("about.stats.experience")}</div>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-blue-600 mb-2">5000+</div>
              <div className="text-sm text-gray-600">{t("about.stats.cars")}</div>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-blue-600 mb-2">15000+</div>
              <div className="text-sm text-gray-600">{t("about.stats.customers")}</div>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-blue-600 mb-2">25+</div>
              <div className="text-sm text-gray-600">{t("about.stats.cities")}</div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">{t("about.values.title")}</h2>
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
          <h2 className="text-3xl font-bold text-center mb-8">{t("about.team.title")}</h2>
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
