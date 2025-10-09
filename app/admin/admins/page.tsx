// app/admins/page.tsx  (və ya components/AdminsPage.tsx)
"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Search,
  MoreHorizontal,
  UserPlus,
  Edit,
  Trash2,
  EyeOff,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useDefaultLanguage } from "@/components/useLanguage";
import { translateString } from "@/lib/i18n";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export interface AdminType {
  id: string
  firstName: string
  lastName: string
  email: string
  role: "admin" | "superadmin" | string
  password?: string
}


export default function AdminsPage() {
  const [users, setUsers] = useState<AdminType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [loadingEditSubmit, setLoadingEditSubmit] = useState(false);
  const { user } = useAuth();
  const router = useRouter();
  const { lang } = useDefaultLanguage();
  const t = (key: string) => translateString(lang, key);
  const searchTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (user && user.role !== "superadmin") {
      router.push(`/admin/dashboard`);
    }
  }, [user]);

  const [newAdmin, setNewAdmin] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "admin",
  });

  const [editAdmin, setEditAdmin] = useState<AdminType | null>(null);

  const loadUsers = async (page = currentPage, search = searchTerm) => {
    try {
      setIsLoading(true);
      const { users: fetchedUsers, totalPages: tp } = await apiClient.getAdmins(currentPage, searchTerm);
      setUsers(fetchedUsers);
      setTotalPages(tp);
    } catch (error: any) {
      console.error(t("FailedToLoadUsers"), error);
      toast.error(t("FailedToLoadUsers"));
    } finally {
      setIsLoading(false);
    }
  };

  // debounce when typing
  useEffect(() => {
    if (searchTimeoutRef.current) {
      window.clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = window.setTimeout(() => {
      setCurrentPage(1);
      loadUsers(1, searchTerm);
    }, 500);

    return () => {
      if (searchTimeoutRef.current) {
        window.clearTimeout(searchTimeoutRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  // load when page changes
  useEffect(() => {
    loadUsers(currentPage, searchTerm);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  // initial load
  useEffect(() => {
    loadUsers(1, "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDeleteUser = async (userId: string) => {
    if (confirm(t("ConfirmDeleteAdmin"))) {
      try {
        await apiClient.deleteAdmin(userId);
        toast.success(t("AdminDeletedSuccessfully"));
        // if current page becomes empty after deletion, ensure page doesn't exceed totalPages
        const newTotalPages = Math.max(1, totalPages);
        if (currentPage > newTotalPages) setCurrentPage(newTotalPages);
        await loadUsers(currentPage, searchTerm);
      } catch (error) {
        toast.error(t("FailedToDeleteAdmin"));
        console.error(t("FailedToDeleteAdmin"), error);
      }
    }
  };

  const openEditModal = (admin: AdminType) => {
    setEditAdmin(admin);
    setIsEditModalOpen(true);
  };

  const handleNewAdminChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewAdmin((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditAdminChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (editAdmin) {
      setEditAdmin({ ...editAdmin, [name]: value } as AdminType);
    }
  };

  const handleSubmitNewAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingSubmit(true);

    try {
      const formData = new FormData();
      Object.entries(newAdmin).forEach(([key, value]) =>
        formData.append(key, value as string)
      );

      await apiClient.addAdmin(formData);

      toast.success(t("AdminAddedSuccessfully"));
      setNewAdmin({ firstName: "", lastName: "", email: "", password: "", role: "admin" });
      setIsAddModalOpen(false);
      loadUsers(1, searchTerm);
    } catch (error: any) {
      toast.error(t("ErrorOccurred") + ": " + (error.message || error.toString()));
      console.error(error);
    } finally {
      setLoadingSubmit(false);
    }
  };

  const handleSubmitEditAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editAdmin) return;
    setLoadingEditSubmit(true);

    try {
      // send only allowed fields
      const payload: any = {
        id: editAdmin.id,
        firstName: editAdmin.firstName,
        lastName: editAdmin.lastName,
        email: editAdmin.email,
        role: editAdmin.role,
      };
      if (editAdmin.password) payload.password = editAdmin.password;

      await apiClient.updateAdmin(payload);

      toast.success(t("AdminUpdatedSuccessfully"));
      setIsEditModalOpen(false);
      setEditAdmin(null);
      loadUsers(currentPage, searchTerm);
    } catch (error: any) {
      toast.error(t("ErrorOccurred") + ": " + (error.message || error.toString()));
      console.error(error);
    } finally {
      setLoadingEditSubmit(false);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "superadmin":
        return "bg-red-500 text-white";
      case "admin":
        return "bg-blue-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case "superadmin":
        return t("SuperAdmin");
      case "admin":
        return t("Admin");
      default:
        return role;
    }
  };

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t("Admins")}</h1>
          <p className="text-gray-600 mt-1">{t("ManageSystemAdmins")}</p>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              <UserPlus className="h-4 w-4 mr-2" />
              {t("AddNewAdmin")}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{t("AddNewAdmin")}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmitNewAdmin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">{t("FirstName")}</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={newAdmin.firstName}
                  onChange={handleNewAdminChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">{t("LastName")}</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={newAdmin.lastName}
                  onChange={handleNewAdminChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">{t("Email")}</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={newAdmin.email}
                  onChange={handleNewAdminChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{t("Password")}</Label>
                <PasswordInput
                  id="password"
                  name="password"
                  value={newAdmin.password}
                  onChange={handleNewAdminChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">{t("Role")}</Label>
                <select
                  id="role"
                  name="role"
                  value={newAdmin.role}
                  onChange={handleNewAdminChange}
                  className="w-full border border-gray-300 rounded-md h-10 px-3 bg-white"
                  required
                >
                  <option value="admin">{t("Admin")}</option>
                  <option value="superadmin">{t("SuperAdmin")}</option>
                </select>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={loadingSubmit}>
                  {loadingSubmit ? t("Submitting") : t("Add")}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="shadow-lg">
        <CardHeader className="bg-indigo-50">
          <CardTitle className="text-indigo-800">{t("AdminsList")}</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center space-x-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder={t("SearchUser")}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    if (searchTimeoutRef.current) {
                      window.clearTimeout(searchTimeoutRef.current);
                    }
                    setCurrentPage(1);
                    loadUsers(1, (e.target as HTMLInputElement).value);
                  }
                }}
                className="pl-10 border-indigo-200 focus:border-indigo-500"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-16 bg-indigo-50 rounded-lg animate-pulse"
                ></div>
              ))}
            </div>
          ) : users.length === 0 ? (
            <p className="text-center text-gray-500">{t("NoAdminsFound")}</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-indigo-50">
                    <TableHead className="text-center font-semibold text-indigo-800">{t("FullName")}</TableHead>
                    <TableHead className="text-center font-semibold text-indigo-800">{t("Email")}</TableHead>
                    <TableHead className="text-center font-semibold text-indigo-800">{t("Role")}</TableHead>
                    <TableHead className="text-center font-semibold text-indigo-800">{t("Operations")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((admin) => (
                    <TableRow key={admin.id} className="hover:bg-indigo-50 transition-colors">
                      <TableCell className="text-center">
                        {admin.firstName} {admin.lastName}
                      </TableCell>
                      <TableCell className="text-center">{admin.email}</TableCell>
                      <TableCell className="text-center">
                        <Badge className={`${getRoleBadgeColor(admin.role)} px-3 py-1`}>
                          {getRoleText(admin.role)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" aria-label={t("MoreActions")}>
                              <MoreHorizontal className="h-5 w-5 text-indigo-600" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="shadow-md">
                            <DropdownMenuItem onClick={() => openEditModal(admin)} className="text-indigo-600">
                              <Edit className="h-4 w-4 mr-2" />
                              {t("Edit")}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteUser(admin.id)} className="text-red-600">
                              <Trash2 className="h-4 w-4 mr-2" />
                              {t("Delete")}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-6 space-x-2">
          <Button
            variant="outline"
            size="icon"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="border-indigo-200 text-indigo-600"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-sm text-gray-600">
            {t("Page")} {currentPage} {t("of")} {totalPages}
          </div>
          <Button
            variant="outline"
            size="icon"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="border-indigo-200 text-indigo-600"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("EditAdmin")}</DialogTitle>
          </DialogHeader>
          {editAdmin && (
            <form onSubmit={handleSubmitEditAdmin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">{t("FirstName")}</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={editAdmin.firstName}
                  onChange={handleEditAdminChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">{t("LastName")}</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={editAdmin.lastName}
                  onChange={handleEditAdminChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">{t("Email")}</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={editAdmin.email}
                  onChange={handleEditAdminChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{t("Password")} ({t("Optional")})</Label>
                <PasswordInput
                  id="password"
                  name="password"
                  value={editAdmin.password || ""}
                  onChange={handleEditAdminChange}
                  placeholder={t("EnterToChangePassword")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">{t("Role")}</Label>
                <select
                  id="role"
                  name="role"
                  value={editAdmin.role}
                  onChange={handleEditAdminChange}
                  className="w-full border border-gray-300 rounded-md h-10 px-3 bg-white"
                  required
                >
                  <option value="admin">{t("Admin")}</option>
                  <option value="superadmin">{t("SuperAdmin")}</option>
                </select>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={loadingEditSubmit}>
                  {loadingEditSubmit ? t("Submitting") : t("Update")}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function PasswordInput({
  id,
  name,
  value,
  onChange,
  required,
  placeholder,
}: {
  id: string;
  name: string;
  value: string;
  onChange: any;
  required?: boolean;
  placeholder?: string;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const { lang } = useDefaultLanguage();
  const t = (key: string) => translateString(lang, key);

  return (
    <div className="relative">
      <Input
        id={id}
        name={name}
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
        required={required}
        minLength={6}
        placeholder={placeholder}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute right-0 top-0 h-full px-3 text-gray-500"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </Button>
    </div>
  );
}
