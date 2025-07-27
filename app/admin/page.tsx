"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Car, Users, TrendingUp, Eye, Edit, Trash2, Plus, Shield } from "lucide-react"

const stats = {
  totalCars: 1247,
  totalUsers: 3456,
  totalViews: 89234,
  totalSales: 234,
}

const recentCars = [
  { id: 1, brand: "BMW", model: "X5", year: 2022, price: 85000, status: "Aktiv", views: 234 },
  { id: 2, brand: "Mercedes", model: "C-Class", year: 2021, price: 65000, status: "Gözləmədə", views: 156 },
  { id: 3, brand: "Toyota", model: "Camry", year: 2023, price: 45000, status: "Aktiv", views: 189 },
  { id: 4, brand: "Hyundai", model: "Elantra", year: 2020, price: 28000, status: "Satıldı", views: 98 },
]

const recentUsers = [
  { id: 1, name: "Əli Məmmədov", email: "ali@example.com", joinDate: "2024-01-15", status: "Aktiv" },
  { id: 2, name: "Leyla Həsənova", email: "leyla@example.com", joinDate: "2024-01-14", status: "Aktiv" },
  { id: 3, name: "Rəşad Quliyev", email: "reshad@example.com", joinDate: "2024-01-13", status: "Bloklanmış" },
]

