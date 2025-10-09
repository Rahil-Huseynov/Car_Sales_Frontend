"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Search, MoreHorizontal, Eye, ChevronLeft, ChevronRight, Trash, ScrollText } from "lucide-react"
import { apiClient } from "@/lib/api-client"
import { useDefaultLanguage } from "@/components/useLanguage"
import { translateString } from "@/lib/i18n"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

interface UserCar {
  id: number
  createdAt: string
  updatedAt: string
  brand: string
  model: string
  year: number
  price: number
  mileage: number
  fuel: string
  condition: string
  color: string
  ban: string
  location: string
  engine: string
  gearbox: string
  description: string
  features: string[]
  status: string
  userId: number
  allCarsListId: number
}

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role: string
  createdAt: string
  phoneCode?: string
  phoneNumber?: string
  fatherName?: string
  address?: string
  idSerial?: string
  fin?: string
  passportId?: string
  isForeignCitizen?: boolean
  isActive?: boolean
  position?: string
  userCars?: UserCar[]
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const pageSize = 10
  const { lang, setLang } = useDefaultLanguage();
  const t = (key: string) => translateString(lang, key);

  useEffect(() => {
    loadUsers(currentPage)
  }, [currentPage])

  const loadUsers = async (page: number, search?: string) => {
    try {
      setIsLoading(true);
      const response = await apiClient.getUsers(page, pageSize, search);
      setUsers(response.users || []);
      setTotalPages(response.totalPages || 1);
    } catch (error) {
      console.error("Failed to load users:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm(t("ConfirmDelete"))) {
      try {
        await apiClient.deleteUser(id)
        loadUsers(currentPage)
      } catch (error) {
        console.error("Failed to delete user:", error)
      }
    }
  }

  const openUserDetails = (user: User) => {
    setSelectedUser(user)
    setIsModalOpen(true)
  }

  const filteredUsers = users.filter(
    (user) =>
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const viewCar = (allCarsListId: number) => {
    window.open(`http://localhost:3000/cars/${allCarsListId}`, "_blank")
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4 pt-6">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("SearchPlaceholder")}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  loadUsers(1, e.target.value);
                }}
                className="pl-8"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-100 rounded animate-pulse"></div>
              ))}
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center">{t("FullName")}</TableHead>
                    <TableHead className="text-center">{t("Email")}</TableHead>
                    <TableHead className="text-center">{t("Role")}</TableHead>
                    <TableHead className="text-center">{t("Phone")}</TableHead>
                    <TableHead className="text-center">{t("RegisterDate")}</TableHead>
                    <TableHead className="text-center">{t("Actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="text-center">{user.firstName} {user.lastName}</TableCell>
                      <TableCell className="text-center">{user.email}</TableCell>
                      <TableCell className="text-center">{user.role}</TableCell>
                      <TableCell className="text-center">{user.phoneCode} {user.phoneNumber}</TableCell>
                      <TableCell className="text-center">
                        {new Date(user.createdAt).toLocaleString("az-Latn-AZ", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                          hour12: false,
                          timeZone: "Asia/Baku",
                        })}
                      </TableCell>
                      <TableCell className="text-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost">
                              <span className="sr-only">{t("Actions.OpenMenu")}</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openUserDetails(user)}>
                              <Eye className="h-4 w-4 mr-2" />
                              {t("View")}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(user.id)} className="text-red-600">
                              <Trash className="h-4 w-4 mr-2" />
                              {t("Delete")}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="flex justify-center mt-4 space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  {t("Previous")}
                </Button>
                <div className="text-sm text-gray-600 mt-2">
                  {t("Page")} {currentPage} / {totalPages}
                </div>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  {t("Next")}
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {selectedUser && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl">{selectedUser.firstName} {selectedUser.lastName}</DialogTitle>
            </DialogHeader>
            <ScrollArea className="max-h-[60vh] pr-4">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">{t("Email")}</p>
                    <p className="font-medium">{selectedUser.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t("Role")}</p>
                    <p className="font-medium">{selectedUser.role}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t("Phone")}</p>
                    <p className="font-medium">{selectedUser.phoneCode || ""} {selectedUser.phoneNumber || t("Modal.None")}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t("Register")}</p>
                    <p className="font-medium">
                      {new Date(selectedUser.createdAt).toLocaleString("az-Latn-AZ", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: false,
                        timeZone: "Asia/Baku",
                      })}
                    </p>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <ScrollText className="h-5 w-5 mr-2" />
                    {t("UserCars")}
                  </h3>
                  {selectedUser.userCars && selectedUser.userCars.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{t("BrandModel")}</TableHead>
                          <TableHead>{t("Year")}</TableHead>
                          <TableHead>{t("Price")}</TableHead>
                          <TableHead>{t("Actions")}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedUser.userCars.map((car) => (
                          <TableRow key={car.id}>
                            <TableCell>{car.brand} {car.model}</TableCell>
                            <TableCell>{car.year}</TableCell>
                            <TableCell>{car.price}</TableCell>
                            <TableCell>
                              <Button variant="outline" size="sm" onClick={() => viewCar(car.allCarsListId)}>
                                {t("ViewCar")}
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-muted-foreground">{t("NoCarsFound")}</p>
                  )}
                </div>
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}