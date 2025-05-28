"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Car, Plus, Search, Edit, Trash2, Loader2 } from "lucide-react"
import { DashboardNav } from "@/components/dashboard-nav"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { UserNav } from "@/components/user-nav"
import { useToast } from "@/hooks/use-toast"
import type { Vehicle } from "@/lib/models/vehicle"
import type { Customer } from "@/lib/models/customer"

export default function VehiclesPage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null)
  const [formData, setFormData] = useState({
    customerId: "",
    make: "",
    model: "",
    year: "",
    licensePlate: "",
  })
  const [submitting, setSubmitting] = useState(false)

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  // Fetch vehicles and customers
  const fetchData = async () => {
    try {
      setLoading(true)
      const [vehiclesResponse, customersResponse] = await Promise.all([fetch("/api/vehicles"), fetch("/api/customers")])

      if (!vehiclesResponse.ok) throw new Error("Failed to fetch vehicles")
      if (!customersResponse.ok) throw new Error("Failed to fetch customers")

      const vehiclesData = await vehiclesResponse.json()
      const customersData = await customersResponse.json()

      setVehicles(vehiclesData)
      setCustomers(customersData)
    } catch (error) {
      console.error("Error fetching data:", error)
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchData()
    }
  }, [isAuthenticated])

  // Get customer name by ID
  const getCustomerName = (customerId: string) => {
    const customer = customers.find((c) => c.id === customerId)
    return customer ? customer.name : "Unknown Customer"
  }

  // Handle form submission for adding vehicle
  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const response = await fetch("/api/vehicles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error("Failed to create vehicle")

      toast({
        title: "Success",
        description: "Vehicle added successfully",
      })

      setIsAddDialogOpen(false)
      setFormData({ customerId: "", make: "", model: "", year: "", licensePlate: "" })
      fetchData()
    } catch (error) {
      console.error("Error adding vehicle:", error)
      toast({
        title: "Error",
        description: "Failed to add vehicle",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  // Handle form submission for editing vehicle
  const handleEditVehicle = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingVehicle) return

    setSubmitting(true)

    try {
      const response = await fetch(`/api/vehicles/${editingVehicle.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error("Failed to update vehicle")

      toast({
        title: "Success",
        description: "Vehicle updated successfully",
      })

      setIsEditDialogOpen(false)
      setEditingVehicle(null)
      setFormData({ customerId: "", make: "", model: "", year: "", licensePlate: "" })
      fetchData()
    } catch (error) {
      console.error("Error updating vehicle:", error)
      toast({
        title: "Error",
        description: "Failed to update vehicle",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  // Handle delete vehicle
  const handleDeleteVehicle = async (vehicle: Vehicle) => {
    if (!confirm(`Are you sure you want to delete ${vehicle.make} ${vehicle.model}?`)) return

    try {
      const response = await fetch(`/api/vehicles/${vehicle.id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete vehicle")

      toast({
        title: "Success",
        description: "Vehicle deleted successfully",
      })

      fetchData()
    } catch (error) {
      console.error("Error deleting vehicle:", error)
      toast({
        title: "Error",
        description: "Failed to delete vehicle",
        variant: "destructive",
      })
    }
  }

  // Open edit dialog
  const openEditDialog = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle)
    setFormData({
      customerId: vehicle.customerId,
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      licensePlate: vehicle.licensePlate,
    })
    setIsEditDialogOpen(true)
  }

  // Filter vehicles based on search term
  const filteredVehicles = vehicles.filter(
    (vehicle) =>
      vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getCustomerName(vehicle.customerId).toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Car className="h-6 w-6" />
          <span>PRABATH MOTORS</span>
        </Link>
        <nav className="ml-auto flex gap-2">
          <UserNav />
        </nav>
      </header>
      <div className="flex flex-1">
        <DashboardNav />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-tight">Vehicles</h1>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Vehicle
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Vehicle</DialogTitle>
                  <DialogDescription>Enter the vehicle details below.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddVehicle}>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="customer">Customer</Label>
                      <Select
                        value={formData.customerId}
                        onValueChange={(value) => setFormData({ ...formData, customerId: value })}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a customer" />
                        </SelectTrigger>
                        <SelectContent>
                          {customers.map((customer) => (
                            <SelectItem key={customer.id} value={customer.id}>
                              {customer.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="make">Make</Label>
                      <Input
                        id="make"
                        value={formData.make}
                        onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                        placeholder="e.g., Toyota"
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="model">Model</Label>
                      <Input
                        id="model"
                        value={formData.model}
                        onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                        placeholder="e.g., Camry"
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="year">Year</Label>
                      <Input
                        id="year"
                        value={formData.year}
                        onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                        placeholder="e.g., 2020"
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="licensePlate">License Plate</Label>
                      <Input
                        id="licensePlate"
                        value={formData.licensePlate}
                        onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value })}
                        placeholder="e.g., ABC-123"
                        required
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" disabled={submitting}>
                      {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Add Vehicle
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Vehicle Management</CardTitle>
              <CardDescription>Manage customer vehicles and their information.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search vehicles..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Vehicle</TableHead>
                      <TableHead>Year</TableHead>
                      <TableHead>License Plate</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredVehicles.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          {searchTerm
                            ? "No vehicles found matching your search."
                            : "No vehicles found. Add your first vehicle to get started."}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredVehicles.map((vehicle) => (
                        <TableRow key={vehicle.id}>
                          <TableCell className="font-medium">
                            {vehicle.make} {vehicle.model}
                          </TableCell>
                          <TableCell>{vehicle.year}</TableCell>
                          <TableCell>{vehicle.licensePlate}</TableCell>
                          <TableCell>{getCustomerName(vehicle.customerId)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm" onClick={() => openEditDialog(vehicle)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => handleDeleteVehicle(vehicle)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Edit Vehicle Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Vehicle</DialogTitle>
                <DialogDescription>Update the vehicle details below.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleEditVehicle}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-customer">Customer</Label>
                    <Select
                      value={formData.customerId}
                      onValueChange={(value) => setFormData({ ...formData, customerId: value })}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a customer" />
                      </SelectTrigger>
                      <SelectContent>
                        {customers.map((customer) => (
                          <SelectItem key={customer.id} value={customer.id}>
                            {customer.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-make">Make</Label>
                    <Input
                      id="edit-make"
                      value={formData.make}
                      onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-model">Model</Label>
                    <Input
                      id="edit-model"
                      value={formData.model}
                      onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-year">Year</Label>
                    <Input
                      id="edit-year"
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-licensePlate">License Plate</Label>
                    <Input
                      id="edit-licensePlate"
                      value={formData.licensePlate}
                      onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={submitting}>
                    {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Update Vehicle
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  )
}
