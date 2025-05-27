"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Printer, Loader2 } from "lucide-react"
import { use } from "react"
import { useToast } from "@/hooks/use-toast"

interface Invoice {
  _id: string
  number: string
  date: string
  dueDate: string
  status: string
  customer: {
    name: string
    email: string
    phone: string
    address: string
  }
  vehicle: {
    make: string
    model: string
    year: string
    licensePlate: string
  }
  items: Array<{
    description: string
    quantity: number
    unitPrice: number
    total: number
  }>
  subtotal: number
  tax: number
  total: number
}

export default function PrintInvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const invoiceId = resolvedParams.id
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  // Fetch invoice data
  useEffect(() => {
    const fetchInvoice = async () => {
      if (!isAuthenticated) return

      try {
        setIsLoading(true)
        const response = await fetch(`/api/invoices/${invoiceId}`)

        if (!response.ok) {
          throw new Error(`Failed to fetch invoice: ${response.statusText}`)
        }

        const data = await response.json()
        setInvoice(data)
      } catch (err) {
        console.error("Error fetching invoice:", err)
        setError(`Failed to load invoice: ${err instanceof Error ? err.message : String(err)}`)
        toast({
          title: "Error",
          description: "Failed to load invoice data",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchInvoice()
  }, [invoiceId, isAuthenticated, toast])

  // Auto-print when invoice is loaded
  useEffect(() => {
    if (invoice && !isLoading) {
      // Small delay to ensure content is rendered
      setTimeout(() => {
        window.print()
      }, 500)
    }
  }, [invoice, isLoading])

  const handlePrint = () => {
    window.print()
  }

  const handleBack = () => {
    router.back()
  }

  if (!isAuthenticated) {
    return null
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-lg">Loading invoice...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !invoice) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-center mb-6">Print Invoice</h1>
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <p className="text-red-700">{error || "Invoice not found"}</p>
            <div className="mt-4 flex justify-center">
              <Button onClick={handleBack}>Go Back</Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-content, .print-content * {
            visibility: visible;
          }
          .print-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none !important;
          }
          .print-header {
            color: #1A66B3 !important;
            -webkit-print-color-adjust: exact;
          }
          .print-divider {
            border-color: #1A66B3 !important;
            -webkit-print-color-adjust: exact;
          }
          .print-table-header {
            background-color: #1A66B3 !important;
            color: white !important;
            -webkit-print-color-adjust: exact;
          }
          .print-total-row {
            background-color: #1A66B3 !important;
            color: white !important;
            -webkit-print-color-adjust: exact;
          }
        }
      `}</style>

      <div className="min-h-screen bg-gray-50">
        {/* Screen controls */}
        <div className="no-print bg-white border-b p-4 flex justify-between items-center">
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-xl font-semibold">Print Invoice {invoice.number}</h1>
          <Button onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
        </div>

        {/* Printable content */}
        <div className="print-content p-8 max-w-4xl mx-auto bg-white">
          {/* Header */}
          <div className="flex justify-between mb-8">
            <div>
              <div className="text-2xl font-bold print-header text-blue-600">GARAGEHUB</div>
              <div className="mt-2 text-sm">
                <p>577 Mechanic Street, Autoville, AV 12345</p>
                <p>+1 (555) 123-4567</p>
                <p>service@garagehub.com</p>
                <p>www.garagehub.com</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold mb-2">INVOICE</div>
              <div className="text-sm">
                <p>
                  <span className="font-semibold">Invoice #:</span> {invoice.number}
                </p>
                <p>
                  <span className="font-semibold">Date:</span> {new Date(invoice.date).toLocaleDateString()}
                </p>
                <p>
                  <span className="font-semibold">Due Date:</span> {new Date(invoice.dueDate).toLocaleDateString()}
                </p>
                <p>
                  <span className="font-semibold">Status:</span> {invoice.status}
                </p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t-2 print-divider border-blue-600 mb-8"></div>

          {/* Customer and Vehicle Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-lg font-bold mb-2 print-header text-blue-600">Bill To:</h2>
              <div className="text-sm">
                <p className="font-semibold">{invoice.customer.name}</p>
                <p>{invoice.customer.address}</p>
                <p>Phone: {invoice.customer.phone}</p>
                <p>Email: {invoice.customer.email}</p>
              </div>
            </div>
            <div>
              <h2 className="text-lg font-bold mb-2 print-header text-blue-600">Vehicle Information:</h2>
              <div className="text-sm">
                <p className="font-semibold">
                  {invoice.vehicle.year} {invoice.vehicle.make} {invoice.vehicle.model}
                </p>
                <p>License Plate: {invoice.vehicle.licensePlate}</p>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-8">
            <table className="w-full border-collapse">
              <thead>
                <tr className="print-table-header bg-blue-600 text-white">
                  <th className="border p-3 text-left">Description</th>
                  <th className="border p-3 text-right">Quantity</th>
                  <th className="border p-3 text-right">Unit Price</th>
                  <th className="border p-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                    <td className="border p-3 text-sm">{item.description}</td>
                    <td className="border p-3 text-sm text-right">{item.quantity}</td>
                    <td className="border p-3 text-sm text-right">${item.unitPrice.toFixed(2)}</td>
                    <td className="border p-3 text-sm text-right">${item.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end mb-8">
            <div className="w-64">
              <div className="flex justify-between py-2">
                <span className="font-semibold">Subtotal:</span>
                <span>${invoice.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="font-semibold">Tax:</span>
                <span>${invoice.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-3 px-4 print-total-row bg-blue-600 text-white">
                <span className="font-bold">TOTAL:</span>
                <span className="font-bold">${invoice.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Payment Terms */}
          <div className="mb-8">
            <h2 className="text-lg font-bold mb-2 print-header text-blue-600">Payment Terms:</h2>
            <p className="text-sm">
              Payment due within 7 days of invoice date. We accept cash, credit cards, and bank transfers.
            </p>
          </div>

          {/* Signature */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <div className="border-b border-dashed border-gray-400 h-8 mb-2"></div>
              <p className="text-center text-sm font-semibold">Customer Signature</p>
            </div>
            <div>
              <div className="border-b border-dashed border-gray-400 h-8 mb-2"></div>
              <p className="text-center text-sm font-semibold">Authorized Signature</p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-16 pt-4 border-t print-divider border-blue-600 text-center text-sm">
            <p>Thank you for your business! If you have any questions about this invoice, please contact us.</p>
          </div>
        </div>
      </div>
    </>
  )
}
