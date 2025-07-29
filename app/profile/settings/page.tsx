"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Settings, User, Bell, Shield, Globe, Camera, Save, Eye, EyeOff } from 'lucide-react'
import { useLanguage } from "@/hooks/use-language"
import { getTranslation } from "@/lib/i18n"
import { LanguageSwitcher } from "@/components/language-switcher"

export default function SettingsPage() {
  const { language, changeLanguage } = useLanguage()
  const [showPassword, setShowPassword] = useState(false)
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    marketing: false
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="container mx-auto px-4 py-8">
        <div className="animate-fadeIn">
          <div className="flex items-center gap-3 mb-8">
            <Settings className="h-8 w-8 text-purple-600" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {getTranslation(language, "settings")}
            </h1>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Profil
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Bildirişlər
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Təhlükəsizlik
              </TabsTrigger>
              <TabsTrigger value="language" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Dil
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="animate-slideInUp">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Profil Məlumatları
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-6">
                    <div className="relative group">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src="/placeholder.svg?height=96&width=96" />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <Button 
                        size="sm" 
                        className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">John Doe</h3>
                      <p className="text-gray-500">john.doe@example.com</p>
                      <Badge variant="secondary" className="mt-2">Premium İstifadəçi</Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Ad</Label>
                      <Input id="firstName" defaultValue="John" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Soyad</Label>
                      <Input id="lastName" defaultValue="Doe" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" defaultValue="john.doe@example.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefon</Label>
                      <Input id="phone" defaultValue="+994 50 123 45 67" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">Şəhər</Label>
                      <Input id="city" defaultValue="Bakı" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">Şirkət</Label>
                      <Input id="company" defaultValue="Euro Car" />
                    </div>
                  </div>

                  <Button className="w-full animate-pulse">
                    <Save className="h-4 w-4 mr-2" />
                    Dəyişiklikləri Saxla
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="animate-slideInUp">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Bildiriş Tənzimləmələri
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Email Bildirişləri</h4>
                        <p className="text-sm text-gray-500">Yeni elanlar və mesajlar haqqında email alın</p>
                      </div>
                      <Switch 
                        checked={notifications.email}
                        onCheckedChange={(checked) => setNotifications({...notifications, email: checked})}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">SMS Bildirişləri</h4>
                        <p className="text-sm text-gray-500">Vacib məlumatlar üçün SMS alın</p>
                      </div>
                      <Switch 
                        checked={notifications.sms}
                        onCheckedChange={(checked) => setNotifications({...notifications, sms: checked})}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Push Bildirişləri</h4>
                        <p className="text-sm text-gray-500">Brauzer bildirişləri alın</p>
                      </div>
                      <Switch 
                        checked={notifications.push}
                        onCheckedChange={(checked) => setNotifications({...notifications, push: checked})}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Marketing Bildirişləri</h4>
                        <p className="text-sm text-gray-500">Xüsusi təkliflər və kampaniyalar</p>
                      </div>
                      <Switch 
                        checked={notifications.marketing}
                        onCheckedChange={(checked) => setNotifications({...notifications, marketing: checked})}
                      />
                    </div>
                  </div>

                  <Button className="w-full">
                    <Save className="h-4 w-4 mr-2" />
                    Tənzimləmələri Saxla
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="animate-slideInUp">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Təhlükəsizlik Tənzimləmələri
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Cari Şifrə</Label>
                      <div className="relative">
                        <Input 
                          id="currentPassword" 
                          type={showPassword ? "text" : "password"}
                          placeholder="Cari şifrənizi daxil edin"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newPassword">Yeni Şifrə</Label>
                      <Input 
                        id="newPassword" 
                        type="password"
                        placeholder="Yeni şifrənizi daxil edin"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Şifrəni Təsdiqlə</Label>
                      <Input 
                        id="confirmPassword" 
                        type="password"
                        placeholder="Yeni şifrənizi təkrar daxil edin"
                      />
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h4 className="font-medium mb-4">İki Faktorlu Doğrulama</h4>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">SMS ilə doğrulama</p>
                        <p className="text-sm text-gray-500">Hesabınızı daha təhlükəsiz edin</p>
                      </div>
                      <Switch />
                    </div>
                  </div>

                  <Button className="w-full">
                    <Save className="h-4 w-4 mr-2" />
                    Şifrəni Yenilə
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="language" className="animate-slideInUp">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Dil Tənzimləmələri
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">İnterfeys Dili</h4>
                        <p className="text-sm text-gray-500">Saytın dilini seçin</p>
                      </div>
                      <LanguageSwitcher 
                        currentLanguage={language} 
                        onLanguageChange={changeLanguage}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { code: "az", name: "Azərbaycan dili", flag: "🇦🇿" },
                        { code: "en", name: "English", flag: "🇺🇸" },
                        { code: "ru", name: "Русский", flag: "🇷🇺" }
                      ].map((lang) => (
                        <Card 
                          key={lang.code}
                          className={`cursor-pointer transition-all hover:shadow-md ${
                            language === lang.code ? 'ring-2 ring-purple-500' : ''
                          }`}
                          onClick={() => changeLanguage(lang.code as any)}
                        >
                          <CardContent className="p-4 text-center">
                            <div className="text-2xl mb-2">{lang.flag}</div>
                            <h4 className="font-medium">{lang.name}</h4>
                            {language === lang.code && (
                              <Badge className="mt-2">Seçilmiş</Badge>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  <Button className="w-full">
                    <Save className="h-4 w-4 mr-2" />
                    Dil Tənzimləmələrini Saxla
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
