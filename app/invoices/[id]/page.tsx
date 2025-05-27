"use client"

import { useEffect, useState } from "react"
import { use } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Car, Download, Printer, Share2, ArrowLeft } from "lucide-react"
import { DashboardNav } from "@/components/dashboard-nav"
import { UserNav } from "@/components/user-nav"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"
import { InvoiceStatusUpdate } from "@/components/invoice-status-update"

// Mock invoice data
const mockInvoices = {
  "INV-1001": {
    id: "INV-1001",
    number: "INV-1001",
    date: "May 18, 2025",
    dueDate: "May 25, 2025",
    status: "Paid",
    customer: {
      name: "John Doe",
      email: "john@example.com",
      phone: "555-123-4567",
      address: "123 Main St, Anytown, CA 12345",
    },
    vehicle: {
      make: "Toyota",
      model: "Camry",
      year: "2018",
      licensePlate: "ABC123",
    },
    items: [
      {
        description: "Oil Change",
        quantity: 1,
        unitPrice: 45.0,
        total: 45.0,
      },
      {
        description: "Oil Filter",
        quantity: 1,
        unitPrice: 15.0,
        total: 15.0,
      },
      {
        description: "Labor",
        quantity: 0.5,
        unitPrice: 80.0,
        total: 40.0,
      },
    ],
    subtotal: 100.0,
    tax: 8.0,
    total: 108.0,
  },
  "INV-1002": {
    id: "INV-1002",
    number: "INV-1002",
    date: "May 17, 2025",
    dueDate: "May 24, 2025",
    status: "Paid",
    customer: {
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "555-987-6543",
      address: "456 Oak St, Somewhere, CA 54321",
    },
    vehicle: {
      make: "Honda",
      model: "Civic",
      year: "2020",
      licensePlate: "XYZ789",
    },
    items: [
      {
        description: "Brake Replacement (Front)",
        quantity: 1,
        unitPrice: 180.0,
        total: 180.0,
      },
      {
        description: "Brake Pads",
        quantity: 1,
        unitPrice: 70.0,
        total: 70.0,
      },
      {
        description: "Labor",
        quantity: 1.5,
        unitPrice: 80.0,
        total: 120.0,
      },
    ],
    subtotal: 370.0,
    tax: 29.6,
    total: 399.6,
  },
  "INV-1003": {
    id: "INV-1003",
    number: "INV-1003",
    date: "May 16, 2025",
    dueDate: "May 23, 2025",
    status: "Pending",
    customer: {
      name: "Robert Johnson",
      email: "robert@example.com",
      phone: "555-456-7890",
      address: "789 Pine St, Elsewhere, CA 67890",
    },
    vehicle: {
      make: "Ford",
      model: "F-150",
      year: "2019",
      licensePlate: "DEF456",
    },
    items: [
      {
        description: "Engine Diagnostics",
        quantity: 1,
        unitPrice: 120.0,
        total: 120.0,
      },
      {
        description: "Labor",
        quantity: 1,
        unitPrice: 80.0,
        total: 80.0,
      },
    ],
    subtotal: 200.0,
    tax: 16.0,
    total: 216.0,
  },
  "INV-1004": {
    id: "INV-1004",
    number: "INV-1004",
    date: "May 15, 2025",
    dueDate: "May 22, 2025",
    status: "Paid",
    customer: {
      name: "Emily Davis",
      email: "emily@example.com",
      phone: "555-789-0123",
      address: "321 Maple St, Nowhere, CA 13579",
    },
    vehicle: {
      make: "Nissan",
      model: "Altima",
      year: "2021",
      licensePlate: "GHI789",
    },
    items: [
      {
        description: "Tire Rotation",
        quantity: 1,
        unitPrice: 75.0,
        total: 75.0,
      },
    ],
    subtotal: 75.0,
    tax: 6.0,
    total: 81.0,
  },
  "INV-1005": {
    id: "INV-1005",
    number: "INV-1005",
    date: "May 14, 2025",
    dueDate: "May 21, 2025",
    status: "Pending",
    customer: {
      name: "Michael Brown",
      email: "michael@example.com",
      phone: "555-234-5678",
      address: "654 Cedar St, Anywhere, CA 24680",
    },
    vehicle: {
      make: "BMW",
      model: "3 Series",
      year: "2020",
      licensePlate: "JKL012",
    },
    items: [
      {
        description: "AC Service",
        quantity: 1,
        unitPrice: 180.0,
        total: 180.0,
      },
      {
        description: "Refrigerant",
        quantity: 1,
        unitPrice: 45.0,
        total: 45.0,
      },
      {
        description: "Labor",
        quantity: 1,
        unitPrice: 80.0,
        total: 80.0,
      },
    ],
    subtotal: 305.0,
    tax: 24.4,
    total: 329.4,
  },
  "INV-1006": {
    id: "INV-1006",
    number: "INV-1006",
    date: "May 13, 2025",
    dueDate: "May 20, 2025",
    status: "Paid",
    customer: {
      name: "Sarah Wilson",
      email: "sarah@example.com",
      phone: "555-345-6789",
      address: "987 Birch St, Someplace, CA 97531",
    },
    vehicle: {
      make: "Honda",
      model: "Accord",
      year: "2019",
      licensePlate: "MNO345",
    },
    items: [
      {
        description: "Full Inspection",
        quantity: 1,
        unitPrice: 150.0,
        total: 150.0,
      },
    ],
    subtotal: 150.0,
    tax: 12.0,
    total: 162.0,
  },
  "INV-1007": {
    id: "INV-1007",
    number: "INV-1007",
    date: "May 12, 2025",
    dueDate: "May 19, 2025",
    status: "Overdue",
    customer: {
      name: "David Lee",
      email: "david@example.com",
      phone: "555-456-7890",
      address: "753 Walnut St, Elsewhere, CA 86420",
    },
    vehicle: {
      make: "Audi",
      model: "A4",
      year: "2021",
      licensePlate: "PQR678",
    },
    items: [
      {
        description: "Transmission Fluid Change",
        quantity: 1,
        unitPrice: 220.0,
        total: 220.0,
      },
      {
        description: "Transmission Fluid",
        quantity: 1,
        unitPrice: 65.0,
        total: 65.0,
      },
      {
        description: "Labor",
        quantity: 1.5,
        unitPrice: 80.0,
        total: 120.0,
      },
    ],
    subtotal: 405.0,
    tax: 32.4,
    total: 437.4,
  },
}

