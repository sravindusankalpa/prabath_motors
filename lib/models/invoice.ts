import type { ObjectId } from "mongodb"

export interface InvoiceItem {
  description: string
  quantity: number
  unitPrice: number
  total: number
}

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  address: string
}

export interface Vehicle {
  id: string
  make: string
  model: string
  year: string
  licensePlate: string
}

export interface Invoice {
  _id?: ObjectId
  id: string
  number: string
  date: string
  dueDate: string
  status: "Pending" | "Paid" | "Overdue" | "Cancelled"
  customer: Customer
  vehicle: Vehicle
  items: InvoiceItem[]
  subtotal: number
  taxRate: number
  tax: number
  total: number
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateInvoiceData {
  customerId: string
  vehicleId: string
  date: string
  dueDate: string
  items: Omit<InvoiceItem, "total">[]
  notes?: string
  taxRate: number
}

export interface UpdateInvoiceData extends Partial<CreateInvoiceData> {
  status?: "Pending" | "Paid" | "Overdue" | "Cancelled"
}
