import { getDatabase } from "@/lib/mongodb"
import type { Invoice, CreateInvoiceData, UpdateInvoiceData } from "@/lib/models/invoice"
import type { Customer } from "@/lib/models/customer"
import type { Vehicle } from "@/lib/models/vehicle"

export class InvoiceService {
  private async getCollection() {
    const db = await getDatabase()
    return db.collection<Invoice>("invoices")
  }

  private async getCustomersCollection() {
    const db = await getDatabase()
    return db.collection<Customer>("customers")
  }

  private async getVehiclesCollection() {
    const db = await getDatabase()
    return db.collection<Vehicle>("vehicles")
  }

  async createInvoice(data: CreateInvoiceData): Promise<Invoice> {
    const collection = await this.getCollection()
    const customersCollection = await this.getCustomersCollection()
    const vehiclesCollection = await this.getVehiclesCollection()

    // Get customer and vehicle details
    const customer = await customersCollection.findOne({ id: data.customerId })
    const vehicle = await vehiclesCollection.findOne({ id: data.vehicleId })

    if (!customer) {
      throw new Error("Customer not found")
    }

    if (!vehicle) {
      throw new Error("Vehicle not found")
    }

    // Calculate totals
    const items = data.items.map((item) => ({
      ...item,
      total: item.quantity * item.unitPrice,
    }))

    const subtotal = items.reduce((sum, item) => sum + item.total, 0)
    const tax = (subtotal * data.taxRate) / 100
    const total = subtotal + tax

    // Generate invoice number
    const invoiceNumber = `INV-${Date.now()}`
    const invoiceId = `inv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const invoice: Invoice = {
      id: invoiceId,
      number: invoiceNumber,
      date: data.date,
      dueDate: data.dueDate,
      status: "Pending",
      customer: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
      },
      vehicle: {
        id: vehicle.id,
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
        licensePlate: vehicle.licensePlate,
      },
      items,
      subtotal,
      taxRate: data.taxRate,
      tax,
      total,
      notes: data.notes,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await collection.insertOne(invoice)
    return { ...invoice, _id: result.insertedId }
  }

  async getInvoices(): Promise<Invoice[]> {
    const collection = await this.getCollection()
    return await collection.find({}).sort({ createdAt: -1 }).toArray()
  }

  async getInvoiceById(id: string): Promise<Invoice | null> {
    const collection = await this.getCollection()
    return await collection.findOne({ id })
  }

  async updateInvoice(id: string, data: UpdateInvoiceData): Promise<Invoice | null> {
    const collection = await this.getCollection()
    const customersCollection = await this.getCustomersCollection()
    const vehiclesCollection = await this.getVehiclesCollection()

    const existingInvoice = await collection.findOne({ id })
    if (!existingInvoice) {
      throw new Error("Invoice not found")
    }

    const updateData: Partial<Invoice> = {
      updatedAt: new Date(),
    }

    // If customer or vehicle is being updated, fetch new details
    if (data.customerId && data.customerId !== existingInvoice.customer.id) {
      const customer = await customersCollection.findOne({ id: data.customerId })
      if (!customer) {
        throw new Error("Customer not found")
      }
      updateData.customer = {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
      }
    }

    if (data.vehicleId && data.vehicleId !== existingInvoice.vehicle.id) {
      const vehicle = await vehiclesCollection.findOne({ id: data.vehicleId })
      if (!vehicle) {
        throw new Error("Vehicle not found")
      }
      updateData.vehicle = {
        id: vehicle.id,
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
        licensePlate: vehicle.licensePlate,
      }
    }

    // Update other fields
    if (data.date) updateData.date = data.date
    if (data.dueDate) updateData.dueDate = data.dueDate
    if (data.notes !== undefined) updateData.notes = data.notes
    if (data.status) updateData.status = data.status

    // Recalculate totals if items or tax rate changed
    if (data.items || data.taxRate) {
      const items = data.items
        ? data.items.map((item) => ({
            ...item,
            total: item.quantity * item.unitPrice,
          }))
        : existingInvoice.items

      const taxRate = data.taxRate !== undefined ? data.taxRate : existingInvoice.taxRate
      const subtotal = items.reduce((sum, item) => sum + item.total, 0)
      const tax = (subtotal * taxRate) / 100
      const total = subtotal + tax

      updateData.items = items
      updateData.taxRate = taxRate
      updateData.subtotal = subtotal
      updateData.tax = tax
      updateData.total = total
    }

    await collection.updateOne({ id }, { $set: updateData })
    return await collection.findOne({ id })
  }

  async deleteInvoice(id: string): Promise<boolean> {
    const collection = await this.getCollection()
    const result = await collection.deleteOne({ id })
    return result.deletedCount > 0
  }
}
