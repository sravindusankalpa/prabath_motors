"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Car, Plus, Trash2, ArrowLeft, Save, Search } from "lucide-react"
import { DashboardNav } from "@/components/dashboard-nav"
import { UserNav } from "@/components/user-nav"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "@/components/ui/use-toast"
import { useApi, apiRequest } from "@/lib/hooks/use-api"
import type { Customer } from "@/lib/models/customer"
import type { Vehicle } from "@/lib/models/vehicle"
import type { Invoice } from "@/lib/models/invoice"
import { use } from "react"

// Mock service data (same as create page)
const servicesList = [
  {
    id: "s1",
    name: "Oil Change",
    description: "Standard oil change with filter replacement",
    price: 45.0,
    category: "Maintenance",
  },
  {
    id: "s2",
    name: "Oil Filter",
    description: "Replacement oil filter",
    price: 15.0,
    category: "Parts",
  },
  {
    id: "s3",
    name: "Brake Replacement (Front)",
    description: "Front brake pad replacement",
    price: 180.0,
    category: "Repair",
  },
  {
    id: "s4",
    name: "Brake Pads",
    description: "High-quality brake pads",
    price: 70.0,
    category: "Parts",
  },
  {
    id: "s5",
    name: "Engine Diagnostics",
    description: "Computer diagnostics for engine issues",
    price: 120.0,
    category: "Diagnostics",
  },
  {
    id: "s6",
    name: "Tire Rotation",
    description: "Rotate and balance all tires",
    price: 75.0,
    category: "Maintenance",
  },
  {
    id: "s7",
    name: "AC Service",
    description: "Air conditioning system check and recharge",
    price: 180.0,
    category: "Repair",
  },
  {
    id: "s8",
    name: "Refrigerant",
    description: "AC refrigerant refill",
    price: 45.0,
    category: "Parts",
  },
  {
    id: "s9",
    name: "Full Inspection",
    description: "Comprehensive vehicle inspection",
    price: 150.0,
    category: "Diagnostics",
  },
  {
    id: "s10",
    name: "Transmission Fluid Change",
    description: "Drain and replace transmission fluid",
    price: 220.0,
    category: "Maintenance",
  },
  {
    id: "s11",
    name: "Transmission Fluid",
    description: "High-quality transmission fluid",
    price: 65.0,
    category: "Parts",
  },
  {
    id: "s12",
    name: "Air Filter Replacement",
    description: "Replace engine air filter",
    price: 25.0,
    category: "Maintenance",
  },
  {
    id: "s13",
    name: "Labor - Standard Service",
    description: "Standard labor rate per hour",
    price: 80.0,
    category: "Labor",
  },
  {
    id: "s14",
    name: "Labor - Complex Service",
    description: "Complex repair labor rate per hour",
    price: 95.0,
    category: "Labor",
  },
  {
    id: "s15",
    name: "Battery Replacement",
    description: "Replace and install new battery",
    price: 150.0,
    category: "Repair",
  },
  {
    id: "s16",
    name: "Alternator Replacement",
    description: "Replace faulty alternator",
    price: 350.0,
    category: "Repair",
  },
  {
    id: "s17",
    name: "Spark Plug Replacement",
    description: "Replace spark plugs",
    price: 120.0,
    category: "Maintenance",
  },
  {
    id: "s18",
    name: "Wheel Alignment",
    description: "Four-wheel alignment service",
    price: 90.0,
    category: "Maintenance",
  },
]

interface EditInvoicePageProps {
  params: Promise<{
    id: string
  }>
}

