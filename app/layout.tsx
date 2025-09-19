import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import ClientAuthWrapper from "@/components/ClientAuthWrapper"
import { AuthProvider } from "@/lib/auth-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Euro Car - Premium Avtomobil Satışı",
  description:
    "Azərbaycanda ən yaxşı avtomobil alqı-satqı platforması. BMW, Mercedes, Toyota və digər markaların geniş seçimi.",
  keywords: "avtomobil, maşın, satış, alış, BMW, Mercedes, Toyota, Bakı, Azərbaycan",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="az">
      <body className={inter.className}>
        <AuthProvider>
          <ClientAuthWrapper>{children}</ClientAuthWrapper>
        </AuthProvider>
      </body>
    </html>
  )
}
