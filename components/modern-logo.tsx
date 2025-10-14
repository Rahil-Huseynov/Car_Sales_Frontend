"use client"

import Image from "next/image"
import logo from "../public/Logo/2.png"

interface ModernLogoProps {
  className?: string
}

export function ModernLogo({ className = "" }: ModernLogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="w-[100px] md:w-[110px] h-auto relative">
        {/* <Image 
          src={logo} 
          alt="logo" 
          style={{ objectFit: "contain" }}
        /> */}
      </div>
    </div>
  )
}