export default function EditInvoicePage({ params }: EditInvoicePageProps) {
  const resolvedParams = use(params)
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredServices, setFilteredServices] = useState(servicesList)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [serviceDialogOpen, setServiceDialogOpen] = useState(false)

  // Fetch invoice, customers and vehicles from API
  const {
    data: invoice,
    loading: invoiceLoading,
    error: invoiceError,
  } = useApi<Invoice>(`/api/invoices/${resolvedParams.id}`)
  const { data: customers, loading: customersLoading } = useApi<Customer[]>("/api/customers")
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [vehiclesLoading, setVehiclesLoading] = useState(false)

  const [formData, setFormData] = useState({
    customerId: "",
    vehicleId: "",
    date: "",
    dueDate: "",
    items: [{ description: "", quantity: 1, unitPrice: 0 }],
    notes: "",
    taxRate: 8,
    status: "Pending" as "Pending" | "Paid" | "Overdue" | "Cancelled",
  })

  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  // Populate form data when invoice is loaded
  useEffect(() => {
    if (invoice) {
      setFormData({
        customerId: invoice.customer.id,
        vehicleId: invoice.vehicle.id,
        date: invoice.date,
        dueDate: invoice.dueDate,
        items: invoice.items,
        notes: invoice.notes || "",
        taxRate: invoice.taxRate,
        status: invoice.status,
      })
    }
  }, [invoice])

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  // Fetch vehicles when customer changes
  useEffect(() => {
    const fetchVehicles = async () => {
      if (formData.customerId) {
        setVehiclesLoading(true)
        try {
          const vehicleData = await apiRequest<Vehicle[]>(`/api/vehicles?customerId=${formData.customerId}`)
          setVehicles(vehicleData)
          setFilteredVehicles(vehicleData)

          // Find selected customer
          const customer = customers?.find((c) => c.id === formData.customerId)
          setSelectedCustomer(customer || null)

          // Reset vehicle if not in filtered list
          if (!vehicleData.find((v) => v.id === formData.vehicleId)) {
            setFormData((prev) => ({ ...prev, vehicleId: "" }))
            setSelectedVehicle(null)
          }
        } catch (error) {
          console.error("Error fetching vehicles:", error)
          toast({
            title: "Error",
            description: "Failed to fetch vehicles",
            variant: "destructive",
          })
        } finally {
          setVehiclesLoading(false)
        }
      } else {
        setVehicles([])
        setFilteredVehicles([])
        setSelectedCustomer(null)
      }
    }

    fetchVehicles()
  }, [formData.customerId, customers])

  // Update selected vehicle when vehicleId changes
  useEffect(() => {
    if (formData.vehicleId) {
      const vehicle = vehicles.find((v) => v.id === formData.vehicleId)
      setSelectedVehicle(vehicle || null)
    } else {
      setSelectedVehicle(null)
    }
  }, [formData.vehicleId, vehicles])

  // Filter services based on search term and category
  useEffect(() => {
    let filtered = servicesList

    if (searchTerm) {
      filtered = filtered.filter(
        (service) =>
          service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          service.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (selectedCategory) {
      filtered = filtered.filter((service) => service.category === selectedCategory)
    }

    setFilteredServices(filtered)
  }, [searchTerm, selectedCategory])

  // Calculate totals
  const calculateTotals = () => {
    const subtotal = formData.items.reduce((sum, item) => {
      return sum + item.quantity * item.unitPrice
    }, 0)

    const tax = (subtotal * formData.taxRate) / 100
    const total = subtotal + tax

    return { subtotal, tax, total }
  }

  const { subtotal, tax, total } = calculateTotals()

  const handleCustomerChange = (value: string) => {
    setFormData((prev) => ({ ...prev, customerId: value, vehicleId: "" }))
    setFormErrors((prev) => ({ ...prev, customerId: "" }))
  }

  const handleVehicleChange = (value: string) => {
    setFormData((prev) => ({ ...prev, vehicleId: value }))
    setFormErrors((prev) => ({ ...prev, vehicleId: "" }))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error for this field if it exists
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleStatusChange = (value: string) => {
    setFormData((prev) => ({ ...prev, status: value as "Pending" | "Paid" | "Overdue" | "Cancelled" }))
  }

  const handleItemChange = (index: number, field: string, value: string | number) => {
    const newItems = [...formData.items]
    newItems[index] = { ...newItems[index], [field]: value }
    setFormData((prev) => ({ ...prev, items: newItems }))

    // Clear item errors
    setFormErrors((prev) => ({ ...prev, items: "" }))
  }

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { description: "", quantity: 1, unitPrice: 0 }],
    }))
  }

  const removeItem = (index: number) => {
    if (formData.items.length > 1) {
      const newItems = [...formData.items]
      newItems.splice(index, 1)
      setFormData((prev) => ({ ...prev, items: newItems }))
    }
  }

  const addServiceToInvoice = (service: any) => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items.filter((item) => item.description !== "" || item.unitPrice !== 0),
        {
          description: `${service.name} - ${service.description}`,
          quantity: 1,
          unitPrice: service.price,
        },
      ],
    }))
    setServiceDialogOpen(false)
  }

  const validateForm = () => {
    const errors: Record<string, string> = {}

    if (!formData.customerId) {
      errors.customerId = "Please select a customer"
    }

    if (!formData.vehicleId) {
      errors.vehicleId = "Please select a vehicle"
    }

    if (!formData.date) {
      errors.date = "Please enter an invoice date"
    }

    if (!formData.dueDate) {
      errors.dueDate = "Please enter a due date"
    }

    // Check if any items are empty
    const hasEmptyItems = formData.items.some((item) => !item.description || item.quantity <= 0 || item.unitPrice <= 0)

    if (hasEmptyItems) {
      errors.items = "All line items must have a description, quantity, and price"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Update invoice via API
      const updateData = {
        customerId: formData.customerId,
        vehicleId: formData.vehicleId,
        date: formData.date,
        dueDate: formData.dueDate,
        items: formData.items,
        notes: formData.notes,
        taxRate: formData.taxRate,
        status: formData.status,
      }

      await apiRequest(`/api/invoices/${resolvedParams.id}`, {
        method: "PUT",
        body: JSON.stringify(updateData),
      })

      toast({
        title: "Success",
        description: "Invoice updated successfully",
      })

      // Redirect to invoices page
      router.push("/invoices")
    } catch (error) {
      console.error("Error updating invoice:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update invoice. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Get unique categories
  const categories = Array.from(new Set(servicesList.map((service) => service.category)))

  if (!isAuthenticated) {
    return null // Don't render anything while redirecting
  }

  if (invoiceLoading || customersLoading) {
    return (
      <div className="flex min-h-screen w-full flex-col">
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Car className="h-6 w-6" />
            <span>GarageHub</span>
          </Link>
          <nav className="ml-auto flex gap-2">
            <UserNav />
          </nav>
        </header>
        <div className="flex flex-1">
          <DashboardNav />
          <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                <p className="mt-2 text-muted-foreground">Loading...</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    )
  }

  if (invoiceError) {
    return (
      <div className="flex min-h-screen w-full flex-col">
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Car className="h-6 w-6" />
            <span>GarageHub</span>
          </Link>
          <nav className="ml-auto flex gap-2">
            <UserNav />
          </nav>
        </header>
        <div className="flex flex-1">
          <DashboardNav />
          <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <p className="text-destructive">Error loading invoice: {invoiceError}</p>
                <Button onClick={() => window.location.reload()} className="mt-2">
                  Retry
                </Button>
              </div>
            </div>
          </main>
        </div>
      </div>
    )
  }

  if (!invoice) {
    return (
      <div className="flex min-h-screen w-full flex-col">
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Car className="h-6 w-6" />
            <span>GarageHub</span>
          </Link>
          <nav className="ml-auto flex gap-2">
            <UserNav />
          </nav>
        </header>
        <div className="flex flex-1">
          <DashboardNav />
          <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <p className="text-destructive">Invoice not found</p>
                <Button asChild className="mt-2">
                  <Link href="/invoices">Back to Invoices</Link>
                </Button>
              </div>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Car className="h-6 w-6" />
          <span>GarageHub</span>
        </Link>
        <nav className="ml-auto flex gap-2">
          <UserNav />
        </nav>
      </header>
      <div className="flex flex-1">
        <DashboardNav />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-tight">Edit Invoice {invoice.number}</h1>
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link href="/invoices">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Cancel
                </Link>
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid gap-6">
              {/* Invoice Status */}
              <Card>
                <CardHeader>
                  <CardTitle>Invoice Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={formData.status} onValueChange={handleStatusChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Paid">Paid</SelectItem>
                        <SelectItem value="Overdue">Overdue</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Rest of the form is the same as create page but with pre-populated data */}
              {/* Customer and Vehicle Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Customer Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="customerId">Select Customer</Label>
                      <Select value={formData.customerId} onValueChange={handleCustomerChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a customer" />
                        </SelectTrigger>
                        <SelectContent>
                          {customers?.map((customer) => (
                            <SelectItem key={customer.id} value={customer.id}>
                              {customer.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {formErrors.customerId && <p className="text-sm text-destructive">{formErrors.customerId}</p>}
                    </div>

                    {selectedCustomer && (
                      <div className="space-y-2 pt-2">
                        <div className="text-sm">
                          <p>{selectedCustomer.address}</p>
                          <p>Phone: {selectedCustomer.phone}</p>
                          <p>Email: {selectedCustomer.email}</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Vehicle Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="vehicleId">Select Vehicle</Label>
                      <Select
                        value={formData.vehicleId}
                        onValueChange={handleVehicleChange}
                        disabled={!formData.customerId || vehiclesLoading || filteredVehicles.length === 0}
                      >
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              !formData.customerId
                                ? "Select a customer first"
                                : vehiclesLoading
                                  ? "Loading vehicles..."
                                  : filteredVehicles.length === 0
                                    ? "No vehicles found"
                                    : "Select a vehicle"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {filteredVehicles.map((vehicle) => (
                            <SelectItem key={vehicle.id} value={vehicle.id}>
                              {vehicle.year} {vehicle.make} {vehicle.model} ({vehicle.licensePlate})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {formErrors.vehicleId && <p className="text-sm text-destructive">{formErrors.vehicleId}</p>}
                    </div>

                    {selectedVehicle && (
                      <div className="space-y-2 pt-2">
                        <div className="text-sm">
                          <p className="font-medium">
                            {selectedVehicle.year} {selectedVehicle.make} {selectedVehicle.model}
                          </p>
                          <p>License Plate: {selectedVehicle.licensePlate}</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Invoice Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Invoice Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">Invoice Date</Label>
                      <Input id="date" name="date" type="date" value={formData.date} onChange={handleInputChange} />
                      {formErrors.date && <p className="text-sm text-destructive">{formErrors.date}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dueDate">Due Date</Label>
                      <Input
                        id="dueDate"
                        name="dueDate"
                        type="date"
                        value={formData.dueDate}
                        onChange={handleInputChange}
                      />
                      {formErrors.dueDate && <p className="text-sm text-destructive">{formErrors.dueDate}</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Line Items - Same as create page */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Line Items</CardTitle>
                  <Dialog open={serviceDialogOpen} onOpenChange={setServiceDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Service
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                      <DialogHeader>
                        <DialogTitle>Select Service</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="flex items-center gap-2">
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
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                          <Badge
                            variant={selectedCategory === null ? "default" : "outline"}
                            className="cursor-pointer"
                            onClick={() => setSelectedCategory(null)}
                          >
                            All
                          </Badge>
                          {categories.map((category) => (
                            <Badge
                              key={category}
                              variant={selectedCategory === category ? "default" : "outline"}
                              className="cursor-pointer"
                              onClick={() => setSelectedCategory(category)}
                            >
                              {category}
                            </Badge>
                          ))}
                        </div>

                        <ScrollArea className="h-[300px] rounded-md border p-4">
                          <div className="space-y-4">
                            {filteredServices.length === 0 ? (
                              <p className="text-center text-muted-foreground py-4">No services found</p>
                            ) : (
                              filteredServices.map((service) => (
                                <div
                                  key={service.id}
                                  className="flex justify-between items-center p-3 hover:bg-muted rounded-md cursor-pointer"
                                  onClick={() => addServiceToInvoice(service)}
                                >
                                  <div>
                                    <h4 className="font-medium">{service.name}</h4>
                                    <p className="text-sm text-muted-foreground">{service.description}</p>
                                    <Badge variant="outline" className="mt-1">
                                      {service.category}
                                    </Badge>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-bold">${service.price.toFixed(2)}</p>
                                    <Button size="sm" variant="ghost" className="mt-1">
                                      <Plus className="h-4 w-4 mr-1" /> Add
                                    </Button>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </ScrollArea>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-12 gap-2 font-medium text-sm">
                      <div className="col-span-6">Description</div>
                      <div className="col-span-2">Quantity</div>
                      <div className="col-span-2">Unit Price</div>
                      <div className="col-span-1">Total</div>
                      <div className="col-span-1"></div>
                    </div>

                    {formData.items.map((item, index) => (
                      <div key={index} className="grid grid-cols-12 gap-2 items-center">
                        <div className="col-span-6">
                          <Input
                            placeholder="Description"
                            value={item.description}
                            onChange={(e) => handleItemChange(index, "description", e.target.value)}
                          />
                        </div>
                        <div className="col-span-2">
                          <Input
                            type="number"
                            min="0.01"
                            step="0.01"
                            value={item.quantity}
                            onChange={(e) =>
                              handleItemChange(index, "quantity", Number.parseFloat(e.target.value) || 0)
                            }
                          />
                        </div>
                        <div className="col-span-2">
                          <Input
                            type="number"
                            min="0.01"
                            step="0.01"
                            value={item.unitPrice}
                            onChange={(e) =>
                              handleItemChange(index, "unitPrice", Number.parseFloat(e.target.value) || 0)
                            }
                          />
                        </div>
                        <div className="col-span-1 text-right">${(item.quantity * item.unitPrice).toFixed(2)}</div>
                        <div className="col-span-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            type="button"
                            onClick={() => removeItem(index)}
                            disabled={formData.items.length <= 1}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Remove item</span>
                          </Button>
                        </div>
                      </div>
                    ))}

                    {formErrors.items && <p className="text-sm text-destructive">{formErrors.items}</p>}

                    <Button type="button" variant="outline" onClick={addItem} className="mt-2">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Custom Item
                    </Button>

                    <div className="flex flex-col items-end space-y-2 pt-4 border-t">
                      <div className="flex w-full justify-between md:w-1/3">
                        <span>Subtotal:</span>
                        <span>${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex w-full justify-between md:w-1/3">
                        <div className="flex items-center gap-2">
                          <span>Tax:</span>
                          <Input
                            type="number"
                            name="taxRate"
                            value={formData.taxRate}
                            onChange={handleInputChange}
                            className="w-16 h-8"
                            min="0"
                            max="100"
                          />
                          <span>%</span>
                        </div>
                        <span>${tax.toFixed(2)}</span>
                      </div>
                      <div className="flex w-full justify-between border-t pt-2 md:w-1/3">
                        <span className="font-medium">Total:</span>
                        <span className="font-bold">${total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Notes */}
              <Card>
                <CardHeader>
                  <CardTitle>Notes & Terms</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea
                        id="notes"
                        name="notes"
                        placeholder="Add notes for the customer (e.g., details about the service, recommendations, etc.)"
                        value={formData.notes}
                        onChange={handleInputChange}
                        rows={3}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </form>
        </main>
      </div>
    </div>
  )
}
