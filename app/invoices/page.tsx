"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Car, Plus, Search, Eye, Edit, Download, Printer, Trash2 } from "lucide-react"
import { DashboardNav } from "@/components/dashboard-nav"
import { UserNav } from "@/components/user-nav"
import { useApi, apiRequest } from "@/lib/hooks/use-api"
import type { Invoice } from "@/lib/models/invoice"
import { toast } from "@/components/ui/use-toast"

export default function InvoicesPage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  // Fetch invoices from API
  const { data: invoices, loading, error } = useApi<Invoice[]>("/api/invoices")

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  const handleDeleteInvoice = async (invoiceId: string) => {
    if (!confirm("Are you sure you want to delete this invoice?")) {
      return
    }

    try {
      await apiRequest(`/api/invoices/${invoiceId}`, {
        method: "DELETE",
      })

      toast({
        title: "Success",
        description: "Invoice deleted successfully",
      })

      // Refresh the page to update the list
      window.location.reload()
    } catch (error) {
      console.error("Error deleting invoice:", error)
      toast({
        title: "Error",
        description: "Failed to delete invoice",
        variant: "destructive",
      })
    }
  }

  // Filter invoices based on search term and status
  const filteredInvoices =
    invoices?.filter((invoice) => {
      const matchesSearch =
        invoice.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.vehicle.model.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === "all" || invoice.status.toLowerCase() === statusFilter.toLowerCase()

      return matchesSearch && matchesStatus
    }) || []

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "overdue":
        return "bg-red-100 text-red-800"
      case "cancelled":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (!isAuthenticated) {
    return null // Don't render anything while redirecting
  }

  if (loading) {
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
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                <p className="mt-2 text-muted-foreground">Loading invoices...</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    )
  }

  if (error) {
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
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <p className="text-destructive">Error loading invoices: {error}</p>
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
            <h1 className="text-2xl font-bold tracking-tight">Invoices</h1>
            <Button asChild>
              <Link href="/invoices/create">
                <Plus className="mr-2 h-4 w-4" />
                Create Invoice
              </Link>
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Invoice Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search invoices..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <select
                  className="px-3 py-2 border border-input bg-background rounded-md"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="overdue">Overdue</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {filteredInvoices.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No invoices found</p>
                  <Button asChild className="mt-4">
                    <Link href="/invoices/create">
                      <Plus className="mr-2 h-4 w-4" />
                      Create Your First Invoice
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Invoice #</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Vehicle</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredInvoices.map((invoice) => (
                        <TableRow key={invoice.id}>
                          <TableCell className="font-medium">{invoice.number}</TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{invoice.customer.name}</p>
                              <p className="text-sm text-muted-foreground">{invoice.customer.email}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            {invoice.vehicle.year} {invoice.vehicle.make} {invoice.vehicle.model}
                            <br />
                            <span className="text-sm text-muted-foreground">{invoice.vehicle.licensePlate}</span>
                          </TableCell>
                          <TableCell>{new Date(invoice.date).toLocaleDateString()}</TableCell>
                          <TableCell>{new Date(invoice.dueDate).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(invoice.status)}>{invoice.status}</Badge>
                          </TableCell>
                          <TableCell className="font-medium">${invoice.total.toFixed(2)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon" asChild>
                                <Link href={`/invoices/${invoice.id}`}>
                                  <Eye className="h-4 w-4" />
                                  <span className="sr-only">View</span>
                                </Link>
                              </Button>
                              <Button variant="ghost" size="icon" asChild>
                                <Link href={`/invoices/edit/${invoice.id}`}>
                                  <Edit className="h-4 w-4" />
                                  <span className="sr-only">Edit</span>
                                </Link>
                              </Button>
                              <Button variant="ghost" size="icon" asChild>
                                <Link href={`/invoices/print/${invoice.id}`}>
                                  <Printer className="h-4 w-4" />
                                  <span className="sr-only">Print</span>
                                </Link>
                              </Button>
                              <Button variant="ghost" size="icon" asChild>
                                <Link href={`/invoices/download/${invoice.id}`}>
                                  <Download className="h-4 w-4" />
                                  <span className="sr-only">Download</span>
                                </Link>
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleDeleteInvoice(invoice.id)}>
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
