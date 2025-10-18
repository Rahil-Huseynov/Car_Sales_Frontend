"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Loader2, Search, Copy, ChevronDown, ChevronUp, Car } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Navbar } from "@/components/navbar"
import { FIELD_CATEGORIES } from "@/lib/car-data"
import { useDefaultLanguage } from "@/components/useLanguage"
import { translateString } from "@/lib/i18n"
import ReCAPTCHA from "react-google-recaptcha"

interface VinResult {
    [key: string]: string | undefined
}

export default function VinCheckerPage() {
    const [vin, setVin] = useState("")
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<VinResult | null>(null)
    const [rawData, setRawData] = useState<string>("")
    const [showRaw, setShowRaw] = useState(false)
    const [error, setError] = useState<string>("")
    const [success, setSuccess] = useState<string>("")
    const [captchaToken, setCaptchaToken] = useState<string | null>(null)
    const { lang } = useDefaultLanguage();
    const t = (key: string) => translateString(lang, key);
    const recaptchaRef = useRef<ReCAPTCHA>(null)

    const validateVIN = (v: string): boolean => {
        return /^[A-HJ-NPR-Z0-9]{17}$/i.test(v)
    }

    const handleCaptcha = (token: string | null) => {
        setCaptchaToken(token)
    }

    useEffect(() => {
        if (captchaToken) {
            performFetch()
        }
    }, [captchaToken])

    const performFetch = async () => {
        setLoading(true)
        setResult(null)
        setShowRaw(false)

        try {
            const url = `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValuesExtended/${encodeURIComponent(vin)}?format=json`
            const res = await fetch(url)

            if (!res.ok) throw new Error(`${t("vin.api_error")}${res.status}`)

            const json = await res.json()
            const data = json.Results?.[0]

            if (!data) {
                setError(t("vin.no_result"))
                return
            }

            setResult(data)
            setRawData(JSON.stringify(data, null, 2))
            setSuccess(t("vin.success_load"))
        } catch (err) {
            console.error(err)
            setError(`${t("vin.error")}: ${(err instanceof Error ? err.message : t("vin.unknown_error"))}`)
        } finally {
            setLoading(false)
            recaptchaRef.current?.reset()
            setCaptchaToken(null)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const cleanVin = vin.trim().toUpperCase()

        setError("")
        setSuccess("")

        if (!cleanVin) {
            setError(t("vin.enter_vin"))
            return
        }

        if (cleanVin.length !== 17 || !validateVIN(cleanVin)) {
            setError(t("vin.invalid_format"))
            return
        }

        recaptchaRef.current?.execute()
    }

    const formatValue = (value: string | undefined): string => {
        if (!value || value === "" || value === "Not Applicable") {
            return "-"
        }
        return value
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50">
                <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-12 md:py-20 relative overflow-hidden">
                    <div className="container mx-auto px-4 text-center relative z-10">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <Car className="h-10 w-10 md:h-12 md:w-12" />
                            <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                                {t("vin.title")}
                            </h1>
                        </div>
                        <p className="text-lg md:text-xl mb-6 md:mb-8 text-blue-100">
                            {t("vin.subtitle")}
                        </p>

                        <div className="max-w-2xl mx-auto">
                            <form onSubmit={handleSubmit} className="relative">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
                                <Input
                                    type="text"
                                    value={vin}
                                    onChange={(e) => setVin(e.target.value.toUpperCase())}
                                    placeholder={t("vin.placeholder")}
                                    maxLength={17}
                                    className="pl-12 pr-32 py-6 text-sm md:text-lg bg-white/95 backdrop-blur-sm border-0 shadow-lg rounded-xl"
                                />
                                <ReCAPTCHA
                                    ref={recaptchaRef}
                                    sitekey={process.env.NEXT_PUBLIC_SITE_KEY!}
                                    onChange={handleCaptcha}
                                    theme="light"
                                    size="invisible"
                                />
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-300 hover:scale-105 h-10"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            {t("vin.checking")}
                                        </>
                                    ) : (
                                        <>
                                            <Search className="h-4 w-4 mr-2" />
                                            {t("vin.check")}
                                        </>
                                    )}
                                </Button>
                            </form>
                        </div>
                    </div>
                </section>

                <div className="container mx-auto px-4 py-8">
                    {error && (
                        <div className="max-w-6xl mx-auto mb-6 animate-fadeInUp">
                            <Card className="border-red-200 bg-red-50/80 backdrop-blur-sm">
                                <CardContent className="p-4">
                                    <p className="text-red-600 font-medium">{error}</p>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {success && (
                        <div className="max-w-6xl mx-auto mb-6 animate-fadeInUp">
                            <Card className="border-green-200 bg-green-50/80 backdrop-blur-sm">
                                <CardContent className="p-4">
                                    <p className="text-green-600 font-medium">{success}</p>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {result && (
                        <div className="max-w-6xl mx-auto animate-fadeInUp">
                            <Card className="shadow-sm border-0 bg-white/90 backdrop-blur-sm">
                                <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-lg">
                                    <h2 className="text-xl font-semibold text-blue-800">{t("vin.vehicle_info")}</h2>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="space-y-8">
                                        {Object.values(FIELD_CATEGORIES).map((category) => (
                                            <div key={category.key}>
                                                <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-blue-200">
                                                    {category.translations[lang]}
                                                </h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                                    {category.fields.map((field) => {
                                                        const value = formatValue(result[field.apiKey])
                                                        return (
                                                            <div key={field.apiKey} className="p-3 rounded-lg border border-gray-100 bg-gray-50/50 hover:bg-blue-50/50 transition-colors duration-300">
                                                                <div className="text-xs font-medium text-gray-500 mb-1">
                                                                    {field.translations[lang]}
                                                                </div>
                                                                <div className="text-sm font-semibold text-gray-800">{value}</div>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                    {!result && !loading && (
                        <div className="max-w-6xl mx-auto">
                            <Card className="shadow-sm border-0 bg-white/90 backdrop-blur-sm">
                                <CardContent className="p-12 text-center">
                                    <Car className="h-16 w-16 mx-auto text-blue-500 mb-4" />
                                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{t("vin.title")}</h3>
                                    <p className="text-gray-600 mb-4">
                                        {t("vin.description")}
                                    </p>
                                    <div className="text-sm text-gray-500">
                                        <p>{t("vin.vin_rule")}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
} 