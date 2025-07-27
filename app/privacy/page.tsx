"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, ArrowLeft, Calendar, Lock, Eye, Database, Cookie } from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { useLanguage } from "@/hooks/use-language"
import { getTranslation } from "@/lib/i18n"

export default function PrivacyPage() {
  const { language } = useLanguage()
  const t = (key: string) => getTranslation(language, key)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  const content = {
    az: {
      lastUpdated: "Son yenilənmə: 15 Yanvar 2024",
      sections: [
        {
          title: "1. Məlumat Toplama",
          icon: <Database className="h-5 w-5" />,
          content: `Biz aşağıdakı məlumatları toplayırıq:

• Şəxsi məlumatlar: Ad, soyad, email, telefon nömrəsi
• Hesab məlumatları: İstifadəçi adı, şifrə (şifrələnmiş)
• Avtomobil məlumatları: Elanlarınızda göstərdiyiniz məlumatlar
• Texniki məlumatlar: IP ünvan, brauzer məlumatları, cihaz məlumatları
• İstifadə məlumatları: Saytda necə hərəkət etdiyiniz, hansı səhifələri ziyarət etdiyiniz

Bu məlumatlar yalnız xidmətimizi təkmilləşdirmək və sizə daha yaxşı təcrübə təqdim etmək üçün istifadə olunur.`,
        },
        {
          title: "2. Məlumatların İstifadəsi",
          icon: <Eye className="h-5 w-5" />,
          content: `Topladığımız məlumatları aşağıdakı məqsədlər üçün istifadə edirik:

• Hesabınızı yaratmaq və idarə etmək
• Elanlarınızı dərc etmək və göstərmək
• Sizinlə əlaqə saxlamaq
• Xidmətlərimizi təkmilləşdirmək
• Təhlükəsizliyi təmin etmək
• Qanuni tələbləri yerinə yetirmək

Məlumatlarınız heç vaxt kommersiya məqsədləri üçün satılmır və ya icarəyə verilmir.`,
        },
        {
          title: "3. Məlumat Paylaşımı",
          icon: <Shield className="h-5 w-5" />,
          content: `Şəxsi məlumatlarınızı üçüncü tərəflərlə paylaşmırıq, istisna hallarda:

• Qanuni tələb olduqda
• Təhlükəsizlik təhdidi olduqda
• Sizin açıq razılığınızla
• Xidmət təminatçıları ilə (məhdud şəkildə)

Elan məlumatlarınız saytda digər istifadəçilər tərəfindən görünür, lakin əlaqə məlumatlarınız yalnız maraq göstərən alıcılara göstərilir.`,
        },
        {
          title: "4. Kukilər",
          icon: <Cookie className="h-5 w-5" />,
          content: `Saytımızda kukilərdən istifadə edirik:

• Zəruri kukilər: Saytın işləməsi üçün vacibdir
• Analitik kukilər: Saytın performansını ölçmək üçün
• Funksional kukilər: İstifadəçi təcrübəsini yaxşılaşdırmaq üçün
• Reklam kukiləri: Uyğun reklamlar göstərmək üçün

Brauzer tənzimləmələrinizdən kukiləri idarə edə bilərsiniz.`,
        },
        {
          title: "5. Məlumat Təhlükəsizliyi",
          icon: <Lock className="h-5 w-5" />,
          content: `Məlumatlarınızın təhlükəsizliyi bizim üçün prioritetdir:

• SSL şifrələmə istifadə edirik
• Məlumatlar təhlükəsiz serverlərdə saxlanılır
• Müntəzəm təhlükəsizlik yoxlamaları aparırıq
• Məhdud giriş hüquqları tətbiq edirik
• Şifrələr hash alqoritmi ilə qorunur

Buna baxmayaraq, internetdə 100% təhlükəsizlik zəmanəti vermək mümkün deyil.`,
        },
        {
          title: "6. Sizin Hüquqlarınız",
          icon: <Shield className="h-5 w-5" />,
          content: `GDPR və yerli qanunlara uyğun olaraq sizin hüquqlarınız:

• Məlumatlarınıza giriş hüququ
• Məlumatları düzəltmək hüququ
• Məlumatları silmək hüququ ("unudulmaq hüququ")
• Emal edilməsini məhdudlaşdırmaq hüququ
• Məlumat daşınması hüququ
• Etiraz etmək hüququ

Bu hüquqlarınızı həyata keçirmək üçün bizimlə əlaqə saxlayın.`,
        },
        {
          title: "7. Uşaqların Məxfiliyi",
          icon: <Shield className="h-5 w-5" />,
          content: `13 yaşından kiçik uşaqlardan məlumat toplamırıq:

• Yaş məhdudiyyəti var
• Valideyn razılığı tələb olunur
• Uşaq məlumatları aşkar edilərsə silinir
• Valideynlər əlaqə saxlaya bilər

Uşaqların təhlükəsizliyi bizim üçün vacibdir.`,
        },
        {
          title: "8. Beynəlxalq Köçürmə",
          icon: <Database className="h-5 w-5" />,
          content: `Məlumatlarınız Azərbaycan ərazisində saxlanılır:

• Yerli serverlər istifadə olunur
• Beynəlxalq köçürmə məhduddur
• Zəruri hallarda uyğun qoruma tədbirləri tətbiq olunur
• AB standartlarına uyğunluq təmin edilir`,
        },
        {
          title: "9. Siyasət Dəyişiklikləri",
          icon: <Calendar className="h-5 w-5" />,
          content: `Bu məxfilik siyasəti dəyişdirilə bilər:

• Dəyişikliklər saytda elan edilir
• Email bildirişi göndərilir
• Yeni siyasət dərhal qüvvəyə minir
• Köhnə versiyalar arxivdə saxlanılır`,
        },
      ],
    },
    en: {
      lastUpdated: "Last updated: January 15, 2024",
      sections: [
        {
          title: "1. Information Collection",
          icon: <Database className="h-5 w-5" />,
          content: `We collect the following information:

• Personal information: Name, surname, email, phone number
• Account information: Username, password (encrypted)
• Car information: Information you provide in your listings
• Technical information: IP address, browser information, device information
• Usage information: How you navigate the site, which pages you visit

This information is used only to improve our service and provide you with a better experience.`,
        },
        {
          title: "2. Use of Information",
          icon: <Eye className="h-5 w-5" />,
          content: `We use the collected information for the following purposes:

• Create and manage your account
• Publish and display your listings
• Communicate with you
• Improve our services
• Ensure security
• Comply with legal requirements

Your information is never sold or rented for commercial purposes.`,
        },
        {
          title: "3. Information Sharing",
          icon: <Shield className="h-5 w-5" />,
          content: `We do not share your personal information with third parties, except in cases:

• When legally required
• When there is a security threat
• With your explicit consent
• With service providers (in limited form)

Your listing information is visible to other users on the site, but your contact information is only shown to interested buyers.`,
        },
        {
          title: "4. Cookies",
          icon: <Cookie className="h-5 w-5" />,
          content: `We use cookies on our site:

• Essential cookies: Important for site functionality
• Analytics cookies: To measure site performance
• Functional cookies: To improve user experience
• Advertising cookies: To show relevant ads

You can manage cookies from your browser settings.`,
        },
        {
          title: "5. Data Security",
          icon: <Lock className="h-5 w-5" />,
          content: `The security of your data is our priority:

• We use SSL encryption
• Data is stored on secure servers
• We conduct regular security checks
• We apply limited access rights
• Passwords are protected with hash algorithm

However, it is not possible to guarantee 100% security on the internet.`,
        },
        {
          title: "6. Your Rights",
          icon: <Shield className="h-5 w-5" />,
          content: `In accordance with GDPR and local laws, your rights:

• Right to access your data
• Right to correct data
• Right to delete data ("right to be forgotten")
• Right to restrict processing
• Right to data portability
• Right to object

Contact us to exercise these rights.`,
        },
        {
          title: "7. Children's Privacy",
          icon: <Shield className="h-5 w-5" />,
          content: `We do not collect information from children under 13:

• Age restriction exists
• Parental consent is required
• Child data is deleted if discovered
• Parents can contact us

Children's safety is important to us.`,
        },
        {
          title: "8. International Transfer",
          icon: <Database className="h-5 w-5" />,
          content: `Your data is stored within Azerbaijan:

• Local servers are used
• International transfer is limited
• Appropriate protection measures are applied when necessary
• EU standards compliance is ensured`,
        },
        {
          title: "9. Policy Changes",
          icon: <Calendar className="h-5 w-5" />,
          content: `This privacy policy may be changed:

• Changes are announced on the site
• Email notification is sent
• New policy takes effect immediately
• Old versions are archived`,
        },
      ],
    },
    ru: {
      lastUpdated: "Последнее обновление: 15 января 2024",
      sections: [
        {
          title: "1. Сбор информации",
          icon: <Database className="h-5 w-5" />,
          content: `Мы собираем следующую информацию:

• Личная информация: Имя, фамилия, email, номер телефона
• Информация об учетной записи: Имя пользователя, пароль (зашифрованный)
• Информация об автомобиле: Информация, которую вы предоставляете в объявлениях
• Техническая информация: IP-адрес, информация о браузере, информация об устройстве
• Информация об использовании: Как вы перемещаетесь по сайту, какие страницы посещаете

Эта информация используется только для улучшения нашего сервиса и предоставления вам лучшего опыта.`,
        },
        {
          title: "2. Использование информации",
          icon: <Eye className="h-5 w-5" />,
          content: `Мы используем собранную информацию для следующих целей:

• Создание и управление вашей учетной записью
• Публикация и отображение ваших объявлений
• Связь с вами
• Улучшение наших услуг
• Обеспечение безопасности
• Соблюдение правовых требований

Ваша информация никогда не продается и не сдается в аренду в коммерческих целях.`,
        },
        {
          title: "3. Обмен информацией",
          icon: <Shield className="h-5 w-5" />,
          content: `Мы не делимся вашей личной информацией с третьими лицами, за исключением случаев:

• Когда это требуется по закону
• При угрозе безопасности
• С вашего явного согласия
• С поставщиками услуг (в ограниченной форме)

Информация о ваших объявлениях видна другим пользователям на сайте, но ваша контактная информация показывается только заинтересованным покупателям.`,
        },
        {
          title: "4. Куки",
          icon: <Cookie className="h-5 w-5" />,
          content: `Мы используем куки на нашем сайте:

• Основные куки: Важны для функционирования сай��а
• Аналитические куки: Для измерения производительности сайта
• Функциональные куки: Для улучшения пользовательского опыта
• Рекламные куки: Для показа релевантной рекламы

Вы можете управлять куки в настройках браузера.`,
        },
        {
          title: "5. Безопасность данных",
          icon: <Lock className="h-5 w-5" />,
          content: `Безопасность ваших данных - наш приоритет:

• Мы используем SSL-шифрование
• Данные хранятся на защищенных серверах
• Мы проводим регулярные проверки безопасности
• Мы применяем ограниченные права доступа
• Пароли защищены алгоритмом хеширования

Однако невозможно гарантировать 100% безопасность в интернете.`,
        },
        {
          title: "6. Ваши права",
          icon: <Shield className="h-5 w-5" />,
          content: `В соответствии с GDPR и местными законами, ваши права:

• Право доступа к вашим данным
• Право исправления данных
• Право удаления данных ("право быть забытым")
• Право ограничения обработки
• Право переносимости данных
• Право возражения

Свяжитесь с нами для реализации этих прав.`,
        },
        {
          title: "7. Конфиденциальность детей",
          icon: <Shield className="h-5 w-5" />,
          content: `Мы не собираем информацию от детей младше 13 лет:

• Существует возрастное ограничение
• Требуется согласие родителей
• Данные детей удаляются при обнаружении
• Родители могут связаться с нами

Безопасность детей важна для нас.`,
        },
        {
          title: "8. Международная передача",
          icon: <Database className="h-5 w-5" />,
          content: `Ваши данные хранятся на территории Азербайджана:

• Используются локальные серверы
• Международная передача ограничена
• При необходимости применяются соответствующие меры защиты
• Обеспечивается соответствие стандартам ЕС`,
        },
        {
          title: "9. Изменения политики",
          icon: <Calendar className="h-5 w-5" />,
          content: `Эта политика конфиденциальности может быть изменена:

• Изменения объявляются на сайте
• Отправляется уведомление по электронной почте
• Новая политика вступает в силу немедленно
• Старые версии архивируются`,
        },
      ],
    },
  }

  const pageContent = content[language]

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
                className={`animate-fadeInUp border-0 bg-white/90 backdrop-blur-sm hover-lift`}
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
