
import { DecodedJWT } from "./auth-headers";

export class TokenManager {
  private readonly ACCESS_TOKEN_KEY = "access_token"
  private readonly REFRESH_TOKEN_KEY = "refresh_token"
  private readonly EXPIRES_AT_KEY = "expires_at"

  setAccessToken(accessToken: string, remember: boolean) {
    if (typeof window === "undefined") return
    const targetStorage = remember ? localStorage : sessionStorage;
    const otherStorage = remember ? sessionStorage : localStorage;

    otherStorage.removeItem(this.ACCESS_TOKEN_KEY)
    otherStorage.removeItem(this.EXPIRES_AT_KEY)

    try {
      const payload = this.decodeJWT(accessToken)
      const expiresAt = (payload.exp || 0) * 1000
      targetStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken)
      targetStorage.setItem(this.EXPIRES_AT_KEY, String(expiresAt))
    } catch {
      targetStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken)
      targetStorage.removeItem(this.EXPIRES_AT_KEY)
    }
  }

  setRefreshToken(refreshToken: string, remember: boolean) {
    if (typeof window === "undefined") return
    const targetStorage = remember ? localStorage : sessionStorage;
    const otherStorage = remember ? sessionStorage : localStorage;

    otherStorage.removeItem(this.REFRESH_TOKEN_KEY)

    targetStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken)
  }

  getAccessToken(): string | null {
    if (typeof window === "undefined") return null
    let token = sessionStorage.getItem(this.ACCESS_TOKEN_KEY)
    if (token) return token
    return localStorage.getItem(this.ACCESS_TOKEN_KEY)
  }

  getRefreshToken(): string | null {
    if (typeof window === "undefined") return null
    let refresh = sessionStorage.getItem(this.REFRESH_TOKEN_KEY)
    if (refresh) return refresh
    return localStorage.getItem(this.REFRESH_TOKEN_KEY)
  }

  clearTokens() {
    if (typeof window === "undefined") return
    [localStorage, sessionStorage].forEach(storage => {
      storage.removeItem(this.ACCESS_TOKEN_KEY)
      storage.removeItem(this.REFRESH_TOKEN_KEY)
      storage.removeItem(this.EXPIRES_AT_KEY)
    })
  }

  isTokenExpired(token: string): boolean {
    try {
      const payload = this.decodeJWT(token)
      const current = Date.now() / 1000
      return !payload.exp || payload.exp < current
    } catch {
      return true
    }
  }

  getTokenExpirationTime(): number | null {
    if (typeof window === "undefined") return null
    let v = sessionStorage.getItem(this.EXPIRES_AT_KEY)
    if (v) return Number.parseInt(v, 10)
    v = localStorage.getItem(this.EXPIRES_AT_KEY)
    return v ? Number.parseInt(v, 10) : null
  }

  private decodeJWT(token: string): DecodedJWT {
    if (!token) throw new Error("Empty token")
    const parts = token.split(".")
    if (parts.length < 2) throw new Error("Invalid token")
    const base64Url = parts[1]
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    )
    return JSON.parse(json)
  }
}

export const tokenManager = new TokenManager()