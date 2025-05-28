"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Car, Plus, Search, Calendar, Edit, Trash2, CheckCircle } from "lucide-react"
import { DashboardNav } from "@/components/dashboard-nav"
import { UserNav } from "@/components/user-nav"
import { toast } from "@/components/ui/use-toast"

interface Booking {
  id: string
  customer: {
    name: string
    phone: string
    email: string
  }
  vehicle: {
    make: string
    model: string
    year: string
    licensePlate: string
  }
  service: string
  date: string
  time: string
  status: "Confirmed" | "In Progress" | "Completed" | "Cancelled" | "Pending"
  notes?: string
  estimatedDuration: string
  priority: "Low" | "Medium" | "High"
}

const initialBookings: Booking[] = [
  {
    id: "1",
    customer: {
      name: "John Doe",
      phone: "555-123-4567",
      email: "john@example.com",
    },
    vehicle: {
      make: "Toyota",
      model: "Camry",
      year: "2018",
      licensePlate: "ABC123",
    },
    service: "Oil Change",
    date: "2025-05-20",
    time: "10:00",
    status: "Confirmed",
    estimatedDuration: "30 min",
    priority: "Medium",
    notes: "Customer requested synthetic oil",
  },
  {
    id: "2",
    customer: {
      name: "Jane Smith",
      phone: "555-987-6543",
      email: "jane@example.com",
    },
    vehicle: {
      make: "Ford",
      model: "F-150",
      year: "2019",
      licensePlate: "XYZ789",
    },
    service: "Brake Replacement",
    date: "2025-05-20",
    time: "11:30",
    status: "In Progress",
    estimatedDuration: "1.5 hours",
    priority: "High",
    notes: "Front brake pads and rotors",
  },
  {
    id: "3",
    customer: {
      name: "Robert Johnson",
      phone: "555-456-7890",
      email: "robert@example.com",
    },
    vehicle: {
      make: "Chevrolet",
      model: "Malibu",
      year: "2017",
      licensePlate: "DEF456",
    },
    service: "Engine Diagnostics",
    date: "2025-05-20",
    time: "13:00",
    status: "Pending",
    estimatedDuration: "1 hour",
    priority: "Medium",
    notes: "Check engine light on",
  },
  {
    id: "4",
    customer: {
      name: "Emily Davis",
      phone: "555-789-0123",
      email: "emily@example.com",
    },
    vehicle: {
      make: "Nissan",
      model: "Altima",
      year: "2021",
      licensePlate: "GHI789",
    },
    service: "Tire Rotation",
    date: "2025-05-20",
    time: "14:30",
    status: "Confirmed",
    estimatedDuration: "45 min",
    priority: "Low",
  },
  {
    id: "5",
    customer: {
      name: "Michael Brown",
      phone: "555-234-5678",
      email: "michael@example.com",
    },
    vehicle: {
      make: "BMW",
      model: "3 Series",
      year: "2020",
      licensePlate: "JKL012",
    },
    service: "AC Service",
    date: "2025-05-21",
    time: "09:00",
    status: "Confirmed",
    estimatedDuration: "1 hour",
    priority: "Medium",
    notes: "AC not cooling properly",
  },
]

const services = [
  "Oil Change",
  "Brake Replacement",
  "Engine Diagnostics",
  "Tire Rotation",
  "AC Service",
  "Full Inspection",
  "Transmission Service",
  "Battery Replacement",
  "Alternator Replacement",
  "Spark Plug Replacement",
]

