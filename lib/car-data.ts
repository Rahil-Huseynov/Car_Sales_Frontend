export const brandModelMap: Record<string, string[]> = {
  Toyota: ["Corolla", "Camry", "Prius", "RAV4", "Highlander", "Land Cruiser", "Hilux", "Yaris", "C-HR", "Supra", "Avalon", "Sienna"],
  Lexus: ["IS", "ES", "GS", "LS", "NX", "RX", "LX", "UX", "LC", "RC"],
  Honda: ["Civic", "Accord", "CR-V", "HR-V", "Pilot", "Fit/Jazz", "City", "Insight", "Odyssey", "Ridgeline"],
  Acura: ["Integra", "TLX", "RLX", "RDX", "MDX", "NSX"],
  Nissan: ["Micra", "Sentra", "Altima", "Maxima", "Leaf", "Qashqai", "X-Trail", "Patrol", "Navara", "GT-R", "Note"],
  Infiniti: ["Q50", "Q60", "Q70", "QX50", "QX60", "QX80"],
  Mazda: ["Mazda2", "Mazda3", "Mazda6", "CX-3", "CX-30", "CX-5", "CX-9", "MX-5"],
  Subaru: ["Impreza", "Legacy", "Forester", "Outback", "XV", "BRZ"],
  Mitsubishi: ["Lancer", "Outlander", "ASX", "Pajero", "Eclipse Cross", "Mirage"],
  Suzuki: ["Swift", "Baleno", "Vitara", "Jimny", "SX4", "Celerio"],
  Daihatsu: ["Charade", "Terios", "Sirion", "Move", "Rocky"],
  Isuzu: ["D-Max", "MU-X", "N-Series Trucks"],
  Hino: ["Dutro", "Ranger", "Profia"],
  Ford: ["Fiesta", "Focus", "Mondeo", "Mustang", "F-150", "Ranger", "Explorer", "Edge", "EcoSport", "Transit", "Bronco"],
  Lincoln: ["Navigator", "Aviator", "Corsair", "Continental", "MKZ"],
  Chevrolet: ["Spark", "Aveo", "Cruze", "Malibu", "Camaro", "Impala", "Equinox", "Tahoe", "Suburban", "Silverado"],
  GMC: ["Sierra", "Yukon", "Terrain", "Acadia", "Canyon"],
  Cadillac: ["CT4", "CT5", "XT4", "XT5", "Escalade"],
  Chrysler: ["300", "Pacifica", "Voyager"],
  Dodge: ["Charger", "Challenger", "Durango", "Journey", "Caravan"],
  Jeep: ["Renegade", "Compass", "Cherokee", "Grand Cherokee", "Wrangler", "Gladiator"],
  Tesla: ["Model S", "Model 3", "Model X", "Model Y", "Cybertruck"],
  Volkswagen: ["Polo", "Golf", "Passat", "Jetta", "Tiguan", "Touareg", "T-Roc", "ID.3", "ID.4"],
  Audi: ["A1", "A3", "A4", "A6", "A8", "Q2", "Q3", "Q5", "Q7", "e-tron", "RS3", "RS6"],
  BMW: ["1 Series", "2 Series", "3 Series", "4 Series", "5 Series", "7 Series", "X1", "X3", "X5", "X6", "i3", "i4", "M3", "M5"],
  "Mercedes-Benz": ["A-Class", "C-Class", "E-Class", "S-Class", "CLA", "GLA", "GLC", "GLE", "GLS", "AMG GT", "EQE", "EQC"],
  Porsche: ["911", "Boxster", "Cayman", "Cayenne", "Macan", "Panamera", "Taycan"],
  Ferrari: ["Portofino", "Roma", "F8 Tributo", "488", "SF90 Stradale", "812 Superfast"],
  Lamborghini: ["Huracán", "Aventador", "Urus"],
  Maserati: ["Ghibli", "Quattroporte", "Levante", "MC20"],
  "Alfa Romeo": ["Giulia", "Stelvio", "4C", "Giulietta"],
  Fiat: ["500", "Panda", "Tipo", "500X", "Punto"],
  Renault: ["Clio", "Megane", "Captur", "Kadjar", "Scenic", "Talisman", "Duster"],
  Dacia: ["Sandero", "Logan", "Duster", "Lodgy"],
  Peugeot: ["108", "208", "308", "2008", "3008", "5008"],
  Citroën: ["C1", "C3", "C4", "C5 Aircross", "Berlingo"],
  Opel: ["Corsa", "Astra", "Insignia", "Mokka", "Crossland"],
  Skoda: ["Fabia", "Octavia", "Rapid", "Superb", "Kodiaq", "Karoq"],
  Seat: ["Ibiza", "Leon", "Ateca", "Arona"],
  Volvo: ["V40", "S60", "S90", "V60", "V90", "XC40", "XC60", "XC90"],
  Jaguar: ["XE", "XF", "XJ", "F-Pace", "E-Pace", "I-Pace"],
  "Land Rover": ["Defender", "Discovery", "Discovery Sport", "Range Rover Evoque", "Range Rover Sport", "Range Rover"],
  Bentley: ["Continental GT", "Flying Spur", "Bentayga"],
  "Rolls-Royce": ["Phantom", "Ghost", "Wraith", "Cullinan"],
  "Aston Martin": ["Vantage", "DB11", "DBS Superleggera", "DBX", "Rapide"],
  McLaren: ["570S", "600LT", "720S", "GT", "P1"],
  Lotus: ["Elise", "Exige", "Evora", "Emira"],
  Koenigsegg: ["Jesko", "Agera", "Regera", "Gemera"],
  Bugatti: ["Veyron", "Chiron", "Divo"],
  Rimac: ["C_Two", "Nevera"],
  Polestar: ["Polestar 1", "Polestar 2"],
  MG: ["3", "5", "6", "ZS", "HS", "EHS"],
  Mini: ["Cooper", "Clubman", "Countryman", "Electric"],
  Tata: ["Nano", "Tiago", "Tigor", "Bolt", "Harrier", "Safari", "Punch"],
  Mahindra: ["Thar", "XUV300", "XUV700", "Scorpio", "Bolero"],
  "Maruti Suzuki": ["Alto", "Swift", "Baleno", "Dzire", "Ertiga", "Vitara Brezza"],
  Proton: ["Saga", "Persona", "X50", "X70"],
  Perodua: ["Myvi", "Axia", "Bezza", "Alza", "Aruz"],
  "Great Wall": ["Haval H6", "H2", "H9", "Ora Good Cat"],
  Geely: ["Emgrand", "Atlas", "Coolray", "Geometry A"],
  BYD: ["F3", "Han", "Tang", "Song", "Atto 3", "Seal", "Yuan"],
  NIO: ["ES8", "ES6", "EC6", "ET7"],
  XPeng: ["P7", "G3", "P5", "G6"],
  "Li Auto": ["Lixiang One", "L9", "L8"],
  Chery: ["Tiggo 2", "Tiggo 4", "Tiggo 7", "Arrizo 5"],
  SAIC: ["MG ZS", "MG HS", "Roewe i6"],
  FAW: ["Besturn", "Hongqi"],
  Dongfeng: ["Fengon", "Fengshen"],
  BAIC: ["BJ40", "X55"],
  Troller: ["T4"],
  UAZ: ["Hunter", "Patriot", "Pickup"],
  ZAZ: ["Sens", "Forza", "Vida"],
  Rivian: ["R1T", "R1S"],
  Lucid: ["Air"],
  Alpine: ["A110"],
  "Dodge (US)": ["Charger", "Challenger", "Durango"],
  Ram: ["1500", "2500", "3500"],
  "Seat/Cupra": ["Formentor", "Leon Cupra"],
  "Other / Regional": ["Various regional models"]
}

