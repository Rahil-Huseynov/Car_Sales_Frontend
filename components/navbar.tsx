"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, User, Settings, LogOut, Plus, Heart } from "lucide-react";
import Link from "next/link";
import { ModernLogo } from "./modern-logo";
import { LanguageSwitcher } from "./language-switcher";
import { translateString } from "@/lib/i18n";
import { useRouter } from "next/navigation";
import { logout } from "@/actions/auth";
import { useToast } from "@/hooks/use-toast";
import type { Language } from "@/lib/i18n";
import { useLanguage } from "./LanguageProvider";
import { tokenManager } from "@/lib/token-manager";

export function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { lang, setLang } = useLanguage();
  const t = (key: string) => translateString(lang, key);

  useEffect(() => {
    const token = tokenManager.getAccessToken();
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      tokenManager.clearTokens();
      setIsLoggedIn(false);
      toast({
        title: "Uğurlu",
        description: result.message,
        variant: "default",
      });
      router.push("/auth/login");
    } else {
      toast({
        title: "Xəta",
        description: result.message,
        variant: "destructive",
      });
    }
  };
  const handleLanguageChange = (newLang: Language) => {
    setLang(newLang);
    if (typeof window !== "undefined") {
      localStorage.setItem("language", newLang);
    }
    setTimeout(() => {
      if (typeof window !== "undefined") window.location.reload();
    }, 50);
  };

  const postAdPath = isLoggedIn ? "/sell" : "/auth/login";

  return (
    <header className="border-b bg-white sticky top-0 z-50 shadow-sm">
      <div className="mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <ModernLogo />
          </Link>

          <nav className="hidden mobile:flex items-center gap-6">
            <Link href="/" className="text-gray-700 text-sm lg:text-base hover:text-blue-600 transition-colors font-medium">
              {t("home")}
            </Link>
            <Link href="/cars" className="text-gray-700 text-sm lg:text-base hover:text-blue-600 transition-colors font-medium">
              {t("cars")}
            </Link>
            <Link href="/sell" className="text-gray-700 text-sm lg:text-base hover:text-blue-600 transition-colors font-medium">
              {t("sell")}
            </Link>
            <Link href="/about" className="text-gray-700 text-sm lg:text-base hover:text-blue-600 transition-colors font-medium">
              {t("about")}
            </Link>
            <Link href="/contact" className="text-gray-700 text-sm lg:text-base hover:text-blue-600 transition-colors font-medium">
              {t("contact")}
            </Link>
          </nav>

          <div className="hidden mobile:flex items-center gap-3">
            {/* Burada onLanguageChange prop-u əlavə olundu */}
            <LanguageSwitcher onLanguageChange={handleLanguageChange} />

            <Button
              variant="outline"
              asChild
              className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200 hover:from-blue-100 hover:to-blue-200 w-[200px]"
            >
              <Link href={postAdPath}>
                <Plus className="h-4 w-4 mr-2" />
                {t("postAd")}
              </Link>
            </Button>

            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="hover:bg-blue-50">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <User className="h-4 w-4 mr-2" />
                      {t("profile")}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/favorites">
                      <Heart className="h-4 w-4 mr-2" />
                      {t("favorites")}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/my-ads">
                      <Plus className="h-4 w-4 mr-2" />
                      {t("myAds")}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings">
                      <Settings className="h-4 w-4 mr-2" />
                      {t("settings")}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    {t("logout")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex gap-2">
                <Button variant="ghost" asChild className="w-[100px] hover:bg-blue-50">
                  <Link href="/auth/login">{t("login")}</Link>
                </Button>
                <Button
                  asChild
                  className="bg-gradient-to-r w-[100px] from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                >
                  <Link href="/auth/register">{t("register")}</Link>
                </Button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 mobile:hidden">
            {/* mobile üçün də prop artıq ötürülür (əvvəl də vardı amma burada saxladım) */}
            <LanguageSwitcher onLanguageChange={handleLanguageChange} />

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col gap-4 mt-8">
                  <Link href="/" className="text-lg font-medium hover:text-blue-600 transition-colors">
                    {t("home")}
                  </Link>
                  <Link href="/cars" className="text-lg font-medium hover:text-blue-600 transition-colors">
                    {t("cars")}
                  </Link>
                  <Link href="/sell" className="text-lg font-medium hover:text-blue-600 transition-colors">
                    {t("sell")}
                  </Link>
                  <Link href="/about" className="text-lg font-medium hover:text-blue-600 transition-colors">
                    {t("about")}
                  </Link>
                  <Link href="/contact" className="text-lg font-medium hover:text-blue-600 transition-colors">
                    {t("contact")}
                  </Link>

                  <div className="border-t pt-4 mt-4">
                    <Button className="w-full mb-3 bg-gradient-to-r from-blue-600 to-blue-700" asChild>
                      <Link href={postAdPath}>
                        <Plus className="h-4 w-4 mr-2" />
                        {t("postAd")}
                      </Link>
                    </Button>

                    {isLoggedIn ? (
                      <div className="space-y-2">
                        <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                          <Link href="/profile">
                            <User className="h-4 w-4 mr-2" />
                            {t("profile")}
                          </Link>
                        </Button>
                        <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                          <Link href="/favorites">
                            <Heart className="h-4 w-4 mr-2" />
                            {t("favorites")}
                          </Link>
                        </Button>
                        <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                          <Link href="/my-ads">
                            <Plus className="h-4 w-4 mr-2" />
                            {t("myAds")}
                          </Link>
                        </Button>
                        <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                          <Link href="/settings">
                            <Settings className="h-4 w-4 mr-2" />
                            {t("settings")}
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full justify-start bg-transparent"
                          onClick={handleLogout}
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          {t("logout")}
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Button variant="outline" className="w-full bg-transparent" asChild>
                          <Link href="/auth/login">{t("login")}</Link>
                        </Button>
                        <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700" asChild>
                          <Link href="/auth/register">{t("register")}</Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}