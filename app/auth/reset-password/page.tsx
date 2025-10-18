"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Lock, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";
import { apiClient } from "@/lib/api-client";
import Image from "next/image";
import { Navbar } from "@/components/navbar";
import { useDefaultLanguage } from "@/components/useLanguage";
import { translateString } from "@/lib/i18n";
import ReCAPTCHA from "react-google-recaptcha"

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const { lang, setLang } = useDefaultLanguage();
  const t = (key: string) => translateString(lang, key);
  const recaptchaRef = useRef<ReCAPTCHA>(null)

  useEffect(() => {
    if (!token) {
      router.replace(`/auth/login`);
      return;
    }

    async function checkToken() {
      try {
        const res = await apiClient.checkTokenForgotPassword(token);

        if (!res.valid) {
          router.replace(`/auth/login`);
        } else {
          setTokenValid(true);
        }
      } catch (error) {
        router.replace(`/auth/login`);
      }
    }

    if (token) {
      checkToken();
    }
  }, [token, router]);

  if (tokenValid === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4 flex items-center justify-center">
        <div className="text-center text-lg text-gray-600">{t("checking")}</div>
      </div>
    );
  }

  const handleCaptcha = (token: string | null) => {
    setCaptchaToken(token)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!captchaToken) {
      setError(t("captchaRequired") || "Please complete the CAPTCHA")
      return
    }

    setLoading(true);

    try {
      const data = await apiClient.resetPassword(token, newPassword);

      setMessage(data.message || t("successMessage"));
      setNewPassword("");
      setTimeout(() => {
        window.location.href = `/auth/login`;
      }, 1000);
    } catch (err: any) {
      setError(err.message || t("errorMessage"));
    } finally {
      setLoading(false);
      recaptchaRef.current?.reset()
      setCaptchaToken(null)
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="navbar-slide">
        <Navbar />
      </div>

      <section className="bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 text-white py-12 md:py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-400/10 to-transparent"></div>
        <div className="absolute top-10 right-10 w-32 h-32 bg-orange-400/10 rounded-full blur-xl animate-pulse-slow"></div>
        <div className="absolute bottom-10 left-10 w-24 h-24 bg-orange-300/10 rounded-full blur-lg animate-bounce-slow"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="hero-title text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center justify-center gap-3">
              <Lock className="h-8 w-8 text-orange-200" />
              {t("setNewPassword")}
            </h1>
            <p className="text-orange-100">{t("passwordRequirements")}</p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Button asChild variant="outline" className="mb-6 animate-fadeInUp bg-transparent">
            <Link href={`/auth/login`}>
              <span className="flex items-center gap-2">{t("backToLogin")}</span>
            </Link>
          </Button>

          <Card className="animate-fadeInUp border-0 bg-white/90 backdrop-blur-sm shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-gray-800 pt-4">{t("setNewPassword")}</CardTitle>
              <p className="text-gray-600 text-sm">{t("passwordRequirements")}</p>
            </CardHeader>

            <CardContent>
              {error && (
                <Alert className="border-red-200 bg-red-50 animate-fadeInUp">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">{error}</AlertDescription>
                </Alert>
              )}

              {message && (
                <div className="text-center space-y-4 animate-fadeInUp">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>

                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">{message}</AlertDescription>
                  </Alert>

                  <div className="text-sm text-gray-600 space-y-2">
                    <p>{t("passwordChangedInfo")}</p>
                  </div>
                </div>
              )}

              {!message && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="password" className="text-gray-700 block text-sm font-semibold">
                      {t("newPassword")}
                    </label>

                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder={t("newPasswordPlaceholder")}
                        value={newPassword}
                        onChange={(e) => {
                          setNewPassword(e.target.value);
                        }}
                        required
                        className={"pr-10"}
                      />

                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>
                  <div className="grid place-items-center w-full">
                    <ReCAPTCHA
                      ref={recaptchaRef}
                      sitekey={process.env.NEXT_PUBLIC_SITE_KEY!}
                      onChange={handleCaptcha}
                      theme="light"
                    />
                  </div>
                  <div className="pt-2">
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800"
                      disabled={loading || !captchaToken}
                    >
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          {t("loading")}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Lock className="h-4 w-4" />
                          {t("changePassword")}
                        </div>
                      )}
                    </Button>
                  </div>

                  <div className="text-center pt-4">
                    <p className="text-sm text-gray-600">
                      {t("rememberPassword")} <Link href={`/auth/login`} className="text-orange-600 hover:text-orange-700 font-medium">{t("signIn")}</Link>
                    </p>
                  </div>
                </form>
              )}
            </CardContent>

            <CardFooter className="px-6 pb-6">
              <div className="text-center w-full">
                <Link href={`/auth/login`} className="text-sm text-orange-600 hover:underline">{t("backToLogin")}</Link>
              </div>
            </CardFooter>
          </Card>

          <Card className="mt-6 bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200 animate-fadeInUp">
            <CardContent className="pt-6">
              <div className="text-center">
                <h4 className="font-semibold text-orange-800 mb-2">{t("needHelp")}</h4>
                <p className="text-sm text-orange-700 mb-4">{t("contactSupport")}</p>
                <Button asChild variant="outline" size="sm" className="border-orange-200 text-orange-600 hover:bg-orange-50 bg-transparent">
                  <Link href="/contact">{t("contactUs")}</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}