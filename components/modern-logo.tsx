"use client"

import { Car } from "lucide-react"

interface ModernLogoProps {
  className?: string
  showText?: boolean
}

export function ModernLogo({ className = "", showText = true }: ModernLogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 p-0.5">
          <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-transparent"></div>
            <div className="absolute top-1 right-1 w-2 h-2 bg-blue-300/30 rounded-full"></div>
            <div className="absolute bottom-1 left-1 w-1 h-1 bg-blue-200/40 rounded-full"></div>

            <Car className="h-5 w-5 text-white relative z-10" />
          </div>
        </div>
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full border-2 border-white shadow-sm"></div>
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent leading-tight">
            Euro Car
          </span>
          <span className="text-xs text-blue-500/70 font-medium -mt-1">Premium Auto</span>
        </div>
      )}
    </div>
  )
}