export const fuels = [
  "Benzin",
  "Dizel",
  "Hibrid",
  "Plug-in Hibrid",
  "Elektrik",
  "CNG",
  "LPG",
  "Hidrogen",
  "Etanol",
  "Metanol",
  "Biofuel"
]

export const gearboxOptions = [
  "Manual",
  "Automatic",
  "Dual-clutch",
  "eCVT",
  "Semi-automatic"
]

export const conditions = [
  "Yeni",
  "İstifadə Olunmuş",
  "Sertifikatlı",
  "Təmir Edilmiş",
  "Bərpa Edilmiş",
  "Salvage",
  "Rebuild"
]

export const colors = [
  "Qara", "Ağ", "Gümüşü", "Boz", "Qırmızı", "Mavi", "Yaşıl", "Sarı", "Narıncı", "Qəhvəyi", "Bej", "Qızılı", "Bənövşəyi", "Lavanda", "Çəhrayı", "Bordo", "Tünd Mavi", "Zeytun", "Göy", "Türkuaz", "Magenta", "Krem", "Şaftalı", "Tan", "Şokolad", "Bürünc", "Gül", "Nanə", "Aprikot", "Kömür Boz", "Teal", "Indigo", "Smaragd", "Safir", "Rubin", "Amber", "Qum", "Pas", "Jad", "Alabaster", "Opal", "Qrafit"
]

