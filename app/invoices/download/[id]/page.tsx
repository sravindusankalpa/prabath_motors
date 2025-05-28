"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download, Loader2 } from "lucide-react"
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

export default function DownloadInvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const invoiceId = resolvedParams.id
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isGenerated, setIsGenerated] = useState(false)
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

  // Auto-generate PDF when invoice is loaded
  useEffect(() => {
    if (invoice && !isGenerated && !isGenerating && !isLoading) {
      generatePDF()
    }
  }, [invoice, isGenerated, isGenerating, isLoading])

  const generatePDF = async () => {
    if (!invoice) return

    setIsGenerating(true)
    setError(null)

    try {
      // Create a canvas-based PDF generation
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")

      if (!ctx) {
        throw new Error("Canvas context not available")
      }

      // Set canvas size (A4 proportions)
      canvas.width = 794 // A4 width in pixels at 96 DPI
      canvas.height = 1123 // A4 height in pixels at 96 DPI

      // Set white background
      ctx.fillStyle = "#ffffff"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Set default font
      ctx.fillStyle = "#000000"
      ctx.font = "16px Arial"

      let yPosition = 50

      // Header - Company Info
      ctx.fillStyle = "#1A66B3"
      ctx.font = "bold 24px Arial"
      ctx.fillText("GARAGEHUB", 50, yPosition)
      yPosition += 30

      ctx.fillStyle = "#000000"
      ctx.font = "12px Arial"
      ctx.fillText("577 Mechanic Street, Autoville, AV 12345", 50, yPosition)
      yPosition += 20
      ctx.fillText("+1 (555) 123-4567 | service@garagehub.com", 50, yPosition)
      yPosition += 40

      // Invoice Info (right side)
      ctx.font = "bold 20px Arial"
      ctx.fillText("INVOICE", 600, 50)

      ctx.font = "12px Arial"
      ctx.fillText(`Invoice #: ${invoice.number}`, 600, 80)
      ctx.fillText(`Date: ${new Date(invoice.date).toLocaleDateString()}`, 600, 100)
      ctx.fillText(`Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}`, 600, 120)
      ctx.fillText(`Status: ${invoice.status}`, 600, 140)

      // Divider line
      ctx.strokeStyle = "#1A66B3"
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(50, yPosition)
      ctx.lineTo(744, yPosition)
      ctx.stroke()
      yPosition += 30

      // Customer Info
      ctx.fillStyle = "#1A66B3"
      ctx.font = "bold 14px Arial"
      ctx.fillText("Bill To:", 50, yPosition)
      ctx.fillText("Vehicle Information:", 400, yPosition)
      yPosition += 20

      ctx.fillStyle = "#000000"
      ctx.font = "12px Arial"
      ctx.fillText(invoice.customer.name, 50, yPosition)
      ctx.fillText(`${invoice.vehicle.year} ${invoice.vehicle.make} ${invoice.vehicle.model}`, 400, yPosition)
      yPosition += 20

      // Handle long addresses by wrapping text
      const addressLines = wrapText(ctx, invoice.customer.address, 300)
      addressLines.forEach((line, index) => {
        ctx.fillText(line, 50, yPosition + index * 20)
      })
      yPosition += addressLines.length * 20

      ctx.fillText(`License Plate: ${invoice.vehicle.licensePlate}`, 400, yPosition - 20)
      ctx.fillText(`Phone: ${invoice.customer.phone}`, 50, yPosition)
      yPosition += 20
      ctx.fillText(`Email: ${invoice.customer.email}`, 50, yPosition)
      yPosition += 40

      // Items table header
      ctx.fillStyle = "#1A66B3"
      ctx.fillRect(50, yPosition, 694, 30)
      ctx.fillStyle = "#ffffff"
      ctx.font = "bold 12px Arial"
      ctx.fillText("Description", 60, yPosition + 20)
      ctx.fillText("Qty", 400, yPosition + 20)
      ctx.fillText("Unit Price", 500, yPosition + 20)
      ctx.fillText("Amount", 650, yPosition + 20)
      yPosition += 30

      // Items
      ctx.fillStyle = "#000000"
      ctx.font = "12px Arial"
      invoice.items.forEach((item, index) => {
        if (index % 2 === 0) {
          ctx.fillStyle = "#f9f9f9"
          ctx.fillRect(50, yPosition, 694, 25)
        }
        ctx.fillStyle = "#000000"

        // Handle long descriptions by truncating
        const maxDescLength = 35
        const description =
          item.description.length > maxDescLength
            ? item.description.substring(0, maxDescLength) + "..."
            : item.description

        ctx.fillText(description, 60, yPosition + 18)
        ctx.fillText(item.quantity.toString(), 400, yPosition + 18)
        ctx.fillText(`Rs${item.unitPrice.toFixed(2)}`, 500, yPosition + 18)
        ctx.fillText(`Rs${item.total.toFixed(2)}`, 650, yPosition + 18)
        yPosition += 25
      })

      yPosition += 20

      // Totals
      const totalsX = 550
      ctx.font = "12px Arial"
      ctx.fillText("Subtotal:", totalsX, yPosition)
      ctx.fillText(`Rs${invoice.subtotal.toFixed(2)}`, 650, yPosition)
      yPosition += 20
      ctx.fillText("Tax:", totalsX, yPosition)
      ctx.fillText(`Rs${invoice.tax.toFixed(2)}`, 650, yPosition)
      yPosition += 20

      // Final total
      ctx.fillStyle = "#1A66B3"
      ctx.fillRect(totalsX - 10, yPosition - 5, 204, 25)
      ctx.fillStyle = "#ffffff"
      ctx.font = "bold 12px Arial"
      ctx.fillText("TOTAL:", totalsX, yPosition + 12)
      ctx.fillText(`Rs${invoice.total.toFixed(2)}`, 650, yPosition + 12)
      yPosition += 40

      // Payment terms
      ctx.fillStyle = "#000000"
      ctx.font = "12px Arial"
      ctx.fillText("Payment Terms: Payment due within 7 days of invoice date.", 50, yPosition)
      yPosition += 20
      ctx.fillText("Thank you for your business!", 50, yPosition)

      // Convert canvas to blob and download
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob)
          const a = document.createElement("a")
          a.href = url
          a.download = `Invoice-${invoice.number}.png`
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          URL.revokeObjectURL(url)
          setIsGenerated(true)
          toast({
            title: "Success",
            description: `Invoice ${invoice.number} downloaded successfully!`,
          })
        } else {
          throw new Error("Failed to create image blob")
        }
      }, "image/png")
    } catch (err) {
      console.error("Error generating PDF:", err)
      const errorMessage = `Failed to generate PDF: ${err instanceof Error ? err.message : String(err)}`
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  // Helper function to wrap text
  const wrapText = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] => {
    const words = text.split(" ")
    const lines: string[] = []
    let currentLine = words[0]

    for (let i = 1; i < words.length; i++) {
      const word = words[i]
      const width = ctx.measureText(currentLine + " " + word).width
      if (width < maxWidth) {
        currentLine += " " + word
      } else {
        lines.push(currentLine)
        currentLine = word
      }
    }
    lines.push(currentLine)
    return lines
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

  if (error && !invoice) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-center mb-6">Download Invoice</h1>
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <p className="text-red-700">{error}</p>
            <div className="mt-4 flex justify-center">
              <Button onClick={handleBack}>Go Back</Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!invoice) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-center mb-6">Invoice Not Found</h1>
          <div className="text-center">
            <p className="text-gray-600 mb-4">The requested invoice could not be found.</p>
            <Button onClick={handleBack}>Go Back</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Download Invoice</h1>
        <div className="text-center mb-4">
          <p className="text-sm text-gray-600">Invoice: {invoice.number}</p>
          <p className="text-sm text-gray-600">Customer: {invoice.customer.name}</p>
        </div>

        {isGenerating ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-lg">Generating Invoice...</p>
            <p className="text-sm text-gray-500 mt-2">Creating downloadable file...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <p className="text-red-700">{error}</p>
            <div className="mt-4 flex justify-center">
              <Button onClick={generatePDF}>Try Again</Button>
            </div>
          </div>
        ) : isGenerated ? (
          <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
            <p className="text-green-700 text-center mb-4">Invoice downloaded successfully!</p>
            <p className="text-sm text-gray-600 text-center mb-4">Check your Downloads folder for the invoice file.</p>
            <div className="flex flex-col gap-2">
              <Button onClick={generatePDF}>
                <Download className="mr-2 h-4 w-4" />
                Download Again
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <Button onClick={generatePDF} disabled={isGenerating}>
              <Download className="mr-2 h-4 w-4" />
              Generate Invoice
            </Button>
          </div>
        )}

        <div className="mt-6 flex justify-center">
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Invoice
          </Button>
        </div>
      </div>
    </div>
  )
}
