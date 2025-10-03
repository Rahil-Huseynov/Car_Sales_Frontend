import { tokenManager } from "./token-manager"

type GetAllCarsParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  brand?: string;
  model?: string;
  year?: number;
  fuel?: string;
  transmission?: string;
  condition?: string;
  color?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
};

export class ApiError extends Error {
  status: number
  data?: any

  constructor(message: string, status: number, data?: any) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.data = data
  }
}

class ApiClient {
  private baseURL: string

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL as string;
  }

  private async request(endpoint: string, options: RequestInit = {}): Promise<any> {
    const url = `${this.baseURL}${endpoint}`

    const isFormData = options.body instanceof FormData

    const config: RequestInit = {
      ...options,
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...options.headers,
      },
    }

    const token = tokenManager.getAccessToken()
    if (token && !tokenManager.isTokenExpired(token)) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      }
    }

    try {
      let response = await fetch(url, config)
      if (response.status === 401 && token) {
        const refreshSuccess = await this.handleTokenRefresh()
        if (refreshSuccess) {
          const newToken = tokenManager.getAccessToken()
          config.headers = {
            ...config.headers,
            Authorization: `Bearer ${newToken}`,
          }
          response = await fetch(url, config)
        }
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new ApiError(
          errorData.message || `HTTP error! status: ${response.status}`,
          response.status,
          errorData
        )
      }
      if (response.status === 204) return null
      return await response.json()
    } catch (error: any) {
      if (error instanceof ApiError) throw error
      console.error("API request failed:", error)
      throw error
    }
  }

  private async handleTokenRefresh(): Promise<boolean> {
    try {
      const refreshToken = tokenManager.getRefreshToken()
      if (!refreshToken) return false

      const response = await fetch(`${this.baseURL}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      })

      if (response.ok) {
        const data = await response.json()
        tokenManager.setAccessToken(data.accessToken)
        return true
      }

      return false
    } catch (error) {
      return false
    }
  }

  async login(email: string, password: string) {
    return this.request("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
  }


  async register(formData: FormData) {
    return this.request("/auth/user/signup", {
      method: "POST",
      body: formData,
      headers: {},
    })
  }

  async getlogs(page: number, limit: number) {
    return this.request(`/logs?page=${page}&limit=${limit}`, {
      method: 'GET',
    });
  }

  async updateUser(userId: string, formData: FormData) {
    return this.request(`/auth/users/${userId}`, {
      method: 'PUT',
      body: formData,
      headers: {},
    });
  }

  async getAdmins(currentPage: number, searchTerm: string) {
    const query = new URLSearchParams({
      page: currentPage.toString(),
      limit: "10",
      search: searchTerm.trim(),
    });

    return this.request(`/auth/admins?${query.toString()}`, {
      method: "GET",
    });
  }


  async deleteAdmin(userId: string) {
    return this.request(`/auth/admin/${userId}`, {
      method: "delete",
    })

  }

  async addAdmin(formData: FormData) {
    return this.request(`/auth/admin/signup`, {
      method: "POST",
      body: formData,

    })

  }

  async updateAdmin(editAdmin: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    password?: string;
  }) {
    const { id, ...data } = editAdmin;

    if (!data.password) {
      delete data.password;
    }

    return this.request(`/auth/admin/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  }

  async refreshToken(refreshToken: string) {
    return this.request("/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    })
  }


  async getCurrentUser() {
    const token = localStorage.getItem("accessToken")
    return this.request(`/auth/me`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  async getAllCars(params: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
    brand?: string;
    model?: string;
    year?: number;
    fuel?: string;
    transmission?: string;
    condition?: string;
    color?: string;
    city?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
  } = {}) {
    const query = new URLSearchParams();

    if (params.page) query.append("page", params.page.toString());
    if (params.limit) query.append("limit", params.limit.toString());
    if (params.status) query.append("status", params.status);
    if (params.search) query.append("search", params.search);
    if (params.brand) query.append("brand", params.brand);
    if (params.model) query.append("model", params.model);
    if (params.year) query.append("year", params.year.toString());
    if (params.fuel) query.append("fuel", params.fuel);
    if (params.transmission) query.append("transmission", params.transmission);
    if (params.condition) query.append("condition", params.condition);
    if (params.color) query.append("color", params.color);
    if (params.city) query.append("city", params.city);
    if (params.minPrice) query.append("minPrice", params.minPrice.toString());
    if (params.maxPrice) query.append("maxPrice", params.maxPrice.toString());
    if (params.sortBy) query.append("sortBy", params.sortBy);

    return this.request(`/car/all?${query.toString()}`, {
      method: "GET",
    });
  }

  async getPremiumCars(params: Omit<GetAllCarsParams, "status"> = {}) {
    const query = new URLSearchParams();

    if (params.page !== undefined) query.append("page", params.page.toString());
    if (params.limit !== undefined) query.append("limit", params.limit.toString());
    if (params.search) query.append("search", params.search);
    if (params.brand) query.append("brand", params.brand);
    if (params.model) query.append("model", params.model);
    if (params.year !== undefined) query.append("year", params.year.toString());
    if (params.fuel) query.append("fuel", params.fuel);
    if (params.transmission) query.append("transmission", params.transmission);
    if (params.condition) query.append("condition", params.condition);
    if (params.color) query.append("color", params.color);
    if (params.city) query.append("city", params.city);
    if (params.minPrice !== undefined) query.append("minPrice", params.minPrice.toString());
    if (params.maxPrice !== undefined) query.append("maxPrice", params.maxPrice.toString());
    if (params.sortBy) query.append("sortBy", params.sortBy);

    const qs = query.toString();
    const path = `/car/premium${qs ? `?${qs}` : ""}`;
    return this.request(path, { method: "GET" });
  }


  async addcardata(formData: any) {
    return this.request('/user-cars', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
      body: JSON.stringify(formData),
    });
  }

  async addcarimagedata(formData: FormData) {
    return this.request('/car-images/upload', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
      body: formData,
    });
  }

  async getUsers(page = 1, limit = 10) {
    return this.request(`/auth/users?page=${page}&limit=${limit}`)
  }

  async getCarId(id: number) {
    return this.request(`/car/${id}`)
  }


  async getUserById(id: string) {
    return this.request(`/users/${id}`)
  }

  async deleteUser(id: string) {
    return this.request(`/users/${id}`, {
      method: "DELETE",
    })
  }

  async forgotPassword(email: string) {
    return this.request("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    })
  }

  async checkTokenForgotPassword(token: string) {
    return this.request(`/auth/check-token?token=${token}`, {
      method: "GET",
    });
  }

  async updatePassword(formData: FormData) {
    return this.request(`/auth/users/password`, {
      method: "PATCH",
      body: formData,
      headers: {},
    });
  }
  async resetPassword(token: string, newPassword: string) {
    const response = await this.request('/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, newPassword }),
    });
    return response;
  }

  async sendEmail(payload: { to: string; subject: string; message: string; name?: string; from?: string; phone?: string }) {
    const res = await this.request('/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: payload.to,
        subject: payload.subject,
        text: `${payload.message}\n\nAd: ${payload.name || ''}\nEmail: ${payload.from || ''}\nTelefon: ${payload.phone || ''}`,
      }),
    });
    if (res && typeof res === 'object' && 'ok' in res && !(res as any).ok) {
      let data: any = {};
      try {
        data = res as any
      } catch { }
      throw new Error(data.message || 'Server xətası');
    }
    return { success: true };
  }

}

export const apiClient = new ApiClient()

export default apiClient

