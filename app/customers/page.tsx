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
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Car, Plus, Search, Edit, Trash2, Loader2 } from "lucide-react"
import { DashboardNav } from "@/components/dashboard-nav"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { UserNav } from "@/components/user-nav"
import { useToast } from "@/hooks/use-toast"
import type { Customer } from "@/lib/models/customer"

export default function CustomersPage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  })
  const [submitting, setSubmitting] = useState(false)

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  // Fetch customers
  const fetchCustomers = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/customers")
      if (!response.ok) throw new Error("Failed to fetch customers")
      const data = await response.json()
      setCustomers(data)
    } catch (error) {
      console.error("Error fetching customers:", error)
      toast({
        title: "Error",
        description: "Failed to load customers",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchCustomers()
    }
  }, [isAuthenticated])

  // Handle form submission for adding customer
  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const response = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error("Failed to create customer")

      toast({
        title: "Success",
        description: "Customer added successfully",
      })

      setIsAddDialogOpen(false)
      setFormData({ name: "", email: "", phone: "", address: "" })
      fetchCustomers()
    } catch (error) {
      console.error("Error adding customer:", error)
      toast({
        title: "Error",
        description: "Failed to add customer",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  // Handle form submission for editing customer
  const handleEditCustomer = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingCustomer) return

    setSubmitting(true)

    try {
      const response = await fetch(`/api/customers/${editingCustomer.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error("Failed to update customer")

      toast({
        title: "Success",
        description: "Customer updated successfully",
      })

      setIsEditDialogOpen(false)
      setEditingCustomer(null)
      setFormData({ name: "", email: "", phone: "", address: "" })
      fetchCustomers()
    } catch (error) {
      console.error("Error updating customer:", error)
      toast({
        title: "Error",
        description: "Failed to update customer",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  // Handle delete customer
  const handleDeleteCustomer = async (customer: Customer) => {
    if (!confirm(`Are you sure you want to delete ${customer.name}?`)) return

    try {
      const response = await fetch(`/api/customers/${customer.id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete customer")

      toast({
        title: "Success",
        description: "Customer deleted successfully",
      })

      fetchCustomers()
    } catch (error) {
      console.error("Error deleting customer:", error)
      toast({
        title: "Error",
        description: "Failed to delete customer",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  // Open edit dialog
  const openEditDialog = (customer: Customer) => {
    setEditingCustomer(customer)
    setFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
    })
    setIsEditDialogOpen(true)
  }

  // Filter customers based on search term
  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm),
  )

  if (!isAuthenticated) {
    return null // Don't render anything while redirecting
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
            <h1 className="text-2xl font-bold tracking-tight">Customers</h1>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Customer
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Customer</DialogTitle>
                  <DialogDescription>Enter the customer details below.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddCustomer}>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="address">Address</Label>
                      <Textarea
                        id="address"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" disabled={submitting}>
                      {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Add Customer
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Customer Management</CardTitle>
              <CardDescription>Manage your customer database and contact information.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search customers..."
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
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCustomers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          {searchTerm
                            ? "No customers found matching your search."
                            : "No customers found. Add your first customer to get started."}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredCustomers.map((customer) => (
                        <TableRow key={customer.id}>
                          <TableCell className="font-medium">{customer.name}</TableCell>
                          <TableCell>{customer.email}</TableCell>
                          <TableCell>{customer.phone}</TableCell>
                          <TableCell className="max-w-xs truncate">{customer.address}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm" onClick={() => openEditDialog(customer)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => handleDeleteCustomer(customer)}>
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

          {/* Edit Customer Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Customer</DialogTitle>
                <DialogDescription>Update the customer details below.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleEditCustomer}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-name">Name</Label>
                    <Input
                      id="edit-name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-email">Email</Label>
                    <Input
                      id="edit-email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-phone">Phone</Label>
                    <Input
                      id="edit-phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-address">Address</Label>
                    <Textarea
                      id="edit-address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={submitting}>
                    {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Update Customer
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
