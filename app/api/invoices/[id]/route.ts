import { type NextRequest, NextResponse } from "next/server"
import { InvoiceService } from "@/lib/services/invoice-service"

const invoiceService = new InvoiceService()

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const invoice = await invoiceService.getInvoiceById(params.id)

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 })
    }

    return NextResponse.json(invoice)
  } catch (error) {
    console.error("Error fetching invoice:", error)
    return NextResponse.json({ error: "Failed to fetch invoice" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await request.json()
    const invoice = await invoiceService.updateInvoice(params.id, data)

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 })
    }

    return NextResponse.json(invoice)
  } catch (error) {
    console.error("Error updating invoice:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update invoice" },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const success = await invoiceService.deleteInvoice(params.id)

    if (!success) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Invoice deleted successfully" })
  } catch (error) {
    console.error("Error deleting invoice:", error)
    return NextResponse.json({ error: "Failed to delete invoice" }, { status: 500 })
  }
}
