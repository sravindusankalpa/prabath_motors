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
import { Car, Plus, Search, Edit, Trash2, Wrench } from "lucide-react"
import { DashboardNav } from "@/components/dashboard-nav"
import { UserNav } from "@/components/user-nav"
import { toast } from "@/components/ui/use-toast"

interface Service {
  id: string
  name: string
  description: string
  category: string
  duration: string
  price: number
  isActive: boolean
}

const initialServices: Service[] = [
  {
    id: "1",
    name: "Oil Change",
    description: "Standard oil change with filter replacement",
    duration: "30 min",
    price: 45.0,
    category: "Maintenance",
    isActive: true,
  },
  {
    id: "2",
    name: "Brake Replacement",
    description: "Front or rear brake pad replacement",
    duration: "1.5 hours",
    price: 250.0,
    category: "Repair",
    isActive: true,
  },
  {
    id: "3",
    name: "Engine Diagnostics",
    description: "Computer diagnostics for engine issues",
    duration: "1 hour",
    price: 120.0,
    category: "Diagnostics",
    isActive: true,
  },
  {
    id: "4",
    name: "Tire Rotation",
    description: "Rotate and balance all tires",
    duration: "45 min",
    price: 75.0,
    category: "Maintenance",
    isActive: true,
  },
  {
    id: "5",
    name: "AC Service",
    description: "Air conditioning system check and recharge",
    duration: "1 hour",
    price: 180.0,
    category: "Repair",
    isActive: true,
  },
  {
    id: "6",
    name: "Full Inspection",
    description: "Comprehensive vehicle inspection",
    duration: "2 hours",
    price: 150.0,
    category: "Diagnostics",
    isActive: true,
  },
  {
    id: "7",
    name: "Transmission Fluid Change",
    description: "Drain and replace transmission fluid",
    duration: "1.5 hours",
    price: 220.0,
    category: "Maintenance",
    isActive: true,
  },
  {
    id: "8",
    name: "Battery Replacement",
    description: "Replace and install new battery",
    duration: "30 min",
    price: 150.0,
    category: "Repair",
    isActive: true,
  },
  {
    id: "9",
    name: "Alternator Replacement",
    description: "Replace faulty alternator",
    duration: "2 hours",
    price: 350.0,
    category: "Repair",
    isActive: true,
  },
  {
    id: "10",
    name: "Spark Plug Replacement",
    description: "Replace spark plugs",
    duration: "1 hour",
    price: 120.0,
    category: "Maintenance",
    isActive: true,
  },
  {
    id: "11",
    name: "Wheel Alignment",
    description: "Four-wheel alignment service",
    duration: "1 hour",
    price: 90.0,
    category: "Maintenance",
    isActive: true,
  },
]

const categories = ["Maintenance", "Repair", "Diagnostics", "Inspection", "Parts"]

export default function ServicesPage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const [services, setServices] = useState<Service[]>(initialServices)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    duration: "",
    price: 0,
  })

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  // Filter services
  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || service.category === categoryFilter
    return matchesSearch && matchesCategory && service.isActive
  })

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      category: "",
      duration: "",
      price: 0,
    })
  }

  const handleAddService = () => {
    if (!formData.name || !formData.description || !formData.category || !formData.duration || formData.price <= 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    const newService: Service = {
      id: Date.now().toString(),
      ...formData,
      isActive: true,
    }

    setServices([...services, newService])
    setIsAddDialogOpen(false)
    resetForm()
    toast({
      title: "Success",
      description: "Service added successfully",
    })
  }

  const handleEditService = () => {
    if (!editingService) return

    if (!formData.name || !formData.description || !formData.category || !formData.duration || formData.price <= 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    setServices(services.map((service) => (service.id === editingService.id ? { ...service, ...formData } : service)))

    setIsEditDialogOpen(false)
    setEditingService(null)
    resetForm()
    toast({
      title: "Success",
      description: "Service updated successfully",
    })
  }

  const handleDeleteService = (serviceId: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return

    setServices(services.map((service) => (service.id === serviceId ? { ...service, isActive: false } : service)))

    toast({
      title: "Success",
      description: "Service deleted successfully",
    })
  }

  const openEditDialog = (service: Service) => {
    setEditingService(service)
    setFormData({
      name: service.name,
      description: service.description,
      category: service.category,
      duration: service.duration,
      price: service.price,
    })
    setIsEditDialogOpen(true)
  }

  const openAddDialog = () => {
    resetForm()
    setIsAddDialogOpen(true)
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
              <Wrench className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold tracking-tight">Service Management</h1>
            </div>
            <Button onClick={openAddDialog}>
              <Plus className="mr-2 h-4 w-4" />
              Add Service
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Services & Pricing</CardTitle>
              <CardDescription>Manage your garage services, pricing, and categories.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search services..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Service Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredServices.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          <p className="text-muted-foreground">No services found</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredServices.map((service) => (
                        <TableRow key={service.id}>
                          <TableCell className="font-medium">{service.name}</TableCell>
                          <TableCell className="max-w-xs truncate">{service.description}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{service.category}</Badge>
                          </TableCell>
                          <TableCell>{service.duration}</TableCell>
                          <TableCell className="font-medium">${service.price.toFixed(2)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon" onClick={() => openEditDialog(service)}>
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleDeleteService(service.id)}>
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
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

          {/* Add Service Dialog */}
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Service</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Service Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter service name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter service description"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="e.g., 1 hour, 30 min"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number.parseFloat(e.target.value) || 0 })}
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddService}>Add Service</Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Edit Service Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit Service</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Service Name</Label>
                  <Input
                    id="edit-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter service name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter service description"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-duration">Duration</Label>
                  <Input
                    id="edit-duration"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="e.g., 1 hour, 30 min"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-price">Price ($)</Label>
                  <Input
                    id="edit-price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number.parseFloat(e.target.value) || 0 })}
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleEditService}>Update Service</Button>
              </div>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  )
}