export default function AdminDashboard() {
  const [newCar, setNewCar] = useState({
    brand: "",
    model: "",
    year: "",
    price: "",
    mileage: "",
    fuel: "",
    transmission: "",
    color: "",
    condition: "",
    description: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setNewCar((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Yeni avtomobil əlavə edildi:", newCar)
    setNewCar({
      brand: "",
      model: "",
      year: "",
      price: "",
      mileage: "",
      fuel: "",
      transmission: "",
      color: "",
      condition: "",
      description: "",
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Shield className="h-8 w-8 text-blue-600" />
              <h1 className="text-xl font-bold">Admin Panel</h1>
            </div>
            <Button variant="outline">Saytı görüntülə</Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="cars">Avtomobillər</TabsTrigger>
            <TabsTrigger value="users">İstifadəçilər</TabsTrigger>
            <TabsTrigger value="add-car">Avtomobil əlavə et</TabsTrigger>
          </TabsList>
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Ümumi avtomobil</CardTitle>
                  <Car className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalCars.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">+12% keçən aydan</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Ümumi istifadəçi</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">+8% keçən aydan</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Ümumi baxış</CardTitle>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">+23% keçən aydan</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Ümumi satış</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalSales}</div>
                  <p className="text-xs text-muted-foreground">+5% keçən aydan</p>
                </CardContent>
              </Card>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Son avtomobillər</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentCars.slice(0, 5).map((car) => (
                      <div key={car.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">
                            {car.brand} {car.model}
                          </p>
                          <p className="text-sm text-gray-600">
                            {car.year} • {car.price.toLocaleString()} ₼
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge
                            variant={
                              car.status === "Aktiv" ? "default" : car.status === "Satıldı" ? "secondary" : "outline"
                            }
                          >
                            {car.status}
                          </Badge>
                          <p className="text-xs text-gray-500 mt-1">{car.views} baxış</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Son istifadəçilər</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentUsers.map((user) => (
                      <div key={user.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant={user.status === "Aktiv" ? "default" : "destructive"}>{user.status}</Badge>
                          <p className="text-xs text-gray-500 mt-1">{user.joinDate}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="cars">
            <Card>
              <CardHeader>
                <CardTitle>Avtomobil idarəetməsi</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Marka/Model</TableHead>
                        <TableHead>İl</TableHead>
                        <TableHead>Qiymət</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Baxış</TableHead>
                        <TableHead>Əməliyyatlar</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentCars.map((car) => (
                        <TableRow key={car.id}>
                          <TableCell>{car.id}</TableCell>
                          <TableCell>
                            {car.brand} {car.model}
                          </TableCell>
                          <TableCell>{car.year}</TableCell>
                          <TableCell>{car.price.toLocaleString()} ₼</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                car.status === "Aktiv" ? "default" : car.status === "Satıldı" ? "secondary" : "outline"
                              }
                            >
                              {car.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{car.views}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>İstifadəçi idarəetməsi</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Ad</TableHead>
                        <TableHead>E-mail</TableHead>
                        <TableHead>Qoşulma tarixi</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Əməliyyatlar</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>{user.id}</TableCell>
                          <TableCell>{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.joinDate}</TableCell>
                          <TableCell>
                            <Badge variant={user.status === "Aktiv" ? "default" : "destructive"}>{user.status}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="add-car">
            <Card>
              <CardHeader>
                <CardTitle>Yeni avtomobil əlavə et</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="brand">Marka</Label>
                      <Select value={newCar.brand} onValueChange={(value) => handleInputChange("brand", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Marka seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="BMW">BMW</SelectItem>
                          <SelectItem value="Mercedes">Mercedes</SelectItem>
                          <SelectItem value="Toyota">Toyota</SelectItem>
                          <SelectItem value="Hyundai">Hyundai</SelectItem>
                          <SelectItem value="Audi">Audi</SelectItem>
                          <SelectItem value="Volkswagen">Volkswagen</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="model">Model</Label>
                      <Input
                        id="model"
                        value={newCar.model}
                        onChange={(e) => handleInputChange("model", e.target.value)}
                        placeholder="Model daxil edin"
                      />
                    </div>

                    <div>
                      <Label htmlFor="year">İl</Label>
                      <Input
                        id="year"
                        type="number"
                        value={newCar.year}
                        onChange={(e) => handleInputChange("year", e.target.value)}
                        placeholder="İl daxil edin"
                      />
                    </div>

                    <div>
                      <Label htmlFor="price">Qiymət (AZN)</Label>
                      <Input
                        id="price"
                        type="number"
                        value={newCar.price}
                        onChange={(e) => handleInputChange("price", e.target.value)}
                        placeholder="Qiymət daxil edin"
                      />
                    </div>

                    <div>
                      <Label htmlFor="mileage">Yürüş (km)</Label>
                      <Input
                        id="mileage"
                        type="number"
                        value={newCar.mileage}
                        onChange={(e) => handleInputChange("mileage", e.target.value)}
                        placeholder="Yürüş daxil edin"
                      />
                    </div>

                    <div>
                      <Label htmlFor="fuel">Yanacaq</Label>
                      <Select value={newCar.fuel} onValueChange={(value) => handleInputChange("fuel", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Yanacaq növü" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Benzin">Benzin</SelectItem>
                          <SelectItem value="Dizel">Dizel</SelectItem>
                          <SelectItem value="Hibrid">Hibrid</SelectItem>
                          <SelectItem value="Elektrik">Elektrik</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="transmission">Transmissiya</Label>
                      <Select
                        value={newCar.transmission}
                        onValueChange={(value) => handleInputChange("transmission", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Transmissiya" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Avtomatik">Avtomatik</SelectItem>
                          <SelectItem value="Mexaniki">Mexaniki</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="color">Rəng</Label>
                      <Input
                        id="color"
                        value={newCar.color}
                        onChange={(e) => handleInputChange("color", e.target.value)}
                        placeholder="Rəng daxil edin"
                      />
                    </div>

                    <div>
                      <Label htmlFor="condition">Vəziyyət</Label>
                      <Select value={newCar.condition} onValueChange={(value) => handleInputChange("condition", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Vəziyyət" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Yeni">Yeni</SelectItem>
                          <SelectItem value="İşlənmiş">İşlənmiş</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Təsvir</Label>
                    <Textarea
                      id="description"
                      value={newCar.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      placeholder="Avtomobil haqqında ətraflı məlumat..."
                      rows={4}
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Avtomobil əlavə et
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
