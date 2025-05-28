export interface InvoiceData {
  id: string
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

export class PDFGenerator {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D

  constructor() {
    this.canvas = document.createElement("canvas")
    this.canvas.width = 794 // A4 width at 96 DPI
    this.canvas.height = 1123 // A4 height at 96 DPI

    const ctx = this.canvas.getContext("2d")
    if (!ctx) {
      throw new Error("Canvas context not available")
    }
    this.ctx = ctx
  }

  async generateInvoicePDF(invoice: InvoiceData): Promise<Blob> {
    // Clear canvas with white background
    this.ctx.fillStyle = "#ffffff"
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

    let yPos = 50

    // Header
    yPos = this.drawHeader(yPos)

    // Invoice info
    this.drawInvoiceInfo(invoice, yPos)
    yPos += 100

    // Divider
    yPos = this.drawDivider(yPos)

    // Customer and vehicle info
    yPos = this.drawCustomerInfo(invoice, yPos)

    // Items table
    yPos = this.drawItemsTable(invoice, yPos)

    // Totals
    yPos = this.drawTotals(invoice, yPos)

    // Footer
    this.drawFooter(yPos)

    return new Promise((resolve, reject) => {
      this.canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob)
        } else {
          reject(new Error("Failed to generate PDF blob"))
        }
      }, "image/png")
    })
  }

  private drawHeader(yPos: number): number {
    this.ctx.fillStyle = "#1A66B3"
    this.ctx.font = "bold 24px Arial"
    this.ctx.fillText("PRABATH MOTORS", 50, yPos)

    this.ctx.fillStyle = "#000000"
    this.ctx.font = "12px Arial"
    this.ctx.fillText("577 Mechanic Street, Autoville, AV 12345", 50, yPos + 30)
    this.ctx.fillText("+1 (555) 123-4567 | service@PRABATH MOTORS.com", 50, yPos + 50)

    return yPos + 80
  }

  private drawInvoiceInfo(invoice: InvoiceData, yPos: number): void {
    this.ctx.fillStyle = "#000000"
    this.ctx.font = "bold 20px Arial"
    this.ctx.fillText("INVOICE", 600, yPos)

    this.ctx.font = "12px Arial"
    this.ctx.fillText(`Invoice #: ${invoice.number}`, 600, yPos + 30)
    this.ctx.fillText(`Date: ${invoice.date}`, 600, yPos + 50)
    this.ctx.fillText(`Due Date: ${invoice.dueDate}`, 600, yPos + 70)
    this.ctx.fillText(`Status: ${invoice.status}`, 600, yPos + 90)
  }

  private drawDivider(yPos: number): number {
    this.ctx.strokeStyle = "#1A66B3"
    this.ctx.lineWidth = 2
    this.ctx.beginPath()
    this.ctx.moveTo(50, yPos)
    this.ctx.lineTo(744, yPos)
    this.ctx.stroke()
    return yPos + 30
  }

  private drawCustomerInfo(invoice: InvoiceData, yPos: number): number {
    this.ctx.fillStyle = "#1A66B3"
    this.ctx.font = "bold 14px Arial"
    this.ctx.fillText("Bill To:", 50, yPos)
    this.ctx.fillText("Vehicle Information:", 400, yPos)

    this.ctx.fillStyle = "#000000"
    this.ctx.font = "12px Arial"
    this.ctx.fillText(invoice.customer.name, 50, yPos + 25)
    this.ctx.fillText(`${invoice.vehicle.year} ${invoice.vehicle.make} ${invoice.vehicle.model}`, 400, yPos + 25)
    this.ctx.fillText(invoice.customer.address, 50, yPos + 45)
    this.ctx.fillText(`License: ${invoice.vehicle.licensePlate}`, 400, yPos + 45)
    this.ctx.fillText(`Phone: ${invoice.customer.phone}`, 50, yPos + 65)
    this.ctx.fillText(`Email: ${invoice.customer.email}`, 50, yPos + 85)

    return yPos + 120
  }

  private drawItemsTable(invoice: InvoiceData, yPos: number): number {
    // Table header
    this.ctx.fillStyle = "#1A66B3"
    this.ctx.fillRect(50, yPos, 694, 30)
    this.ctx.fillStyle = "#ffffff"
    this.ctx.font = "bold 12px Arial"
    this.ctx.fillText("Description", 60, yPos + 20)
    this.ctx.fillText("Qty", 400, yPos + 20)
    this.ctx.fillText("Unit Price", 500, yPos + 20)
    this.ctx.fillText("Amount", 650, yPos + 20)
    yPos += 30

    // Table rows
    this.ctx.fillStyle = "#000000"
    this.ctx.font = "12px Arial"
    invoice.items.forEach((item, index) => {
      if (index % 2 === 0) {
        this.ctx.fillStyle = "#f9f9f9"
        this.ctx.fillRect(50, yPos, 694, 25)
      }
      this.ctx.fillStyle = "#000000"
      this.ctx.fillText(item.description, 60, yPos + 18)
      this.ctx.fillText(item.quantity.toString(), 400, yPos + 18)
      this.ctx.fillText(`$${item.unitPrice.toFixed(2)}`, 500, yPos + 18)
      this.ctx.fillText(`$${item.total.toFixed(2)}`, 650, yPos + 18)
      yPos += 25
    })

    return yPos + 20
  }

  private drawTotals(invoice: InvoiceData, yPos: number): number {
    const totalsX = 550

    this.ctx.fillStyle = "#000000"
    this.ctx.font = "12px Arial"
    this.ctx.fillText("Subtotal:", totalsX, yPos)
    this.ctx.fillText(`$${invoice.subtotal.toFixed(2)}`, 650, yPos)
    yPos += 20

    this.ctx.fillText("Tax:", totalsX, yPos)
    this.ctx.fillText(`$${invoice.tax.toFixed(2)}`, 650, yPos)
    yPos += 20

    // Final total
    this.ctx.fillStyle = "#1A66B3"
    this.ctx.fillRect(totalsX - 10, yPos - 5, 204, 25)
    this.ctx.fillStyle = "#ffffff"
    this.ctx.font = "bold 12px Arial"
    this.ctx.fillText("TOTAL:", totalsX, yPos + 12)
    this.ctx.fillText(`$${invoice.total.toFixed(2)}`, 650, yPos + 12)

    return yPos + 40
  }

  private drawFooter(yPos: number): void {
    this.ctx.fillStyle = "#000000"
    this.ctx.font = "12px Arial"
    this.ctx.fillText("Payment Terms: Payment due within 7 days of invoice date.", 50, yPos)
    this.ctx.fillText("Thank you for your business!", 50, yPos + 20)
  }

  downloadBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }
}
