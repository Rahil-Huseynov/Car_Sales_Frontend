"use client"

import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Eye, Edit, Trash2, Car, Users, TrendingUp } from "lucide-react"
import apiClient from "@/lib/api-client"

const locales = {
  az: {
    totalCars: "Ümumi avtomobil",
    totalUsers: "Ümumi istifadəçi",
    totalViews: "Ümumi baxış",
    totalSales: "Ümumi satış",
    recentCars: "Son avtomobillər",
    recentUsers: "Son istifadəçilər",
    statusActive: "Aktiv",
    statusSold: "Satıldı",
    statusPending: "Gözləmədə",
    userStatusActive: "Aktiv",
    userStatusBlocked: "Bloklanmış",
    views: "baxış",
    joinDate: "Qoşulma tarixi",
  },
}

type StatData = {
  totalAllCars: number
  totalUsers: number
  soldAllCars: number
}

type CarType = {
  id: number
  brand: string
  model: string
  year: number
  price: number
  status: string
  views: number
}

type UserType = {
  id: number
  name: string
  email: string
  joinDate: string
  status: string
}

export default function AdminDashboard({ lang = "az" }: { lang?: keyof typeof locales }) {
  const t = locales[lang]

  const [stats, setStats] = useState<StatData | null>(null)
  const [recentCars, setRecentCars] = useState<CarType[]>([])
  const [recentUsers, setRecentUsers] = useState<UserType[]>([])
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const statsData = await apiClient.adminStars()
        setStats(statsData)

        const carsRes = await apiClient.recentCars()
        setRecentCars(carsRes)

        const usersRes = await apiClient.recentUsers()
        setRecentUsers(usersRes)
      } catch (err) {
        console.error(err)
      }
    }

    fetchStats()
  }, [])



  if (!stats) return <div>Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">{t.totalCars}</CardTitle>
                  <Car className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalAllCars}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">{t.totalUsers}</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalUsers}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">{t.totalSales}</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.soldAllCars}</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t.recentCars}</CardTitle>
                </CardHeader>
                <CardContent>
                  {recentCars.map((car) => (
                    <div key={car.id} className="flex items-center justify-between mb-4">
                      <div>
                        <p className="font-medium">{car.brand} {car.model}</p>
                        <p className="text-sm text-gray-600">{car.year} • {car.price.toLocaleString()} ₼</p>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant={
                            car.status === t.statusActive
                              ? "default"
                              : car.status === t.statusSold
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {car.status}
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">{car.views} {t.views}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t.recentUsers}</CardTitle>
                </CardHeader>
                <CardContent>
                  {recentUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between mb-4">
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500 mt-1">{user.joinDate}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