export const bodyTypes = [
  "Sedan", "Hatchback", "SUV", "Crossover", "Coupe", "Convertible", "Van", "Minivan", "Pickup", "Wagon", "City car", "Microcar", "Roadster", "Targa", "Shooting Brake", "Fastback", "Liftback", "Panel Van", "Box Truck", "Crew Cab", "Extended Cab"
]

export const engineOptions = [
  "0.6L", "0.8L", "1.0L", "1.2L", "1.3L", "1.4L", "1.5L", "1.6L", "1.8L", "2.0L", "2.2L", "2.4L", "2.5L", "3.0L", "3.5L", "4.0L", "4.4L", "5.0L", "6.0L", "Electric (kW)", "Hybrid (mild)", "Plug-in Hybrid", "Rotary", "Diesel Turbo", "Bi-Turbo", "Twin-Turbo"
]

export const cities = [
  "Bakı", "Gəncə", "Sumqayıt", "Mingəçevir", "Lənkəran", "Şəki", "Quba", "Naxçıvan", "Yevlax", "Tovuz", "Naftalan", "Qəbələ", "Salyan", "Biləsuvar", "Masallı", "Şamaxı", "Saatlı", "Bərdə", "Füzuli", "Cəlilabad", "Qazax", "Sabirabad", "Zaqatala", "Ağsu", "Oğuz", "Tərtər"
]