export default function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const invoiceId = resolvedParams.id
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const [invoice, setInvoice] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentStatus, setCurrentStatus] = useState(invoice?.status || "Pending")

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  // Fetch invoice data
  useEffect(() => {
    setLoading(true)
    setError(null)

    // Simulate API call with timeout
    setTimeout(() => {
      if (mockInvoices[invoiceId as keyof typeof mockInvoices]) {
        setInvoice(mockInvoices[invoiceId as keyof typeof mockInvoices])
        setCurrentStatus(mockInvoices[invoiceId as keyof typeof mockInvoices].status)
        setLoading(false)
      } else {
        setError(`Invoice #${invoiceId} not found`)
        setLoading(false)
      }
    }, 500)
  }, [invoiceId])

  const handlePrint = () => {
    // Open print page in new window
    const printUrl = `/invoices/print/${invoice.id}`
    window.open(printUrl, "_blank", "width=800,height=600")
  }

  const handleDownload = () => {
    // Open download page in new window
    const downloadUrl = `/invoices/download/${invoice.id}`
    window.open(downloadUrl, "_blank", "width=600,height=400")
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `Invoice ${invoice.number}`,
          text: `Invoice for ${invoice.customer.name}`,
          url: window.location.href,
        })
        .catch(console.error)
    } else {
      // Fallback to clipboard
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => {
          toast({
            title: "Link copied to clipboard",
            description: "Invoice link has been copied to your clipboard",
          })
        })
        .catch(() => {
          toast({
            title: "Unable to copy link",
            description: "Please copy the URL manually",
            variant: "destructive",
          })
        })
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
              <h1 className="text-2xl font-bold tracking-tight">Loading Invoice...</h1>
              <Button variant="outline" asChild>
                <Link href="/invoices">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Invoices
                </Link>
              </Button>
            </div>
            <div className="flex items-center justify-center h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
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
              <h1 className="text-2xl font-bold tracking-tight">Invoice Not Found</h1>
              <Button variant="outline" asChild>
                <Link href="/invoices">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Invoices
                </Link>
              </Button>
            </div>
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-lg text-muted-foreground mb-4">{error}</p>
                <Button asChild>
                  <Link href="/invoices">View All Invoices</Link>
                </Button>
              </CardContent>
            </Card>
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
            <h1 className="text-2xl font-bold tracking-tight">Invoice #{invoice.number}</h1>
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link href="/invoices">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Invoices
                </Link>
              </Button>
              <Button variant="outline" size="icon" title="Share Invoice" onClick={handleShare}>
                <Share2 className="h-4 w-4" />
                <span className="sr-only">Share</span>
              </Button>
              <Button variant="outline" size="icon" title="Print Invoice" onClick={handlePrint}>
                <Printer className="h-4 w-4" />
                <span className="sr-only">Print</span>
              </Button>
              <Button variant="outline" size="icon" title="Download Invoice" onClick={handleDownload}>
                <Download className="h-4 w-4" />
                <span className="sr-only">Download</span>
              </Button>
              <Button asChild>
                <Link href={`/invoices/edit/${invoice.id}`}>Edit Invoice</Link>
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Invoice #{invoice.number}</CardTitle>
                  <CardDescription>
                    Issued on {invoice.date} • Due on {invoice.dueDate}
                  </CardDescription>
                </div>
                <Badge
                  variant={
                    invoice.status === "Paid" ? "outline" : invoice.status === "Pending" ? "secondary" : "destructive"
                  }
                >
                  {invoice.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Bill To</h3>
                  <div className="text-sm">
                    <p className="font-medium">{invoice.customer.name}</p>
                    <p>{invoice.customer.email}</p>
                    <p>{invoice.customer.phone}</p>
                    <p>{invoice.customer.address}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Vehicle Information</h3>
                  <div className="text-sm">
                    <p>
                      {invoice.vehicle.year} {invoice.vehicle.make} {invoice.vehicle.model}
                    </p>
                    <p>License Plate: {invoice.vehicle.licensePlate}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead className="text-right">Unit Price</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoice.items.map((item: any, i: number) => (
                      <TableRow key={i}>
                        <TableCell>{item.description}</TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        <TableCell className="text-right">${item.unitPrice.toFixed(2)}</TableCell>
                        <TableCell className="text-right">${item.total.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex flex-col items-end space-y-2">
                <div className="flex w-full justify-between md:w-1/2">
                  <span>Subtotal</span>
                  <span>${invoice.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex w-full justify-between md:w-1/2">
                  <span>Tax</span>
                  <span>${invoice.tax.toFixed(2)}</span>
                </div>
                <div className="flex w-full justify-between border-t pt-2 md:w-1/2">
                  <span className="font-medium">Total</span>
                  <span className="font-bold">${invoice.total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-start gap-2">
              <div className="text-sm text-muted-foreground">
                <p>Payment Terms: Due within 7 days</p>
                <p>Thank you for your business!</p>
              </div>
            </CardFooter>
          </Card>
          <InvoiceStatusUpdate
            invoiceId={invoice.id}
            currentStatus={currentStatus}
            onStatusUpdate={(newStatus) => {
              setCurrentStatus(newStatus as any)
              // Update the invoice object
              setInvoice((prev: typeof invoice) => (prev ? { ...prev, status: newStatus } : null))
            }}
          />
        </main>
      </div>
    </div>
  )
}
