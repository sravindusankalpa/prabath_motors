"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Car, Download, Printer, Check, Loader2 } from "lucide-react"
import { DashboardNav } from "@/components/dashboard-nav"
import { UserNav } from "@/components/user-nav"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { generateAndSaveInvoicePDF } from "@/lib/generate-invoice-pdf"

// Define the expected return type
interface PDFGenerationResult {
  success: boolean
  filePath?: string
  message?: string
}

export default function GeneratePdfPage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const [isGenerating, setIsGenerating] = useState(false)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return null // Don't render anything while redirecting
  }
  
  // Mock invoice data
  const invoice = {
    id: "INV-1001",
    number: "INV-1001",
    date: "May 20, 2025",
    dueDate: "May 27, 2025",
    customerName: "John Doe",
    customerEmail: "john@example.com",
    customerPhone: "555-123-4567",
    customerAddress: "123 Main St, Anytown, CA 12345",
    vehicle: {
      make: "Toyota",
      model: "Camry",
      year: "2018",
      licensePlate: "ABC123",
    },
    items: [
      {
        description: "Oil Change - Full Synthetic",
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
        description: "Air Filter Replacement",
        quantity: 1,
        unitPrice: 25.0,
        total: 25.0,
      },
      {
        description: "Labor - Standard Service",
        quantity: 0.5,
        unitPrice: 80.0,
        total: 40.0,
      },
    ],
    subtotal: 125.0,
    tax: 10.0,
    taxRate: 8,
    discount: 0.0,
    total: 135.0,
    notes: "Vehicle was inspected and all fluids were topped off. Recommended brake service in the next 3 months.",
    paymentTerms: "Payment due within 7 days of invoice date. We accept cash, credit cards, and bank transfers.",
    mechanicName: "Mike Johnson",
  }
  
  const generatePDF = async () => {
    setIsGenerating(true)
    setError(null)
    setPdfUrl(null) // Reset previous PDF URL

    try {
      // Type assertion to ensure proper typing
      const result = await generateAndSaveInvoicePDF(invoice) as PDFGenerationResult | undefined

      // Handle the case where result might be undefined or null
      if (!result) {
        setError("PDF generation function returned no result")
        return
      }

      if (result.success && result.filePath) {
        setPdfUrl(result.filePath)
      } else {
        setError(result.message || "Failed to generate PDF - unknown error")
      }
    } catch (err) {
      console.error("PDF generation error:", err)
      setError(`Failed to generate PDF: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setIsGenerating(false)
    }
  }

  // Alternative PDF generation using browser's print functionality as fallback
  const generatePDFFallback = () => {
    setIsGenerating(true)
    setError(null)
    
    try {
      // Create a simple PDF using browser print
      const printWindow = window.open('', '_blank')
      if (!printWindow) {
        setError("Could not open print window. Please check popup blockers.")
        return
      }

      const invoiceHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Invoice ${invoice.number}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .invoice-details { display: flex; justify-content: space-between; margin-bottom: 20px; }
            .table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            .table th, .table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            .table th { background-color: #f2f2f2; }
            .totals { text-align: right; margin-top: 20px; }
            .notes { margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>INVOICE</h1>
            <h2>#${invoice.number}</h2>
          </div>
          
          <div class="invoice-details">
            <div>
              <h3>Bill To:</h3>
              <p><strong>${invoice.customerName}</strong></p>
              <p>${invoice.customerEmail}</p>
              <p>${invoice.customerPhone}</p>
              <p>${invoice.customerAddress}</p>
            </div>
            <div>
              <h3>Vehicle:</h3>
              <p>${invoice.vehicle.year} ${invoice.vehicle.make} ${invoice.vehicle.model}</p>
              <p>License: ${invoice.vehicle.licensePlate}</p>
              <p>Date: ${invoice.date}</p>
              <p>Due: ${invoice.dueDate}</p>
            </div>
          </div>

          <table class="table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${invoice.items.map(item => `
                <tr>
                  <td>${item.description}</td>
                  <td>${item.quantity}</td>
                  <td>$${item.unitPrice.toFixed(2)}</td>
                  <td>$${item.total.toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="totals">
            <p>Subtotal: $${invoice.subtotal.toFixed(2)}</p>
            <p>Tax (${invoice.taxRate}%): $${invoice.tax.toFixed(2)}</p>
            <p>Discount: $${invoice.discount.toFixed(2)}</p>
            <p><strong>Total: $${invoice.total.toFixed(2)}</strong></p>
          </div>

          <div class="notes">
            <h3>Notes:</h3>
            <p>${invoice.notes}</p>
            <h3>Payment Terms:</h3>
            <p>${invoice.paymentTerms}</p>
            <p><strong>Mechanic:</strong> ${invoice.mechanicName}</p>
          </div>
        </body>
        </html>
      `

      printWindow.document.write(invoiceHTML)
      printWindow.document.close()
      printWindow.focus()
      
      // Auto-print after a short delay
      setTimeout(() => {
        printWindow.print()
        printWindow.close()
      }, 500)

      setPdfUrl("print://generated") // Indicate success
    } catch (err) {
      setError(`Failed to generate PDF: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setIsGenerating(false)
    }
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
            <h1 className="text-2xl font-bold tracking-tight">Generate PDF Invoice</h1>
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link href="/invoices">Back to Invoices</Link>
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Invoice #{invoice.number}</CardTitle>
              <CardDescription>Generate a professional PDF invoice for your customer</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Bill To</h3>
                  <div className="text-sm">
                    <p className="font-medium">{invoice.customerName}</p>
                    <p>{invoice.customerEmail}</p>
                    <p>{invoice.customerPhone}</p>
                    <p>{invoice.customerAddress}</p>
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
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="px-4 py-2 text-left">Description</th>
                      <th className="px-4 py-2 text-right">Quantity</th>
                      <th className="px-4 py-2 text-right">Unit Price</th>
                      <th className="px-4 py-2 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.items.map((item, i) => (
                      <tr key={i} className={i % 2 === 0 ? "bg-muted/50" : ""}>
                        <td className="px-4 py-2">{item.description}</td>
                        <td className="px-4 py-2 text-right">{item.quantity}</td>
                        <td className="px-4 py-2 text-right">${item.unitPrice.toFixed(2)}</td>
                        <td className="px-4 py-2 text-right">${item.total.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-col items-end space-y-2">
                <div className="flex w-full justify-between md:w-1/2">
                  <span>Subtotal</span>
                  <span>${invoice.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex w-full justify-between md:w-1/2">
                  <span>Tax ({invoice.taxRate}%)</span>
                  <span>${invoice.tax.toFixed(2)}</span>
                </div>
                <div className="flex w-full justify-between md:w-1/2">
                  <span>Discount</span>
                  <span>${invoice.discount.toFixed(2)}</span>
                </div>
                <div className="flex w-full justify-between border-t pt-2 md:w-1/2">
                  <span className="font-medium">Total</span>
                  <span className="font-bold">${invoice.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Notes</h3>
                <p className="text-sm text-muted-foreground">{invoice.notes}</p>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Payment Terms</h3>
                <p className="text-sm text-muted-foreground">{invoice.paymentTerms}</p>
              </div>

              {error && (
                <div className="rounded-md bg-destructive/10 p-3 text-destructive border border-destructive/20">
                  <p className="font-medium">Error:</p>
                  <p>{error}</p>
                </div>
              )}

              {pdfUrl && pdfUrl !== "print://generated" && (
                <div className="rounded-md bg-green-50 border border-green-200 p-3 flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span className="text-green-700">PDF generated successfully!</span>
                  <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="ml-auto text-primary underline">
                    View PDF
                  </a>
                </div>
              )}

              {pdfUrl === "print://generated" && (
                <div className="rounded-md bg-green-50 border border-green-200 p-3 flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span className="text-green-700">PDF print dialog opened successfully!</span>
                </div>
              )}

              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => window.print()}>
                  <Printer className="mr-2 h-4 w-4" />
                  Print Preview
                </Button>
                <Button variant="outline" onClick={generatePDFFallback} disabled={isGenerating}>
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Print PDF
                    </>
                  )}
                </Button>
                <Button onClick={generatePDF} disabled={isGenerating}>
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Generate PDF
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}