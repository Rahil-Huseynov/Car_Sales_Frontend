interface DecodedJWT {
  exp?: number
  [key: string]: any
}

export class TokenManager {
  private readonly ACCESS_TOKEN_KEY = "access_token"
  private readonly REFRESH_TOKEN_KEY = "refresh_token"
  private readonly EXPIRES_AT_KEY = "expires_at"

  setTokens(accessToken: string, refreshToken: string) {
    if (typeof window === "undefined") return
    try {
      const payload = this.decodeJWT(accessToken)
      const expiresAt = (payload.exp || 0) * 1000
      localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken)
      localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken)
      localStorage.setItem(this.EXPIRES_AT_KEY, String(expiresAt))
    } catch (err) {
      localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken)
      localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken)
      localStorage.removeItem(this.EXPIRES_AT_KEY)
    }
  }

  setAccessToken(accessToken: string) {
    if (typeof window === "undefined") return
    try {
      const payload = this.decodeJWT(accessToken)
      const expiresAt = (payload.exp || 0) * 1000
      localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken)
      localStorage.setItem(this.EXPIRES_AT_KEY, String(expiresAt))
    } catch {
      localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken)
      localStorage.removeItem(this.EXPIRES_AT_KEY)
    }
  }

  getAccessToken(): string | null {
    if (typeof window === "undefined") return null
    return localStorage.getItem(this.ACCESS_TOKEN_KEY)
  }

  getRefreshToken(): string | null {
    if (typeof window === "undefined") return null
    return localStorage.getItem(this.REFRESH_TOKEN_KEY)
  }

  clearTokens() {
    if (typeof window === "undefined") return
    localStorage.removeItem(this.ACCESS_TOKEN_KEY)
    localStorage.removeItem(this.REFRESH_TOKEN_KEY)
    localStorage.removeItem(this.EXPIRES_AT_KEY)
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
    const v = localStorage.getItem(this.EXPIRES_AT_KEY)
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
