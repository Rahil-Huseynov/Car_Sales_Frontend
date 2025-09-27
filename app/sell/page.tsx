"use client"

import { Badge } from "@/components/ui/badge"
import type React from "react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Upload, Car, User, X, Plus, Camera, ImageIcon } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { useLanguage } from "@/hooks/use-language"
import { getTranslation } from "@/lib/i18n"
import Image from "next/image"
import { useRouter } from "next/navigation"
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

export default function SellPage() {
  const { language } = useLanguage()
  const [profileData, setProfileData] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const { logout } = useAuth()

  const t = (key: string) => getTranslation(language, key)
  const router = useRouter()
  useEffect(() => {
    const fetchUser = async () => {
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

  useEffect(() => {
    if (profileData) {
      setFormData((prev) => ({
        ...prev,
        userId: profileData.id
      }))
    }
  }, [profileData])


  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    year: "",
    price: "",
    mileage: "",
    fuel: "",
    transmission: "",
    condition: "",
    color: "",
    city: "",
    description: "",
    features: [] as string[],
    name: "",
    phone: "",
    email: "",
    userId: profileData?.id
  })

  const [images, setImages] = useState<Array<{ id: string; url: string; name: string; file: File }>>([])

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken")
    if (!accessToken) {
      router.push("/auth/login")
    }
  }, [router])

  const brands = [
    "Toyota", "Honda", "Nissan", "Mazda", "Subaru", "Mitsubishi", "Lexus", "Acura", "Infiniti", "Daihatsu", "Hino",
    "Volkswagen", "BMW", "Mercedes-Benz", "Audi", "Porsche", "Opel", "Maybach", "Bugatti", "Smart", "MAN", "Scania",
    "Ford", "Chevrolet", "Tesla", "Chrysler", "Dodge", "Jeep", "Cadillac", "GMC", "Buick", "Lincoln", "Rivian", "Lucid Motors",
    "Hyundai", "Kia", "Genesis",
    "Renault", "Peugeot", "Citroën", "DS Automobiles",
    "Jaguar", "Land Rover", "Aston Martin", "Bentley", "Rolls-Royce", "Mini", "McLaren", "Lotus",
    "Ferrari", "Maserati", "Lamborghini", "Fiat", "Alfa Romeo", "Pagani",
    "BYD", "Geely", "NIO", "XPeng", "Li Auto", "Great Wall Motors", "SAIC Motor", "Chery", "Haval", "Dongfeng", "FAW Group", "BAIC Group", "Zotye", "BYTON", "Aiways", "WM Motor",
    "Tata Motors", "Mahindra & Mahindra", "Maruti Suzuki", "Bajaj Auto", "Royal Enfield",
    "Škoda", "Tatra", "Praga",
    "Volvo", "Scania", "Koenigsegg", "Polestar",
    "Holden", "Ford Australia", "Toyota Australia", "HSV",
    "Volkswagen do Brasil", "Fiat Automóveis", "Chevrolet Brasil", "Ford Brasil", "Troller",
    "Toyota South Africa", "Volkswagen South Africa", "BMW South Africa", "Mercedes-Benz South Africa", "Ford South Africa", "Nissan South Africa",
    "Lada", "ZAZ", "Proton", "Perodua", "Tata Nano", "Zastava", "Dacia", "Rimac", "Spyker", "Caterham"
  ];
  const years = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i)
  const fuels = [
    "Benzin", "Dizel", "Hibrid", "Elektrik", "CNG", "LPG", "Hidrogen", "Etanol", "Metanol"
  ];

  const colors = [
    "Qara", "Ağ", "Gümüşü", "Boz", "Qırmızı", "Mavi", "Yaşıl", "Sarı", "Narıncı", "Qəhvəyi",
    "Bej", "Qızılı", "Bənövşəyi", "Lavanda", "Çəhrayı", "Bordo", "Tünd Mavi", "Zeytun", "Göy",
    "Türkuaz", "Magenta", "Lavanda", "Krem", "Şaftalı", "Tan", "Şokolad", "Bürünc", "Gül", "Nanə",
    "Aprikot", "Bordo", "Kömür Boz", "Teal", "Indigo", "Rəngli Yaşıl", "Mis", "Koral", "Xaç", "Qarağac",
    "Nadir", "Safir", "Smaragd", "Rubin", "Amber", "Qırmızı-Qırmızı", "Cins", "Qum", "Pas", "Jad",
    "Alabaster", "Opal", "Qrafit", "Polad", "İncə", "Gecəyarısı", "Kül"
  ];

  const transmissions = [
    "Avtomat", "Mexaniki", "CVT", "Yarı-Avtomat", "İki Sürətli", "Tiptronik"
  ];

  const conditions = ["Yeni", "İstifadə Olunmuş", "Sertifikatlı", "Təmir Edilmiş", "Bərpa Edilmiş"];

  const cities = [
    "Bakı", "Gəncə", "Sumqayıt", "Mingəçevir", "Lənkəran", "Şirvan", "Şəki", "Quba",
    "Qusar", "Qəbələ", "Qusar", "Qəbələ", "Saatlı", "Salyan", "Şamaxı", "Şəki", "Bərdə", "Beyləqan",
    "Biləsuvar", "Cəlilabad", "Cəbrayıl", "Füzuli", "Gədəbəy", "Göyçay", "Hacıqabul",
    "Xaçmaz", "Xızı", "Xankəndi", "İmişli", "Kəlbəcər", "Kürdəmir", "Qax", "Qazax",
    "Qobustan", "Qubadlı", "Lerik", "Masallı", "Naftalan", "Naxçıvan", "Neftçala",
    "Oğuz", "Ordubad", "Saatlı", "Siyəzən", "Sumqayıt", "Tərtər", "Tovuz", "Ucar",
    "Yardımlı", "Yevlax", "Zaqatala", "Zəngilan", "Zərdab"
  ];

  const features = [
    "ABS",
    "Hava yastığı (Airbag)",
    "Kondisioner (Klimat)",
    "Dəri salon",
    "Günəş damı (Sunroof)",
    "Panoramik günəş damı",
    "Navigasiya sistemi",
    "Bluetooth",
    "USB",
    "Kamera",
    "Ön kamera",
    "Arxa kamera",
    "360° kamera",
    "Park sensoru",
    "Xenon lampalar",
    "LED lampalar",
    "Gündüz işıqları (DRL)",
    "Elektrik şüşələr",
    "Elektrik oturacaqlar",
    "İsitməli oturacaqlar",
    "Soyuduculu oturacaqlar",
    "Multimedia sistemi",
    "Sensor ekran",
    "Adaptiv kruiz nəzarət",
    "Zolaq kömək sistemi",
    "Ölü nöqtə monitorinqi",
    "Traksiya nəzarəti",
    "Tənzimlənən sükan",
    "Start/Stop sistemi",
    "Açar olmadan giriş",
    "Düymə ilə işə salma",
    "Yağış sensoru",
    "İsitməli sükan",
    "Heads-Up Display (HUD)",
    "Dam tavan relsləri",
    "Çəkmə cıvatası (Tow Hook)",
    "Siqnal sistemi",
    "Duman işıqları",
    "Alüminium disklər",
    "Elektrik güzgülər",
    "Yaddaşlı oturacaqlar",
    "Uşaq oturacağı bağlantıları (ISOFIX)",
    "Simsiz enerji doldurma",
    "Apple CarPlay",
    "Android Auto",
    "Kruiz nəzarəti",
    "Avtomatik parklama",
    "Yüksək yamacda enmə köməkçisi",
    "Yüksək yamacda başlama köməkçisi",
    "Adaptiv işıqlar",
    "Ambiyans işıqlanma",
    "Səs ilə idarəetmə",
    "Təkər təzyiqi monitorinq sistemi (TPMS)",
    "Arxa əyləncə sistemi",
    "Ventilyasiyalı oturacaqlar",
    "Masaj funksiyalı oturacaqlar",
    "İdman paketi",
    "Dam spoyleri",
    "Gizli şüşələr",
    "Avtomatik işıqlar"
  ];


  const handleFeatureChange = (feature: string, checked: boolean) => {
    if (checked) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, feature],
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        features: prev.features.filter((f) => f !== feature),
      }))
    }
  }
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newImages = Array.from(files).map((file, index) => ({
        id: `${Date.now()}-${index}`,
        url: URL.createObjectURL(file),
        name: file.name,
        file,
      }))
      setImages((prev) => [...prev, ...newImages].slice(0, 5))
    }
  }

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id))
  }

  const moveImage = (fromIndex: number, toIndex: number) => {
    setImages((prev) => {
      const newImages = [...prev]
      const [movedImage] = newImages.splice(fromIndex, 1)
      newImages.splice(toIndex, 0, movedImage)
      return newImages
    })
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const userCar = await apiClient.addcardata(formData);
      const userCarId = userCar?.newUserCar?.id;
      if (!userCarId) throw new Error('UserCar ID is missing from API response');

      if (images.length > 0) {
        const formDataObj = new FormData();
        images.forEach((img) => formDataObj.append('images', img.file));
        formDataObj.append('userCarId', userCarId.toString());
        await apiClient.addcarimagedata(formDataObj);
      }

      alert('Car added successfully!');
      router.push('/my-cars');
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Something went wrong');
    }
  };

  const content = {
    az: {
      title: "Avtomobil Satışı",
      subtitle: "Avtomobilinizi sürətlə və asanlıqla satın",
      carInfo: "Avtomobil Məlumatları",
      features: "Xüsusiyyətlər",
      images: "Şəkillər",
      imagesDesc: "Maksimum 5 şəkil əlavə edə bilərsiniz",
      uploadImages: "Şəkilləri yükləyin",
      chooseImages: "Şəkil seçin",
      contactInfo: "Əlaqə Məlumatları",
      postAd: "Elanı Yerləşdir",
      mainImage: "Əsas şəkil",
      dragDrop: "Şəkilləri buraya sürükləyin və ya seçin",
      supportedFormats: "PNG, JPG formatında maksimum 10MB",
      uploadedImages: "Yüklənmiş Şəkillər",
      noImages: "Hələ şəkil əlavə edilməyib",
      addFirstImage: "İlk şəkili əlavə edin",
    },
    en: {
      title: "Sell Your Car",
      subtitle: "Sell your car quickly and easily",
      carInfo: "Car Information",
      features: "Features",
      images: "Images",
      imagesDesc: "You can add up to 5 images",
      uploadImages: "Upload images",
      chooseImages: "Choose images",
      contactInfo: "Contact Information",
      postAd: "Post Advertisement",
      mainImage: "Main image",
      dragDrop: "Drag and drop images here or select",
      supportedFormats: "PNG, JPG format, maximum 10MB",
      uploadedImages: "Uploaded Images",
      noImages: "No images added yet",
      addFirstImage: "Add your first image",
    },
    ru: {
      title: "Продать Автомобиль",
      subtitle: "Продайте свой автомобиль быстро и легко",
      carInfo: "Информация об автомобиле",
      features: "Особенности",
      images: "Изображения",
      imagesDesc: "Вы можете добавить до 5 изображений",
      uploadImages: "Загрузить изображения",
      chooseImages: "Выбрать изображения",
      contactInfo: "Контактная информация",
      postAd: "Разместить объявление",
      mainImage: "Основное изображение",
      dragDrop: "Перетащите изображения сюда или выберите",
      supportedFormats: "Формат PNG, JPG, максимум 10MB",
      uploadedImages: "Загруженные изображения",
      noImages: "Изображения еще не добавлены",
      addFirstImage: "Добавьте первое изображение",
    },
  }

  const pageContent = content[language]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">{pageContent.title}</h1>
            <p className="text-gray-600">{pageContent.subtitle}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="h-5 w-5" />
                  {pageContent.carInfo}
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="brand">{t("brand")}</Label>
                  <Select
                    value={formData.brand}
                    required
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, brand: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("selectBrand")} />
                    </SelectTrigger>
                    <SelectContent>
                      {brands.map((brand) => (
                        <SelectItem key={brand} value={brand}>
                          {brand}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="model">{t("model")}</Label>
                  <Input
                    id="model"
                    required
                    value={formData.model}
                    onChange={(e) => setFormData((prev) => ({ ...prev, model: e.target.value }))}
                    placeholder={
                      language === "az" ? "Model daxil edin" : language === "en" ? "Enter model" : "Введите модель"
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="year">{t("year")}</Label>
                  <Select
                    value={formData.year}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, year: value }))}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("selectYear")} />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="price">
                    {language === "az" ? "Qiymət (AZN)" : language === "en" ? "Price (AZN)" : "Цена (AZN)"}
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    required
                    min={0}
                    value={formData.price}
                    onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
                    placeholder="50000"
                  />
                </div>

                <div>
                  <Label htmlFor="mileage">
                    {language === "az" ? "Yürüş (km)" : language === "en" ? "Mileage (km)" : "Пробег (км)"}
                  </Label>
                  <Input
                    id="mileage"
                    required
                    min={0}
                    type="number"
                    value={formData.mileage}
                    onChange={(e) => setFormData((prev) => ({ ...prev, mileage: e.target.value }))}
                    placeholder="50000"
                  />
                </div>

                <div>
                  <Label htmlFor="fuel">{t("fuel")}</Label>
                  <Select
                    value={formData.fuel}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, fuel: value }))}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("selectFuel")} />
                    </SelectTrigger>
                    <SelectContent>
                      {fuels.map((fuel) => (
                        <SelectItem key={fuel} value={fuel}>
                          {t(fuel)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="transmission">{t("transmission")}</Label>
                  <Select
                    value={formData.transmission}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, transmission: value }))}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("selectTransmission")} />
                    </SelectTrigger>
                    <SelectContent>
                      {transmissions.map((transmission) => (
                        <SelectItem key={transmission} value={transmission}>
                          {t(transmission)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="condition">{t("condition")}</Label>
                  <Select
                    value={formData.condition}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, condition: value }))}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("selectCondition")} />
                    </SelectTrigger>
                    <SelectContent>
                      {conditions.map((condition) => (
                        <SelectItem key={condition} value={condition}>
                          {t(condition)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="color">{t("color")}</Label>
                  <Select
                    value={formData.color}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, color: value }))}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("selectColor")} />
                    </SelectTrigger>
                    <SelectContent>
                      {colors.map((color) => (
                        <SelectItem key={color} value={color}>
                          {t(color)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="city">{t("city")}</Label>
                  <Select
                    value={formData.city}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, city: value }))}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("selectCity")} />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((city) => (
                        <SelectItem key={city} value={city}>
                          {t(city)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{pageContent.features}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {features.map((feature) => (
                    <div key={feature} className="flex items-center space-x-2">
                      <Checkbox
                        id={feature}
                        checked={formData.features.includes(feature)}
                        onCheckedChange={(checked) => handleFeatureChange(feature, checked as boolean)}
                      />
                      <Label htmlFor={feature} className="text-sm">
                        {feature}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{language === "az" ? "Təsvir" : language === "en" ? "Description" : "Описание"}</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  required
                  placeholder={
                    language === "az"
                      ? "Avtomobil haqqında ətraflı məlumat..."
                      : language === "en"
                        ? "Detailed information about the car..."
                        : "Подробная информация об автомобиле..."
                  }
                  rows={4}
                  style={{
                    resize: "none",
                    overflow: "auto",
                  }}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  {pageContent.images}
                </CardTitle>
                <p className="text-sm text-gray-600">{pageContent.imagesDesc}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                    <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 mb-2">{pageContent.dragDrop}</p>
                    <p className="text-sm text-gray-500 mb-4">{pageContent.supportedFormats}</p>
                    <input
                      required
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                      disabled={images.length >= 5}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="bg-transparent"
                      onClick={() => document.getElementById("image-upload")?.click()}
                      disabled={images.length >= 5}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {pageContent.chooseImages}
                    </Button>
                    {images.length >= 5 && (
                      <p className="text-sm text-orange-600 mt-2">
                        {language === "az"
                          ? "Maksimum 5 şəkil əlavə edə bilərsiniz"
                          : language === "en"
                            ? "You can add maximum 5 images"
                            : "Максимум 5 изображений"}
                      </p>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <ImageIcon className="h-5 w-5 text-gray-600" />
                      <h3 className="text-lg font-semibold text-gray-800">{pageContent.uploadedImages}</h3>
                      <Badge variant="outline" className="ml-auto">
                        {images.length}/5
                      </Badge>
                    </div>

                    {images.length === 0 ? (
                      <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                        <ImageIcon className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                        <p className="text-gray-500 mb-2">{pageContent.noImages}</p>
                        <p className="text-sm text-gray-400">{pageContent.addFirstImage}</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {images.map((image, index) => (
                          <div
                            key={image.id}
                            className="relative group bg-white rounded-lg border shadow-sm overflow-hidden"
                          >
                            <div className="aspect-video relative">
                              <Image
                                src={image.url || "/placeholder.svg"}
                                alt={`Car image ${index + 1}`}
                                width={300}
                                height={200}
                                className="w-full h-full object-cover"
                              />

                              <Button
                                type="button"
                                size="icon"
                                variant="destructive"
                                className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => removeImage(image.id)}
                              >
                                <X className="h-4 w-4" />
                              </Button>

                              {index === 0 && (
                                <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
                                  {pageContent.mainImage}
                                </div>
                              )}

                              <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                                {index + 1}/5
                              </div>
                            </div>

                            <div className="p-3">
                              <p className="text-sm font-medium text-gray-800 truncate">{image.name}</p>
                              <div className="flex items-center justify-between mt-2">
                                <p className="text-xs text-gray-500">
                                  {index === 0
                                    ? language === "az"
                                      ? "Əsas şəkil"
                                      : language === "en"
                                        ? "Main image"
                                        : "Основное изображение"
                                    : `${language === "az" ? "Şəkil" : language === "en" ? "Image" : "Изображение"} ${index + 1}`}
                                </p>

                                <div className="flex gap-1">
                                  {index > 0 && (
                                    <Button
                                      type="button"
                                      size="sm"
                                      variant="ghost"
                                      className="h-6 w-6 p-0"
                                      onClick={() => moveImage(index, index - 1)}
                                    >
                                      ←
                                    </Button>
                                  )}
                                  {index < images.length - 1 && (
                                    <Button
                                      type="button"
                                      size="sm"
                                      variant="ghost"
                                      className="h-6 w-6 p-0"
                                      onClick={() => moveImage(index, index + 1)}
                                    >
                                      →
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  {pageContent.contactInfo}
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">
                    {language === "az" ? "Ad Soyad" : language === "en" ? "Full Name" : "Полное имя"}
                  </Label>
                  <Input
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder={language === "az" ? "Adınızı daxil edin" : language === "en" ? "Enter your name" : "Введите ваше имя"}
                  />
                </div>

                <div>
                  <Label htmlFor="phone">
                    {language === "az" ? "Telefon" : language === "en" ? "Phone" : "Телефон"}
                  </Label>
                  <Input
                    id="phone"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                    placeholder="+994 XX XXX XX XX"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="email">
                    {language === "az" ? "E-poçt" : language === "en" ? "Email" : "Электронная почта"}
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    placeholder="example@email.com"
                  />
                </div>
              </CardContent>
            </Card>

            <div className="text-center">
              <Button
                type="submit"
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-8"
              >
                {pageContent.postAd}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}