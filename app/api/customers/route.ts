import { type NextRequest, NextResponse } from "next/server"
import { CustomerService } from "@/lib/services/customer-service"

const customerService = new CustomerService()

export async function GET() {
  try {
    const customers = await customerService.getCustomers()
    return NextResponse.json(customers)
  } catch (error) {
    console.error("Error fetching customers:", error)
    return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const customer = await customerService.createCustomer(data)
    return NextResponse.json(customer, { status: 201 })
  } catch (error) {
    console.error("Error creating customer:", error)
    return NextResponse.json({ error: "Failed to create customer" }, { status: 500 })
  }
}
