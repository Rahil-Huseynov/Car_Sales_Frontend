"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, ArrowLeft, Calendar, User, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { useLanguage } from "@/hooks/use-language"
import { getTranslation } from "@/lib/i18n"

export default function TermsPage() {
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
          title: "1. Ümumi Müddəalar",
          content: `Euro Car platformasına xoş gəlmisiniz. Bu istifadə şərtləri sizin veb saytımızdan istifadənizi tənzimləyir. Saytdan istifadə etməklə siz bu şərtləri qəbul etmiş olursunuz.

Bu şərtlər bütün istifadəçilər üçün məcburidir və saytın bütün xidmətlərinə şamil olunur. Şərtlərlə razı deyilsinizsə, lütfən saytdan istifadə etməyin.`,
        },
        {
          title: "2. İstifadəçi Hesabları",
          content: `Saytda hesab yaratmaq üçün doğru və tam məlumat verməlisiniz. Hesabınızın təhlükəsizliyindən siz məsulsiniz.

• Şifrənizi başqaları ilə paylaşmayın
• Hesabınızda şübhəli fəaliyyət görəndə dərhal bizə məlumat verin
• Yalnız bir hesab yarada bilərsiniz
• 18 yaşından kiçik şəxslər valideyn icazəsi ilə qeydiyyatdan keçə bilər`,
        },
        {
          title: "3. Elan Yerləşdirmə Qaydaları",
          content: `Avtomobil elanı yerləşdirərkən aşağıdakı qaydaları gözləməlisiniz:

• Yalnız həqiqi məlumatlar daxil edin
• Avtomobilin real şəkillərini istifadə edin
• Qiymət və texniki məlumatlar dəqiq olmalıdır
• Qanunsuz və ya oğurlanmış avtomobillər üçün elan yerləşdirmək qadağandır
• Bir avtomobil üçün yalnız bir elan yerləşdirə bilərsiniz`,
        },
        {
          title: "4. Qadağan Edilən Fəaliyyətlər",
          content: `Aşağıdakı fəaliyyətlər qəti qadağandır:

• Saxta məlumat vermək
• Başqa istifadəçiləri aldatmaq
• Spam göndərmək
• Saytın təhlükəsizliyini pozmaq
• Müəllif hüquqlarını pozmaq
• Uyğunsuz məzmun paylaşmaq`,
        },
        {
          title: "5. Məsuliyyət",
          content: `Euro Car yalnız platforma xidməti göstərir. Alqı-satqı əməliyyatlarında vasitəçi deyil.

• Avtomobillərin keyfiyyətinə zəmanət vermirik
• İstifadəçilər arasında yaranan mübahisələrə müdaxilə etmirik
• Maliyyə itkilərinə görə məsuliyyət daşımırıq
• İstifadəçilər öz risklərində əməliyyat aparırlar`,
        },
        {
          title: "6. Ödəniş və Komissiya",
          content: `Saytdan istifadə əsasən pulsuzdur, lakin bəzi xidmətlər ödənişlidir:

• Premium elanlar üçün ödəniş tələb olunur
• Elan irəli çəkmə xidməti ödənişlidir
• Ödənişlər geri qaytarılmır
• Qiymətlər bildiriş verilmədən dəyişdirilə bilər`,
        },
        {
          title: "7. Məxfilik",
          content: `İstifadəçi məlumatlarının qorunması bizim üçün vacibdir:

• Şəxsi məlumatlarınız üçüncü tərəflərə verilmir
• Kukilərdən istifadə edirik
• Məlumatlarınız təhlükəsiz saxlanılır
• Məxfilik siyasətimizi oxuyun`,
        },
        {
          title: "8. Şərtlərin Dəyişdirilməsi",
          content: `Bu şərtlər vaxtaşırı yenilənə bilər:

• Dəyişikliklər saytda elan edilir
• Yeni şərtlər dərhal qüvvəyə minir
• Saytdan istifadə etməklə yeni şərtləri qəbul etmiş olursunuz
• Mühüm dəyişikliklər email ilə bildirilir`,
        },
        {
          title: "9. Əlaqə",
          content: `Suallarınız varsa bizimlə əlaqə saxlayın:

• Email: info@eurocar.az
• Telefon: +994 12 555 55 55
• Ünvan: Bakı şəhəri, Nizami rayonu
• İş saatları: 09:00-18:00 (Bazar ertəsi - Cümə)`,
        },
      ],
    },
    en: {
      lastUpdated: "Last updated: January 15, 2024",
      sections: [
        {
          title: "1. General Terms",
          content: `Welcome to Euro Car platform. These terms of use govern your use of our website. By using the site, you accept these terms.

These terms are mandatory for all users and apply to all site services. If you do not agree with the terms, please do not use the site.`,
        },
        {
          title: "2. User Accounts",
          content: `To create an account on the site, you must provide accurate and complete information. You are responsible for the security of your account.

• Do not share your password with others
• Report suspicious activity on your account immediately
• You can only create one account
• Persons under 18 can register with parental consent`,
        },
        {
          title: "3. Listing Rules",
          content: `When posting car listings, you must follow these rules:

• Only enter real information
• Use actual photos of the car
• Price and technical information must be accurate
• Posting illegal or stolen cars is prohibited
• You can only post one listing per car`,
        },
        {
          title: "4. Prohibited Activities",
          content: `The following activities are strictly prohibited:

• Providing false information
• Deceiving other users
• Sending spam
• Compromising site security
• Copyright infringement
• Sharing inappropriate content`,
        },
        {
          title: "5. Liability",
          content: `Euro Car only provides platform services. We are not intermediaries in buying and selling transactions.

• We do not guarantee the quality of cars
• We do not intervene in disputes between users
• We are not responsible for financial losses
• Users operate at their own risk`,
        },
        {
          title: "6. Payment and Commission",
          content: `Using the site is generally free, but some services are paid:

• Premium listings require payment
• Ad promotion service is paid
• Payments are non-refundable
• Prices may change without notice`,
        },
        {
          title: "7. Privacy",
          content: `Protecting user information is important to us:

• Your personal information is not shared with third parties
• We use cookies
• Your data is stored securely
• Read our privacy policy`,
        },
        {
          title: "8. Changes to Terms",
          content: `These terms may be updated from time to time:

• Changes are announced on the site
• New terms take effect immediately
• By using the site, you accept the new terms
• Important changes are notified by email`,
        },
        {
          title: "9. Contact",
          content: `If you have questions, contact us:

• Email: info@eurocar.az
• Phone: +994 12 555 55 55
• Address: Baku city, Nizami district
• Working hours: 09:00-18:00 (Monday - Friday)`,
        },
      ],
    },
    ru: {
      lastUpdated: "Последнее обновление: 15 января 2024",
      sections: [
        {
          title: "1. Общие положения",
          content: `Добро пожаловать на платформу Euro Car. Эти условия использования регулируют ваше использование нашего веб-сайта. Используя сайт, вы принимаете эти условия.

Эти условия являются обязательными для всех пользователей и распространяются на все услуги сайта. Если вы не согласны с условиями, пожалуйста, не используйте сайт.`,
        },
        {
          title: "2. Учетные записи пользователей",
          content: `Для создания учетной записи на сайте вы должны предоставить точную и полную информацию. Вы несете ответственность за безопасность своей учетной записи.

• Не делитесь своим паролем с другими
• Немедленно сообщайте о подозрительной активности в вашей учетной записи
• Вы можете создать только одну учетную запись
• Лица младше 18 лет могут зарегистрироваться с согласия родителей`,
        },
        {
          title: "3. Правила размещения объявлений",
          content: `При размещении объявлений об автомобилях вы должны соблюдать следующие правила:

• Вводите только реальную информацию
• Используйте настоящие фотографии автомобиля
• Цена и техническая информация должны быть точными
• Размещение незаконных или украденных автомобилей запрещено
• Вы можете разместить только одно объявление на автомобиль`,
        },
        {
          title: "4. Запрещенные действия",
          content: `Следующие действия строго запрещены:

• Предоставление ложной информации
• Обман других пользователей
• Отправка спама
• Нарушение безопасности сайта
• Нарушение авторских прав
• Размещение неподходящего контента`,
        },
        {
          title: "5. Ответственность",
          content: `Euro Car предоставляет только платформенные услуги. Мы не являемся посредниками в сделках купли-продажи.

• Мы не гарантируем качество автомобилей
• Мы не вмешиваемся в споры между пользователями
• Мы не несем ответственности за финансовые потери
• Пользователи действуют на свой риск`,
        },
        {
          title: "6. Оплата и комиссия",
          content: `Использование сайта в основном бесплатно, но некоторые услуги платные:

• Премиум объявления требуют оплаты
• Услуга продвижения объявлений платная
• Платежи не возвращаются
• Цены могут изменяться без уведомления`,
        },
        {
          title: "7. Конфиденциальность",
          content: `Защита пользовательской информации важна для нас:

• Ваша личная информация не передается третьим лицам
• Мы используем куки
• Ваши данные хранятся безопасно
• Прочитайте нашу политику конфиденциальности`,
        },
        {
          title: "8. Изменения условий",
          content: `Эти условия могут обновляться время от времени:

• Изменения объявляются на сайте
• Новые условия вступают в силу немедленно
• Используя сайт, вы принимаете новые условия
• О важных изменениях уведомляем по электронной почте`,
        },
        {
          title: "9. Контакты",
          content: `Если у вас есть вопросы, свяжитесь с нами:

• Email: info@eurocar.az
• Телефон: +994 12 555 55 55
• Адрес: г. Баку, Низаминский район
• Рабочие часы: 09:00-18:00 (Понедельник - Пятница)`,
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
      <section className="bg-gradient-to-br from-indigo-500 via-indigo-600 to-indigo-700 text-white py-12 md:py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-400/10 to-transparent"></div>
        <div className="absolute top-10 right-10 w-32 h-32 bg-indigo-400/10 rounded-full blur-xl animate-pulse-slow"></div>
        <div className="absolute bottom-10 left-10 w-24 h-24 bg-indigo-300/10 rounded-full blur-lg animate-bounce-slow"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="hero-title">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
              <FileText className="h-8 w-8 text-indigo-200" />
              {t("termsOfService")}
            </h1>
            <p className="text-indigo-100">{t("termsSubtitle")}</p>
            <div className="flex items-center gap-2 mt-4 text-indigo-200">
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
          <Card className="mb-8 border-yellow-200 bg-yellow-50 animate-fadeInUp">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-yellow-800 mb-1">{t("importantNotice")}</h4>
                  <p className="text-sm text-yellow-700">{t("termsNotice")}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="space-y-6">
            {pageContent.sections.map((section, index) => (
              <Card
                key={index}
                className={`animate-fadeInUp border-0 bg-white/90 backdrop-blur-sm hover-lift`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <CardTitle className="text-xl text-gray-800 flex items-center gap-2">
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                      <span className="text-indigo-600 font-bold text-sm">{index + 1}</span>
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

          <Card className="mt-8 bg-gradient-to-r from-indigo-50 to-blue-50 border-indigo-200 animate-fadeInUp">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-indigo-800">
                <User className="h-5 w-5" />
                {t("needHelp")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-indigo-700 mb-4">{t("contactUsForHelp")}</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild className="bg-indigo-600 hover:bg-indigo-700">
                  <Link href="/contact">{t("contactUs")}</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-indigo-200 text-indigo-600 hover:bg-indigo-50 bg-transparent"
                >
                  <Link href="/privacy">{t("privacyPolicy")}</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
