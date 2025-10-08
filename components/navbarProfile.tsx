"use client"

import React, { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { getTranslation, translateString } from "@/lib/i18n"
import { useLanguage } from "@/hooks/use-language"
import { useDefaultLanguage } from "./useLanguage"

export default function NavbarProfile() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { lang, setLang } = useDefaultLanguage();
  const t = (key: string) => translateString(lang, key);
  const navLinks = [
    { href: "/profile", label: t("profile") },
    { href: "/profile/my-ads", label: t("myAds") },
    { href: "/profile/favorites", label: t("favorites") },
    { href: "/profile/settings", label: t("settings") },
  ]

  return (
    <nav className="bg-white shadow-md rounded-lg p-4 sticky top-4">
      <button
        className="md:hidden mb-4 focus:outline-none"
        aria-label="Toggle menu"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {isOpen ? (
          <svg
            className="w-6 h-6 text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            className="w-6 h-6 text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        )}
      </button>
      <ul className={`md:block ${isOpen ? "block" : "hidden"}`}>
        {navLinks.map(({ href, label }) => {
          const isActive = pathname === href || (href !== "/profile" && pathname?.startsWith(href))
          return (
            <li key={href} className="mb-2 last:mb-0">
              <Link
                href={href}
                className={`block px-4 py-2 rounded-md transition ${isActive
                  ? "bg-blue-600 text-white font-semibold"
                  : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  }`}
                onClick={() => setIsOpen(false)}
              >
                {label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
