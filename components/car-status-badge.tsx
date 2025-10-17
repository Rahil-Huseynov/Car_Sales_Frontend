"use client"

import { carStatus } from "@/lib/car-data"
import { findTranslationFromList } from "@/app/cars/[id]/page"

interface CarStatusBadgeProps {
  saleType?: string
  language?: string
}

export function CarStatusBadge({ saleType, language = "en" }: CarStatusBadgeProps) {
  const statusLabel = findTranslationFromList(carStatus as any[], saleType, language)

  const getStatusConfig = (type?: string) => {
    if (!type) return { bg: "bg-blue-600", text: "text-white" }

    const lowerType = type.toLowerCase()

    if (lowerType.includes("rent")) {
      return {
        bg: "bg-emerald-600",
        text: "text-white",
      }
    }

    return {
      bg: "bg-blue-600",
      text: "text-white",
    }
  }

  const config = getStatusConfig(saleType)

  return (
    <div
      className={`${config.bg} ${config.text} px-3 py-1.5 rounded-lg font-semibold text-sm shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:scale-105 inline-block`}
    >
      {statusLabel}
    </div>
  )
}
