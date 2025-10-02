"use client"
import React, { useEffect, useMemo, useState, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Upload, Car, User, X, Plus, Camera, ImageIcon, Search } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { useLanguage } from "@/hooks/use-language"
import { getTranslation } from "@/lib/i18n"
import { apiClient } from "@/lib/api-client"
import { useAuth } from "@/lib/auth-context"

type UserType = {
  id: number
  firstName?: string
  lastName?: string
  email?: string
  phoneNumber?: string
  role?: string
  createdAt?: string
}

type ImageItem = {
  id: string;
  url: string;
  name: string;
  file: File
}

const VirtualScrollFeatures = ({
  features,
  selectedFeatures,
  onFeatureChange,
  language
}: {
  features: string[]
  selectedFeatures: string[]
  onFeatureChange: (feature: string, checked: boolean) => void
  language: string
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 40 })
  const [searchTerm, setSearchTerm] = useState("")

  const itemHeight = 50
  const itemWidth = 200
  const columns = 4

  const filteredFeatures = useMemo(() => {
    if (!searchTerm) return features
    return features.filter(feature =>
      feature.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [features, searchTerm])

  const totalRows = Math.ceil(filteredFeatures.length / columns)

  const updateVisibleRange = useCallback(() => {
    if (!containerRef.current) return
    const scrollTop = containerRef.current.scrollTop
    const containerHeight = containerRef.current.clientHeight || 0

    const startRow = Math.floor(scrollTop / itemHeight)
    const visibleRows = Math.ceil(containerHeight / itemHeight)
    const buffer = 4

    const newStart = Math.max(0, startRow * columns - buffer * columns)
    const newEnd = Math.min(
      filteredFeatures.length,
      (startRow + visibleRows + buffer) * columns
    )

    setVisibleRange({ start: newStart, end: newEnd })
  }, [filteredFeatures.length])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    updateVisibleRange()
    el.addEventListener("scroll", updateVisibleRange)
    const ro = new ResizeObserver(updateVisibleRange)
    ro.observe(el)
    return () => {
      el.removeEventListener("scroll", updateVisibleRange)
      ro.disconnect()
    }
  }, [updateVisibleRange])

  const visibleFeatures = filteredFeatures.slice(visibleRange.start, visibleRange.end)

  return (
    <div className="space-y-4">
      <Input
        placeholder={language === "az" ? "Xüsusiyyət axtar..." : "Search features..."}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div
        ref={containerRef}
        className="border rounded-lg overflow-auto bg-gray-50"
        style={{ height: "400px", position: "relative" }}
      >
        <div
          style={{
            height: `${totalRows * itemHeight}px`,
            width: `${columns * itemWidth}px`,
            position: "relative",
          }}
        >
          {visibleFeatures.map((feature, i) => {
            const idx = visibleRange.start + i
            const row = Math.floor(idx / columns)
            const col = idx % columns

            return (
              <div
                key={feature + "-" + idx}
                className="flex items-center space-x-2 p-2 hover:bg-white rounded-lg transition-colors absolute"
                style={{
                  top: `${row * itemHeight}px`,
                  left: `${col * itemWidth}px`,
                  width: `${itemWidth}px`,
                  height: `${itemHeight}px`,
                  boxSizing: "border-box",
                }}
              >
                <Checkbox
                  id={`feature-${idx}`}
                  checked={selectedFeatures.includes(feature)}
                  onCheckedChange={(checked) =>
                    onFeatureChange(feature, checked as boolean)
                  }
                />
                <Label
                  htmlFor={`feature-${idx}`}
                  className="text-sm flex-1 cursor-pointer select-none"
                >
                  {feature}
                </Label>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}



export default function SellPage() {
  const { language } = useLanguage()
  const t = (key: string) => getTranslation(language, key)
  const router = useRouter()
  const { logout } = useAuth()

  const [profileData, setProfileData] = useState<UserType | null>(null)
  const [loadingProfile, setLoadingProfile] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await apiClient.getCurrentUser()
        setProfileData(data)
      } catch {
        logout()
      } finally {
        setLoadingProfile(false)
      }
    }
    fetchUser()
  }, [logout])

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
    ban: "",
    location: "",
    engine: "",
    gearbox: "",
    description: "",
    features: [] as string[],
    name: "",
    phone: "",
    email: "",
    userId: profileData?.id ?? null,
    status: "Standart"
  })

  useEffect(() => {
    if (profileData) {
      setFormData(prev => ({
        ...prev,
        userId: profileData.id,
        name: `${profileData.firstName || ''} ${profileData.lastName || ''}`.trim(),
        email: profileData.email || '',
        phone: profileData.phoneNumber || ''
      }))
    }
  }, [profileData])

  const [images, setImages] = useState<ImageItem[]>([])

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken")
    if (!accessToken) router.push("/auth/login")
  }, [router])

  const brandModelMap: Record<string, string[]> = useMemo(
    () => ({
      "Toyota": ["Corolla", "Camry", "Prius", "RAV4", "Highlander", "Land Cruiser", "Hilux", "Yaris", "C-HR", "Supra", "Avalon", "Sienna"],
      "Lexus": ["IS", "ES", "GS", "LS", "NX", "RX", "LX", "UX", "LC", "RC"],
      "Honda": ["Civic", "Accord", "CR-V", "HR-V", "Pilot", "Fit/Jazz", "City", "Insight", "Odyssey", "Ridgeline"],
      "Acura": ["Integra", "TLX", "RLX", "RDX", "MDX", "NSX"],
      "Nissan": ["Micra", "Sentra", "Altima", "Maxima", "Leaf", "Qashqai", "X-Trail", "Patrol", "Navara", "GT-R", "Note"],
      "Infiniti": ["Q50", "Q60", "Q70", "QX50", "QX60", "QX80"],
      "Mazda": ["Mazda2", "Mazda3", "Mazda6", "CX-3", "CX-30", "CX-5", "CX-9", "MX-5"],
      "Subaru": ["Impreza", "Legacy", "Forester", "Outback", "XV", "BRZ"],
      "Mitsubishi": ["Lancer", "Outlander", "ASX", "Pajero", "Eclipse Cross", "Mirage"],
      "Suzuki": ["Swift", "Baleno", "Vitara", "Jimny", "SX4", "Celerio"],
      "Daihatsu": ["Charade", "Terios", "Sirion", "Move", "Rocky"],
      "Isuzu": ["D-Max", "MU-X", "N-Series Trucks"],
      "Hino": ["Dutro", "Ranger", "Profia"],
      "Ford": ["Fiesta", "Focus", "Mondeo", "Mustang", "F-150", "Ranger", "Explorer", "Edge", "EcoSport", "Transit", "Bronco"],
      "Lincoln": ["Navigator", "Aviator", "Corsair", "Continental", "MKZ"],
      "Chevrolet": ["Spark", "Aveo", "Cruze", "Malibu", "Camaro", "Impala", "Equinox", "Tahoe", "Suburban", "Silverado"],
      "GMC": ["Sierra", "Yukon", "Terrain", "Acadia", "Canyon"],
      "Cadillac": ["CT4", "CT5", "XT4", "XT5", "Escalade"],
      "Chrysler": ["300", "Pacifica", "Voyager"],
      "Dodge": ["Charger", "Challenger", "Durango", "Journey", "Caravan"],
      "Jeep": ["Renegade", "Compass", "Cherokee", "Grand Cherokee", "Wrangler", "Gladiator"],
      "Tesla": ["Model S", "Model 3", "Model X", "Model Y", "Cybertruck"],
      "Volkswagen": ["Polo", "Golf", "Passat", "Jetta", "Tiguan", "Touareg", "T-Roc", "ID.3", "ID.4"],
      "Audi": ["A1", "A3", "A4", "A6", "A8", "Q2", "Q3", "Q5", "Q7", "e-tron", "RS3", "RS6"],
      "BMW": ["1 Series", "2 Series", "3 Series", "4 Series", "5 Series", "7 Series", "X1", "X3", "X5", "X6", "i3", "i4", "M3", "M5"],
      "Mercedes-Benz": ["A-Class", "C-Class", "E-Class", "S-Class", "CLA", "GLA", "GLC", "GLE", "GLS", "AMG GT", "EQE", "EQC"],
      "Porsche": ["911", "Boxster", "Cayman", "Cayenne", "Macan", "Panamera", "Taycan"],
      "Ferrari": ["Portofino", "Roma", "F8 Tributo", "488", "SF90 Stradale", "812 Superfast"],
      "Lamborghini": ["Huracán", "Aventador", "Urus"],
      "Maserati": ["Ghibli", "Quattroporte", "Levante", "MC20"],
      "Alfa Romeo": ["Giulia", "Stelvio", "4C", "Giulietta"],
      "Fiat": ["500", "Panda", "Tipo", "500X", "Punto"],
      "Renault": ["Clio", "Megane", "Captur", "Kadjar", "Scenic", "Talisman", "Duster"],
      "Dacia": ["Sandero", "Logan", "Duster", "Lodgy"],
      "Peugeot": ["108", "208", "308", "2008", "3008", "5008"],
      "Citroën": ["C1", "C3", "C4", "C5 Aircross", "Berlingo"],
      "Opel": ["Corsa", "Astra", "Insignia", "Mokka", "Crossland"],
      "Skoda": ["Fabia", "Octavia", "Rapid", "Superb", "Kodiaq", "Karoq"],
      "Seat": ["Ibiza", "Leon", "Ateca", "Arona"],
      "Volvo": ["V40", "S60", "S90", "V60", "V90", "XC40", "XC60", "XC90"],
      "Jaguar": ["XE", "XF", "XJ", "F-Pace", "E-Pace", "I-Pace"],
      "Land Rover": ["Defender", "Discovery", "Discovery Sport", "Range Rover Evoque", "Range Rover Sport", "Range Rover"],
      "Bentley": ["Continental GT", "Flying Spur", "Bentayga"],
      "Rolls-Royce": ["Phantom", "Ghost", "Wraith", "Cullinan"],
      "Aston Martin": ["Vantage", "DB11", "DBS Superleggera", "DBX", "Rapide"],
      "McLaren": ["570S", "600LT", "720S", "GT", "P1"],
      "Lotus": ["Elise", "Exige", "Evora", "Emira"],
      "Koenigsegg": ["Jesko", "Agera", "Regera", "Gemera"],
      "Bugatti": ["Veyron", "Chiron", "Divo"],
      "Rimac": ["C_Two", "Nevera"],
      "Polestar": ["Polestar 1", "Polestar 2"],
      "MG": ["3", "5", "6", "ZS", "HS", "EHS"],
      "Mini": ["Cooper", "Clubman", "Countryman", "Electric"],
      "Tata": ["Nano", "Tiago", "Tigor", "Bolt", "Harrier", "Safari", "Punch"],
      "Mahindra": ["Thar", "XUV300", "XUV700", "Scorpio", "Bolero"],
      "Maruti Suzuki": ["Alto", "Swift", "Baleno", "Dzire", "Ertiga", "Vitara Brezza"],
      "Proton": ["Saga", "Persona", "X50", "X70"],
      "Perodua": ["Myvi", "Axia", "Bezza", "Alza", "Aruz"],
      "Great Wall": ["Haval H6", "H2", "H9", "Ora Good Cat"],
      "Geely": ["Emgrand", "Atlas", "Coolray", "Geometry A"],
      "BYD": ["F3", "Han", "Tang", "Song", "Atto 3", "Seal", "Yuan"],
      "NIO": ["ES8", "ES6", "EC6", "ET7"],
      "XPeng": ["P7", "G3", "P5", "G6"],
      "Li Auto": ["Lixiang One", "L9", "L8"],
      "Chery": ["Tiggo 2", "Tiggo 4", "Tiggo 7", "Arrizo 5"],
      "SAIC": ["MG ZS", "MG HS", "Roewe i6"],
      "FAW": ["Besturn", "Hongqi"],
      "Dongfeng": ["Fengon", "Fengshen"],
      "BAIC": ["BJ40", "X55"],
      "Troller": ["T4"],
      "UAZ": ["Hunter", "Patriot", "Pickup"],
      "ZAZ": ["Sens", "Forza", "Vida"],
      "Rivian": ["R1T", "R1S"],
      "Lucid": ["Air"],
      "Alpine": ["A110"],
      "Dodge (US)": ["Charger", "Challenger", "Durango"],
      "Ram": ["1500", "2500", "3500"],
      "Seat/Cupra": ["Formentor", "Leon Cupra"],
      "Other / Regional": ["Various regional models"]
    }),
    []
  )

  const brands = useMemo(() => Object.keys(brandModelMap).sort((a, b) => a.localeCompare(b)), [brandModelMap])

  const modelsForSelectedBrand = useMemo(() => {
    if (!formData.brand) return []
    return brandModelMap[formData.brand] ?? []
  }, [formData.brand, brandModelMap])

  const years = Array.from({ length: 60 }, (_, i) => new Date().getFullYear() - i)

  const fuels = ["Benzin", "Dizel", "Hibrid", "Plug-in Hibrid", "Elektrik", "CNG", "LPG", "Hidrogen", "Etanol", "Metanol", "Biofuel"]

  const gearboxOptions = ["Manual", "Automatic", "Dual-clutch", "eCVT", "Semi-automatic"]

  const conditions = ["Yeni", "İstifadə Olunmuş", "Sertifikatlı", "Təmir Edilmiş", "Bərpa Edilmiş", "Salvage", "Rebuild"]

  const colors = [
    "Qara", "Ağ", "Gümüşü", "Boz", "Qırmızı", "Mavi", "Yaşıl", "Sarı", "Narıncı", "Qəhvəyi", "Bej", "Qızılı", "Bənövşəyi", "Lavanda", "Çəhrayı", "Bordo", "Tünd Mavi", "Zeytun", "Göy", "Türkuaz", "Magenta", "Krem", "Şaftalı", "Tan", "Şokolad", "Bürünc", "Gül", "Nanə", "Aprikot", "Kömür Boz", "Teal", "Indigo", "Smaragd", "Safir", "Rubin", "Amber", "Qum", "Pas", "Jad", "Alabaster", "Opal", "Qrafit"
  ]

  const bodyTypes = [
    "Sedan", "Hatchback", "SUV", "Crossover", "Coupe", "Convertible", "Van", "Minivan", "Pickup", "Wagon", "City car", "Microcar", "Roadster", "Targa", "Shooting Brake", "Fastback", "Liftback", "Panel Van", "Box Truck", "Crew Cab", "Extended Cab"
  ]

  const engineOptions = [
    "0.6L", "0.8L", "1.0L", "1.2L", "1.3L", "1.4L", "1.5L", "1.6L", "1.8L", "2.0L", "2.2L", "2.4L", "2.5L", "3.0L", "3.5L", "4.0L", "4.4L", "5.0L", "6.0L", "Electric (kW)", "Hybrid (mild)", "Plug-in Hybrid", "Rotary", "Diesel Turbo", "Bi-Turbo", "Twin-Turbo"
  ]

  const cities = [
    "Bakı", "Gəncə", "Sumqayıt", "Mingəçevir", "Lənkəran", "Şəki", "Quba", "Naxçıvan", "Yevlax", "Tovuz", "Naftalan", "Qəbələ", "Salyan", "Biləsuvar", "Masallı", "Şamaxı", "Saatlı", "Bərdə", "Füzuli", "Cəlilabad", "Qazax", "Sabirabad", "Zaqatala", "Ağsu", "Oğuz", "Tərtər"
  ]

  const features = useMemo(() => [
    "ABS", "EBD (Elektron əyləc paylanması)", "ESP/ESC", "Traction Control", "Airbags (Ön)", "Airbags (Yan)", "Curtain Airbags", "Kolliziya xəbərdarlığı", "Avtomatik təcili əyləc (AEB)", "Təkər təzyiqi monitorinqi (TPMS)", "Dəyişən yol köməyi (Hill Descent Control)", "Yüksək yamacda enmə köməyi", "Ölü nöqtə monitorinqi (BSM)", "Zolaq kömək sistemi (Lane Assist)", "Zolaq saxlama yardımçısı", "Tire Pressure Monitor", "Adaptive Headlights", "Night Vision", "Roll-over Protection", "Pedestrian Detection", "Driver Attention Alert", "Blind Spot Intervention", "Rear Cross Traffic Alert", "Tyre Pressure Warning", "ISO-FIX Child Anchors", "Lane Keep Assist", "Traffic Sign Recognition", "Kondisioner (Manuel)", "Avtomatik İqlim Nəzarəti (Dual-Zone)", "Avtomatik İqlim (Tri-Zone)", "Heated Seats (İsitməli oturacaqlar)", "Ventilated Seats (Sərinlənən oturacaqlar)", "Massaging Seats", "Memory Seats", "Leather Upholstery (Dəri salon)", "Fabric Upholstery", "Alcantara Trim", "Heated Steering Wheel", "Ventilated Steering Wheel", "Power Seats", "Electric Lumbar Support", "Rear Seat Recline", "Rear Armrest", "Rear Climate Control", "Sunroof", "Panoramic Sunroof", "Power Sunshade", "Ambient Lighting", "Wireless Phone Charger", "Cup Holders", "Center Console Storage", "Adjustable Steering Column", "Keyless Entry", "Push Button Start", "Remote Start", "Hands-free Tailgate", "Power Tailgate", "Soft-close Doors", "Noise Insulation Package", "Cabin Air Purifier", "Touchscreen Display", "Apple CarPlay", "Android Auto", "Built-in Navigation", "Satellite Navigation", "Bluetooth", "In-car WiFi", "Adaptive Sound System", "Premium Sound System (Bose/ Harman/ Bang & Olufsen)", "Multiple USB Ports", "12V Socket", "HD Radio", "DAB+", "Voice Recognition", "OTA Updates", "Telematics Service", "Connected Car Services", "Driver Profiles", "Over-the-air Maps", "In-car Apps", "Rear Entertainment System", "Head-up Display (HUD)", "Instrument Cluster LCD", "Gesture Control", "Wireless Mirroring", "Rear Camera", "Front Camera", "360 Degree Camera", "Parking Sensors (Front)", "Parking Sensors (Rear)", "Autonomous Parking", "Rear View Mirror Camera", "Top-view Camera", "Park Assist", "Trailer Assist", "Bird's Eye View", "Rear Cross Traffic Braking", "LED Headlights", "Xenon Headlights", "Matrix LED", "Adaptive LED Headlights", "Daytime Running Lights (DRL)", "Automatic Headlights", "Cornering Lights", "Fog Lights", "LED Tail Lights", "Roof Rails", "Panoramic Roof", "Power Folding Mirrors", "Heated Mirrors", "Auto-dimming Mirrors", "Rain-sensing Wipers", "Electric Windows", "Privacy Glass", "Tinted Glass", "Sunshade", "Spoiler", "Diffuser", "Sport Mode", "Eco Mode", "Adaptive Suspension", "Air Suspension", "Magnetic Ride Control", "Limited Slip Differential", "Active Aero", "Launch Control", "Torque Vectoring", "Four Wheel Drive", "All Wheel Drive", "Rear Wheel Drive", "Front Wheel Drive", "Adjustable Ride Height", "Performance Brakes", "Brembo Brakes", "Ceramic Brakes", "Regenerative Braking", "Start/Stop System", "Alloy Wheels", "Run-flat Tires", "TPMS", "Tire Repair Kit", "Wheel Size 15\"", "Wheel Size 16\"", "Wheel Size 17\"", "Wheel Size 18\"", "Wheel Size 19\"", "Wheel Size 20\"", "Wheel Size 21\"", "Snow Tires Included", "Off-road Tires", "Sport Tires", "Spare Wheel", "Roof Box Compatible", "Tow Hitch", "Tow Package", "Fold-flat Rear Seats", "Underfloor Storage", "Hands-free Liftgate", "Remote Trunk Release", "Adjustable Cargo Floor", "Cargo Net", "Roof Rails", "Bike Rack Prep", "Trailer Hitch", "Dual-zone Climate", "Tri-zone Climate", "Cabin Pre-heater", "Eco Driving Indicator", "Start-Stop System", "Low Emissions", "Euro 6 Compliant", "ULEZ Compliant", "AdBlue System", "Particulate Filter", "CO2 Low Emission", "Adaptive Cruise Control", "Full-Speed Adaptive Cruise", "Traffic Jam Assist", "Highway Assist", "Autonomous Emergency Steering", "Automatic Lane Change", "Hands-free Driving Mode", "Driver Monitoring", "Child Seat Recognition", "Rear Occupant Alert", "Floor Mats (All-weather)", "Cargo Cover", "Illuminated Sill Plates", "Ambient Lighting Customizable", "Wood Trim", "Carbon Fiber Trim", "Aluminum Pedals", "Sport Steering Wheel", "Heated Rear Seats", "Ventilated Rear Seats", "Refrigerated Glovebox", "Alarm System", "Immobilizer", "GPS Tracking", "Wheel Locking Bolts", "PIN to Drive", "Remote Vehicle Disable", "Keyless-Go", "Valet Mode", "Anti-theft Wheel Locks", "Central Locking", "Hill Start Assist", "Hill Descent Control", "Skid Plates", "Off-road Mode", "4x4 Low Range", "Tow Package with Wiring", "Trailer Sway Control", "Rear Differential Lock", "Roof Racks", "Underbody Protection", "Winter Package", "Summer Package", "Sport Package", "Technology Package", "Luxury Package", "Cold Climate Package", "Premium Paint", "Extended Warranty", "Service Plan Included", "Dealer Installed Options", "Owner's Manual in English/AZ", "First Aid Kit", "Fire Extinguisher", "Roadside Assistance Included"
  ].sort((a, b) => a.localeCompare(b)), [])

  const handleFeatureChange = useCallback((feature: string, checked: boolean) => {
    setFormData((prev) => {
      const s = new Set(prev.features)
      if (checked) s.add(feature)
      else s.delete(feature)
      return { ...prev, features: Array.from(s) }
    })
  }, [])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const remainingSlots = 10 - images.length
    if (remainingSlots <= 0) return

    const filesToAdd = Array.from(files).slice(0, remainingSlots)
    const newImages = filesToAdd.map((file, i) => ({
      id: `${Date.now()}-${i}`,
      url: URL.createObjectURL(file),
      name: file.name,
      file
    }))
    setImages((prev) => [...prev, ...newImages])
  }

  const removeImage = (id: string) => setImages((prev) => prev.filter((img) => img.id !== id))

  const moveImage = (from: number, to: number) => {
    setImages((prev) => {
      const arr = [...prev]
      const [moved] = arr.splice(from, 1)
      arr.splice(to, 0, moved)
      return arr
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.brand || !formData.model || !formData.year || !formData.price || !formData.mileage) {
      alert(language === "az" ? "Zəhmət olmasa əsas sahələri doldurun." : "Please fill required fields.")
      return
    }

    try {
      const payload = {
        brand: formData.brand || null,
        model: formData.model || null,
        year: Number(formData.year),
        price: Number(formData.price),
        mileage: Number(formData.mileage),
        fuel: formData.fuel || null,
        condition: formData.condition || null,
        color: formData.color || null,
        ban: formData.ban || null,
        location: formData.location || null,
        engine: formData.engine || null,
        gearbox: formData.gearbox || null,
        description: formData.description || null,
        features: formData.features || [],
        name: formData.name || null,
        phone: formData.phone || null,
        email: formData.email || null,
        userId: formData.userId,
      }

      const userCar = await apiClient.addcardata(payload)
      const userCarId = userCar?.newUserCar?.id ?? userCar?.id ?? null

      if (!userCarId) throw new Error("UserCar ID is missing from API response")

      if (images.length > 0) {
        const fd = new FormData()
        images.forEach((img) => fd.append("images", img.file))
        fd.append("userCarId", String(userCarId))
        await apiClient.addcarimagedata(fd)
      }

      alert(language === "az" ? "Avtomobil uğurla əlavə edildi!" : "Car added successfully!")
      router.push("/my-cars")
    } catch (err: any) {
      console.error(err)
      alert(err?.message || (language === "az" ? "Xəta baş verdi" : "Something went wrong"))
    }
  }

  const content = useMemo(() => ({
    az: {
      title: "Avtomobil Satışı",
      subtitle: "Avtomobilinizi sürətlə və asanlıqla satın",
      carInfo: "Avtomobil Məlumatları",
      features: "Xüsusiyyətlər",
      images: "Şəkillər",
      imagesDesc: "Maksimum 10 şəkil əlavə edə bilərsiniz",
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
      engine: "Mühərrik",
      ban: "Karoseriya növü",
      gearbox: "Sürətlər qutusu",
      location: "Yer / Region"
    },
    en: {
      title: "Sell Your Car",
      subtitle: "Sell your car quickly and easily",
      carInfo: "Car Information",
      features: "Features",
      images: "Images",
      imagesDesc: "You can add up to 10 images",
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
      engine: "Engine",
      ban: "Body type",
      gearbox: "Gearbox",
      location: "Location / Region"
    }
  }), [language])

  const pageContent = content[language as "az" | "en"] ?? content.en

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
                  <Label htmlFor="brand">
                    {t("brand") || (language === "az" ? "Marka" : "Brand")}
                  </Label>
                  <Select
                    value={formData.brand}
                    required
                    onValueChange={(val) => setFormData((p) => ({ ...p, brand: val, model: "" }))}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={t("selectBrand") || (language === "az" ? "Marka seçin" : "Select brand")}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {brands.map((b) => (
                        <SelectItem key={b} value={b}>
                          {b}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="model">
                    {t("model") || (language === "az" ? "Model" : "Model")}
                  </Label>
                  {modelsForSelectedBrand.length > 0 ? (
                    <Select
                      value={formData.model}
                      required
                      onValueChange={(v) => setFormData((p) => ({ ...p, model: v }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={language === "az" ? "Model seçin" : "Select model"} />
                      </SelectTrigger>
                      <SelectContent>
                        {modelsForSelectedBrand.map((m) => (
                          <SelectItem key={m} value={m}>
                            {m}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      id="model"
                      required
                      value={formData.model}
                      onChange={(e) => setFormData((p) => ({ ...p, model: e.target.value }))}
                      placeholder={language === "az" ? "Model daxil edin" : "Enter model"}
                    />
                  )}
                </div>

                <div>
                  <Label htmlFor="year">
                    {t("year") || (language === "az" ? "İl" : "Year")}
                  </Label>
                  <Select
                    value={formData.year}
                    onValueChange={(v) => setFormData((p) => ({ ...p, year: v }))}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={t("selectYear") || (language === "az" ? "İl seçin" : "Select year")}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((yr) => (
                        <SelectItem key={yr} value={String(yr)}>
                          {yr}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="price">
                    {language === "az" ? "Qiymət (AZN)" : "Price (AZN)"}
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    required
                    min={0}
                    value={formData.price}
                    onChange={(e) => setFormData((p) => ({ ...p, price: e.target.value }))}
                    placeholder="50000"
                  />
                </div>

                <div>
                  <Label htmlFor="mileage">
                    {language === "az" ? "Yürüş (km)" : "Mileage (km)"}
                  </Label>
                  <Input
                    id="mileage"
                    required
                    min={0}
                    type="number"
                    value={formData.mileage}
                    onChange={(e) => setFormData((p) => ({ ...p, mileage: e.target.value }))}
                    placeholder="50000"
                  />
                </div>

                <div>
                  <Label htmlFor="fuel">
                    {t("fuel") || (language === "az" ? "Yanacaq" : "Fuel")}
                  </Label>
                  <Select
                    value={formData.fuel}
                    onValueChange={(v) => setFormData((p) => ({ ...p, fuel: v }))}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={t("selectFuel") || (language === "az" ? "Yanacaq seçin" : "Select fuel")}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {fuels.map((f) => (
                        <SelectItem key={f} value={f}>
                          {f}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="condition">
                    {t("condition") || (language === "az" ? "Vəziyyət" : "Condition")}
                  </Label>
                  <Select
                    value={formData.condition}
                    onValueChange={(v) => setFormData((p) => ({ ...p, condition: v }))}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={t("selectCondition") || (language === "az" ? "Vəziyyət seçin" : "Select condition")}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {conditions.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="color">
                    {t("color") || (language === "az" ? "Rəng" : "Color")}
                  </Label>
                  <Select
                    value={formData.color}
                    onValueChange={(v) => setFormData((p) => ({ ...p, color: v }))}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={t("selectColor") || (language === "az" ? "Rəng seçin" : "Select color")}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {colors.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="ban">{pageContent.ban}</Label>
                  <Select
                    value={formData.ban}
                    onValueChange={(v) => setFormData((p) => ({ ...p, ban: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={language === "az" ? "Karoseriya növü seçin" : "Select body type"}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {bodyTypes.map((b) => (
                        <SelectItem key={b} value={b}>
                          {b}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="engine">{pageContent.engine}</Label>
                  <Select
                    value={formData.engine}
                    onValueChange={(v) => setFormData((p) => ({ ...p, engine: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={language === "az" ? "Mühərrik seçin" : "Select engine"}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {engineOptions.map((eng) => (
                        <SelectItem key={eng} value={eng}>
                          {eng}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="gearbox">{pageContent.gearbox}</Label>
                  <Select
                    value={formData.gearbox}
                    onValueChange={(v) => setFormData((p) => ({ ...p, gearbox: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={language === "az" ? "Qutu seçin" : "Select gearbox"}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {gearboxOptions.map((g) => (
                        <SelectItem key={g} value={g}>
                          {g}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="city">
                    {t("city") || (language === "az" ? "Şəhər" : "City")}
                  </Label>
                  <Select
                    value={formData.location}
                    onValueChange={(v) => setFormData((p) => ({ ...p, location: v }))}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={t("selectCity") || (language === "az" ? "Şəhər seçin" : "Select city")}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
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
                <VirtualScrollFeatures
                  features={features}
                  selectedFeatures={formData.features}
                  onFeatureChange={handleFeatureChange}
                  language={language}
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
                      required={images.length === 0}
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                      disabled={images.length >= 10}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="bg-transparent"
                      onClick={() => document.getElementById("image-upload")?.click()}
                      disabled={images.length >= 10}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {pageContent.chooseImages}
                    </Button>
                    {images.length >= 10 && (
                      <p className="text-sm text-orange-600 mt-2">
                        {language === "az"
                          ? "Maksimum 10 şəkil əlavə edə bilərsiniz"
                          : "You can add maximum 10 images"}
                      </p>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <ImageIcon className="h-5 w-5 text-gray-600" />
                      <h3 className="text-lg font-semibold text-gray-800">
                        {pageContent.uploadedImages}
                      </h3>
                      <Badge variant="outline" className="ml-auto">
                        {images.length}/10
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
                                {index + 1}/10
                              </div>
                            </div>
                            <div className="p-3">
                              <p className="text-sm font-medium text-gray-800 truncate">
                                {image.name}
                              </p>
                              <div className="flex items-center justify-between mt-2">
                                <p className="text-xs text-gray-500">
                                  {index === 0
                                    ? language === "az"
                                      ? "Əsas şəkil"
                                      : "Main image"
                                    : `${language === "az" ? "Şəkil" : "Image"} ${index + 1}`}
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
                    {language === "az" ? "Ad Soyad" : "Full Name"}
                  </Label>
                  <Input
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                    placeholder={language === "az" ? "Adınızı daxil edin" : "Enter your name"}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">
                    {language === "az" ? "Telefon" : "Phone"}
                  </Label>
                  <Input
                    id="phone"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                    placeholder="+994 XX XXX XX XX"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="email">
                    {language === "az" ? "E-poçt" : "Email"}
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                    placeholder="example@email.com"
                  />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>{language === "az" ? "Təsvir" : "Description"}</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  className="resize-none h-[200px]"
                  value={formData.description}
                  onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                  placeholder={
                    language === "az"
                      ? "Avtomobil haqqında ətraflı məlumat..."
                      : "Detailed information about the car..."
                  }
                  rows={4}
                />
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