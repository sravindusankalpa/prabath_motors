import { type NextRequest, NextResponse } from "next/server"
import { InvoiceService } from "@/lib/services/invoice-service"

const invoiceService = new InvoiceService()

export async function GET() {
  try {
    const invoices = await invoiceService.getInvoices()
    return NextResponse.json(invoices)
  } catch (error) {
    console.error("Error fetching invoices:", error)
    return NextResponse.json({ error: "Failed to fetch invoices" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const invoice = await invoiceService.createInvoice(data)
    return NextResponse.json(invoice, { status: 201 })
  } catch (error) {
    console.error("Error creating invoice:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create invoice" },
      { status: 500 },
    )
  }
}
