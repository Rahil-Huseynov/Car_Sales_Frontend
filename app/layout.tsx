import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Euro Car - Premium Avtomobil Satışı",
  description:
    "Azərbaycanda ən yaxşı avtomobil alqı-satqı platforması. BMW, Mercedes, Toyota və digər markaların geniş seçimi.",
  keywords: "avtomobil, maşın, satış, alış, BMW, Mercedes, Toyota, Bakı, Azərbaycan",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="az">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