export default function BookingsPage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const [bookings, setBookings] = useState<Booking[]>(initialBookings)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [dateFilter, setDateFilter] = useState<string>("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null)
  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    vehicleMake: "",
    vehicleModel: "",
    vehicleYear: "",
    licensePlate: "",
    service: "",
    date: "",
    time: "",
    estimatedDuration: "",
    priority: "Medium" as "Low" | "Medium" | "High",
    notes: "",
  })

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  // Filter bookings
  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.vehicle.licensePlate.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || booking.status === statusFilter

    const today = new Date().toISOString().split("T")[0]
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0]
    const matchesDate =
      dateFilter === "all" ||
      (dateFilter === "today" && booking.date === today) ||
      (dateFilter === "tomorrow" && booking.date === tomorrow) ||
      (dateFilter === "upcoming" && booking.date >= today)

    return matchesSearch && matchesStatus && matchesDate
  })

  const resetForm = () => {
    setFormData({
      customerName: "",
      customerPhone: "",
      customerEmail: "",
      vehicleMake: "",
      vehicleModel: "",
      vehicleYear: "",
      licensePlate: "",
      service: "",
      date: "",
      time: "",
      estimatedDuration: "",
      priority: "Medium",
      notes: "",
    })
  }

  const handleAddBooking = () => {
    if (
      !formData.customerName ||
      !formData.customerPhone ||
      !formData.vehicleMake ||
      !formData.vehicleModel ||
      !formData.service ||
      !formData.date ||
      !formData.time
    ) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const newBooking: Booking = {
      id: Date.now().toString(),
      customer: {
        name: formData.customerName,
        phone: formData.customerPhone,
        email: formData.customerEmail,
      },
      vehicle: {
        make: formData.vehicleMake,
        model: formData.vehicleModel,
        year: formData.vehicleYear,
        licensePlate: formData.licensePlate,
      },
      service: formData.service,
      date: formData.date,
      time: formData.time,
      status: "Pending",
      estimatedDuration: formData.estimatedDuration,
      priority: formData.priority,
      notes: formData.notes,
    }

    setBookings([...bookings, newBooking])
    setIsAddDialogOpen(false)
    resetForm()
    toast({
      title: "Success",
      description: "Booking created successfully",
    })
  }

  const handleEditBooking = () => {
    if (!editingBooking) return

    if (
      !formData.customerName ||
      !formData.customerPhone ||
      !formData.vehicleMake ||
      !formData.vehicleModel ||
      !formData.service ||
      !formData.date ||
      !formData.time
    ) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const updatedBooking: Booking = {
      ...editingBooking,
      customer: {
        name: formData.customerName,
        phone: formData.customerPhone,
        email: formData.customerEmail,
      },
      vehicle: {
        make: formData.vehicleMake,
        model: formData.vehicleModel,
        year: formData.vehicleYear,
        licensePlate: formData.licensePlate,
      },
      service: formData.service,
      date: formData.date,
      time: formData.time,
      estimatedDuration: formData.estimatedDuration,
      priority: formData.priority,
      notes: formData.notes,
    }

    setBookings(bookings.map((booking) => (booking.id === editingBooking.id ? updatedBooking : booking)))
    setIsEditDialogOpen(false)
    setEditingBooking(null)
    resetForm()
    toast({
      title: "Success",
      description: "Booking updated successfully",
    })
  }

  const handleDeleteBooking = (bookingId: string) => {
    if (!confirm("Are you sure you want to delete this booking?")) return

    setBookings(bookings.filter((booking) => booking.id !== bookingId))
    toast({
      title: "Success",
      description: "Booking deleted successfully",
    })
  }

  const handleStatusChange = (bookingId: string, newStatus: Booking["status"]) => {
    setBookings(bookings.map((booking) => (booking.id === bookingId ? { ...booking, status: newStatus } : booking)))
    toast({
      title: "Success",
      description: `Booking status updated to ${newStatus}`,
    })
  }

  const openEditDialog = (booking: Booking) => {
    setEditingBooking(booking)
    setFormData({
      customerName: booking.customer.name,
      customerPhone: booking.customer.phone,
      customerEmail: booking.customer.email,
      vehicleMake: booking.vehicle.make,
      vehicleModel: booking.vehicle.model,
      vehicleYear: booking.vehicle.year,
      licensePlate: booking.vehicle.licensePlate,
      service: booking.service,
      date: booking.date,
      time: booking.time,
      estimatedDuration: booking.estimatedDuration,
      priority: booking.priority,
      notes: booking.notes || "",
    })
    setIsEditDialogOpen(true)
  }

  const openAddDialog = () => {
    resetForm()
    setIsAddDialogOpen(true)
  }

  const getStatusColor = (status: Booking["status"]) => {
    switch (status) {
      case "Confirmed":
        return "bg-blue-100 text-blue-800"
      case "In Progress":
        return "bg-yellow-100 text-yellow-800"
      case "Completed":
        return "bg-green-100 text-green-800"
      case "Cancelled":
        return "bg-red-100 text-red-800"
      case "Pending":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: Booking["priority"]) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "Low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

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
            <div className="flex items-center gap-2">
              <Calendar className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold tracking-tight">Booking Management</h1>
            </div>
            <Button onClick={openAddDialog}>
              <Plus className="mr-2 h-4 w-4" />
              Create Booking
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Service Appointments</CardTitle>
              <CardDescription>Manage your service bookings and appointments.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col lg:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search bookings..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full lg:w-[150px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Confirmed">Confirmed</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger className="w-full lg:w-[150px]">
                    <SelectValue placeholder="Date" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Dates</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="tomorrow">Tomorrow</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Vehicle</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBookings.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8">
                          <p className="text-muted-foreground">No bookings found</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredBookings.map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{booking.customer.name}</div>
                              <div className="text-sm text-muted-foreground">{booking.customer.phone}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">
                                {booking.vehicle.year} {booking.vehicle.make} {booking.vehicle.model}
                              </div>
                              <div className="text-sm text-muted-foreground">{booking.vehicle.licensePlate}</div>
                            </div>
                          </TableCell>
                          <TableCell>{booking.service}</TableCell>
                          <TableCell>
                            <div>
                              <div>{new Date(booking.date).toLocaleDateString()}</div>
                              <div className="text-sm text-muted-foreground">{booking.time}</div>
                            </div>
                          </TableCell>
                          <TableCell>{booking.estimatedDuration}</TableCell>
                          <TableCell>
                            <Badge className={getPriorityColor(booking.priority)}>{booking.priority}</Badge>
                          </TableCell>
                          <TableCell>
                            <Select
                              value={booking.status}
                              onValueChange={(value) => handleStatusChange(booking.id, value as Booking["status"])}
                            >
                              <SelectTrigger className="w-[130px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Pending">Pending</SelectItem>
                                <SelectItem value="Confirmed">Confirmed</SelectItem>
                                <SelectItem value="In Progress">In Progress</SelectItem>
                                <SelectItem value="Completed">Completed</SelectItem>
                                <SelectItem value="Cancelled">Cancelled</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon" onClick={() => openEditDialog(booking)}>
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleDeleteBooking(booking.id)}>
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                              {booking.status === "Completed" && (
                                <Button variant="ghost" size="icon" asChild>
                                  <Link href={`/invoices/create?bookingId=${booking.id}`}>
                                    <CheckCircle className="h-4 w-4" />
                                    <span className="sr-only">Create Invoice</span>
                                  </Link>
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Add Booking Dialog */}
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Booking</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="customerName">Customer Name *</Label>
                    <Input
                      id="customerName"
                      value={formData.customerName}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                      placeholder="Enter customer name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customerPhone">Phone *</Label>
                    <Input
                      id="customerPhone"
                      value={formData.customerPhone}
                      onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customerEmail">Email</Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    value={formData.customerEmail}
                    onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                    placeholder="Enter email address"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="vehicleMake">Vehicle Make *</Label>
                    <Input
                      id="vehicleMake"
                      value={formData.vehicleMake}
                      onChange={(e) => setFormData({ ...formData, vehicleMake: e.target.value })}
                      placeholder="e.g., Toyota"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vehicleModel">Model *</Label>
                    <Input
                      id="vehicleModel"
                      value={formData.vehicleModel}
                      onChange={(e) => setFormData({ ...formData, vehicleModel: e.target.value })}
                      placeholder="e.g., Camry"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vehicleYear">Year</Label>
                    <Input
                      id="vehicleYear"
                      value={formData.vehicleYear}
                      onChange={(e) => setFormData({ ...formData, vehicleYear: e.target.value })}
                      placeholder="e.g., 2020"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="licensePlate">License Plate</Label>
                  <Input
                    id="licensePlate"
                    value={formData.licensePlate}
                    onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value })}
                    placeholder="Enter license plate"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="service">Service *</Label>
                  <Select
                    value={formData.service}
                    onValueChange={(value) => setFormData({ ...formData, service: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select service" />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((service) => (
                        <SelectItem key={service} value={service}>
                          {service}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Time *</Label>
                    <Input
                      id="time"
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="estimatedDuration">Estimated Duration</Label>
                    <Input
                      id="estimatedDuration"
                      value={formData.estimatedDuration}
                      onChange={(e) => setFormData({ ...formData, estimatedDuration: e.target.value })}
                      placeholder="e.g., 1 hour, 30 min"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select
                      value={formData.priority}
                      onValueChange={(value) =>
                        setFormData({ ...formData, priority: value as "Low" | "Medium" | "High" })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Additional notes or special instructions"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddBooking}>Create Booking</Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Edit Booking Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Booking</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-customerName">Customer Name *</Label>
                    <Input
                      id="edit-customerName"
                      value={formData.customerName}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                      placeholder="Enter customer name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-customerPhone">Phone *</Label>
                    <Input
                      id="edit-customerPhone"
                      value={formData.customerPhone}
                      onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-customerEmail">Email</Label>
                  <Input
                    id="edit-customerEmail"
                    type="email"
                    value={formData.customerEmail}
                    onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                    placeholder="Enter email address"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-vehicleMake">Vehicle Make *</Label>
                    <Input
                      id="edit-vehicleMake"
                      value={formData.vehicleMake}
                      onChange={(e) => setFormData({ ...formData, vehicleMake: e.target.value })}
                      placeholder="e.g., Toyota"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-vehicleModel">Model *</Label>
                    <Input
                      id="edit-vehicleModel"
                      value={formData.vehicleModel}
                      onChange={(e) => setFormData({ ...formData, vehicleModel: e.target.value })}
                      placeholder="e.g., Camry"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-vehicleYear">Year</Label>
                    <Input
                      id="edit-vehicleYear"
                      value={formData.vehicleYear}
                      onChange={(e) => setFormData({ ...formData, vehicleYear: e.target.value })}
                      placeholder="e.g., 2020"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-licensePlate">License Plate</Label>
                  <Input
                    id="edit-licensePlate"
                    value={formData.licensePlate}
                    onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value })}
                    placeholder="Enter license plate"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-service">Service *</Label>
                  <Select
                    value={formData.service}
                    onValueChange={(value) => setFormData({ ...formData, service: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select service" />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((service) => (
                        <SelectItem key={service} value={service}>
                          {service}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-date">Date *</Label>
                    <Input
                      id="edit-date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-time">Time *</Label>
                    <Input
                      id="edit-time"
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-estimatedDuration">Estimated Duration</Label>
                    <Input
                      id="edit-estimatedDuration"
                      value={formData.estimatedDuration}
                      onChange={(e) => setFormData({ ...formData, estimatedDuration: e.target.value })}
                      placeholder="e.g., 1 hour, 30 min"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-priority">Priority</Label>
                    <Select
                      value={formData.priority}
                      onValueChange={(value) =>
                        setFormData({ ...formData, priority: value as "Low" | "Medium" | "High" })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-notes">Notes</Label>
                  <Textarea
                    id="edit-notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Additional notes or special instructions"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleEditBooking}>Update Booking</Button>
              </div>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  )
}