export const features = [
  "ABS", "EBD (Elektron əyləc paylanması)", "ESP/ESC", "Traction Control", "Airbags (Ön)", "Airbags (Yan)", "Curtain Airbags", "Kolliziya xəbərdarlığı", "Avtomatik təcili əyləc (AEB)", "Təkər təzyiqi monitorinqi (TPMS)", "Dəyişən yol köməyi (Hill Descent Control)", "Yüksək yamacda enmə köməyi", "Ölü nöqtə monitorinqi (BSM)", "Zolaq kömək sistemi (Lane Assist)", "Zolaq saxlama yardımçısı", "Tire Pressure Monitor", "Adaptive Headlights", "Night Vision", "Roll-over Protection", "Pedestrian Detection", "Driver Attention Alert", "Blind Spot Intervention", "Rear Cross Traffic Alert", "Tyre Pressure Warning", "ISO-FIX Child Anchors", "Lane Keep Assist", "Traffic Sign Recognition", "Kondisioner (Manuel)", "Avtomatik İqlim Nəzarəti (Dual-Zone)", "Avtomatik İqlim (Tri-Zone)", "Heated Seats (İsitməli oturacaqlar)", "Ventilated Seats (Sərinlənən oturacaqlar)", "Massaging Seats", "Memory Seats", "Leather Upholstery (Dəri salon)", "Fabric Upholstery", "Alcantara Trim", "Heated Steering Wheel", "Ventilated Steering Wheel", "Power Seats", "Electric Lumbar Support", "Rear Seat Recline", "Rear Armrest", "Rear Climate Control", "Sunroof", "Panoramic Sunroof", "Power Sunshade", "Ambient Lighting", "Wireless Phone Charger", "Cup Holders", "Center Console Storage", "Adjustable Steering Column", "Keyless Entry", "Push Button Start", "Remote Start", "Hands-free Tailgate", "Power Tailgate", "Soft-close Doors", "Noise Insulation Package", "Cabin Air Purifier", "Touchscreen Display", "Apple CarPlay", "Android Auto", "Built-in Navigation", "Satellite Navigation", "Bluetooth", "In-car WiFi", "Adaptive Sound System", "Premium Sound System (Bose/ Harman/ Bang & Olufsen)", "Multiple USB Ports", "12V Socket", "HD Radio", "DAB+", "Voice Recognition", "OTA Updates", "Telematics Service", "Connected Car Services", "Driver Profiles", "Over-the-air Maps", "In-car Apps", "Rear Entertainment System", "Head-up Display (HUD)", "Instrument Cluster LCD", "Gesture Control", "Wireless Mirroring", "Rear Camera", "Front Camera", "360 Degree Camera", "Parking Sensors (Front)", "Parking Sensors (Rear)", "Autonomous Parking", "Rear View Mirror Camera", "Top-view Camera", "Park Assist", "Trailer Assist", "Bird's Eye View", "Rear Cross Traffic Braking", "LED Headlights", "Xenon Headlights", "Matrix LED", "Adaptive LED Headlights", "Daytime Running Lights (DRL)", "Automatic Headlights", "Cornering Lights", "Fog Lights", "LED Tail Lights", "Roof Rails", "Panoramic Roof", "Power Folding Mirrors", "Heated Mirrors", "Auto-dimming Mirrors", "Rain-sensing Wipers", "Electric Windows", "Privacy Glass", "Tinted Glass", "Sunshade", "Spoiler", "Diffuser", "Sport Mode", "Eco Mode", "Adaptive Suspension", "Air Suspension", "Magnetic Ride Control", "Limited Slip Differential", "Active Aero", "Launch Control", "Torque Vectoring", "Four Wheel Drive", "All Wheel Drive", "Rear Wheel Drive", "Front Wheel Drive", "Adjustable Ride Height", "Performance Brakes", "Brembo Brakes", "Ceramic Brakes", "Regenerative Braking", "Start/Stop System", "Alloy Wheels", "Run-flat Tires", "TPMS", "Tire Repair Kit", "Wheel Size 15\"", "Wheel Size 16\"", "Wheel Size 17\"", "Wheel Size 18\"", "Wheel Size 19\"", "Wheel Size 20\"", "Wheel Size 21\"", "Snow Tires Included", "Off-road Tires", "Sport Tires", "Spare Wheel", "Roof Box Compatible", "Tow Hitch", "Tow Package", "Fold-flat Rear Seats", "Underfloor Storage", "Hands-free Liftgate", "Remote Trunk Release", "Adjustable Cargo Floor", "Cargo Net", "Roof Rails", "Bike Rack Prep", "Trailer Hitch", "Dual-zone Climate", "Tri-zone Climate", "Cabin Pre-heater", "Eco Driving Indicator", "Start-Stop System", "Low Emissions", "Euro 6 Compliant", "ULEZ Compliant", "AdBlue System", "Particulate Filter", "CO2 Low Emission", "Adaptive Cruise Control", "Full-Speed Adaptive Cruise", "Traffic Jam Assist", "Highway Assist", "Autonomous Emergency Steering", "Automatic Lane Change", "Hands-free Driving Mode", "Driver Monitoring", "Child Seat Recognition", "Rear Occupant Alert", "Floor Mats (All-weather)", "Cargo Cover", "Illuminated Sill Plates", "Ambient Lighting Customizable", "Wood Trim", "Carbon Fiber Trim", "Aluminum Pedals", "Sport Steering Wheel", "Heated Rear Seats", "Ventilated Rear Seats", "Refrigerated Glovebox", "Alarm System", "Immobilizer", "GPS Tracking", "Wheel Locking Bolts", "PIN to Drive", "Remote Vehicle Disable", "Keyless-Go", "Valet Mode", "Anti-theft Wheel Locks", "Central Locking", "Hill Start Assist", "Hill Descent Control", "Skid Plates", "Off-road Mode", "4x4 Low Range", "Tow Package with Wiring", "Trailer Sway Control", "Rear Differential Lock", "Roof Racks", "Underbody Protection", "Winter Package", "Summer Package", "Sport Package", "Technology Package", "Luxury Package", "Cold Climate Package", "Premium Paint", "Extended Warranty", "Service Plan Included", "Dealer Installed Options", "Owner's Manual in English/AZ", "First Aid Kit", "Fire Extinguisher", "Roadside Assistance Included"
].sort((a, b) => a.localeCompare(b))

export const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i)
