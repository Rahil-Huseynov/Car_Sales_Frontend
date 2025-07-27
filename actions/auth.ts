"use server"

const MOCK_USERS = [{ email: "test@example.com", password: "password123", name: "Test User" }]

export async function login(prevState: any, formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  await new Promise((resolve) => setTimeout(resolve, 1000))

  const user = MOCK_USERS.find((u) => u.email === email && u.password === password)

  if (user) {
    const accessToken = `mock-access-token-${Date.now()}`
    return { success: true, message: "Giriş uğurlu!", accessToken }
  } else {
    return { success: false, message: "Yanlış e-mail və ya şifrə." }
  }
}

export async function register(prevState: any, formData: FormData) {
  const firstName = formData.get("firstName") as string
  const lastName = formData.get("lastName") as string
  const email = formData.get("email") as string
  const phone = formData.get("phone") as string
  const password = formData.get("password") as string
  const confirmPassword = formData.get("confirmPassword") as string
  const agreeToTerms = formData.get("agreeToTerms") === "on"

  await new Promise((resolve) => setTimeout(resolve, 1000))

  if (password !== confirmPassword) {
    return { success: false, message: "Şifrələr uyğun gəlmir!" }
  }

  if (!agreeToTerms) {
    return { success: false, message: "İstifadə şərtlərini qəbul etməlisiniz!" }
  }

  if (MOCK_USERS.some((u) => u.email === email)) {
    return { success: false, message: "Bu e-mail artıq qeydiyyatdan keçib." }
  }

  MOCK_USERS.push({ email, password, name: `${firstName} ${lastName}` }) 
  const accessToken = `mock-access-token-${Date.now()}`

  return { success: true, message: "Qeydiyyat uğurlu!", accessToken }
}

export async function logout() {
  return { success: true, message: "Çıxış uğurlu!" }
}
