import { getDatabase } from "@/lib/mongodb"
import type { Customer, CreateCustomerData, UpdateCustomerData } from "@/lib/models/customer"

export class CustomerService {
  private async getCollection() {
    const db = await getDatabase()
    return db.collection<Customer>("customers")
  }

  async createCustomer(data: CreateCustomerData): Promise<Customer> {
    const collection = await this.getCollection()

    const customerId = `cust_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const customer: Customer = {
      id: customerId,
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await collection.insertOne(customer)
    return { ...customer, _id: result.insertedId }
  }

  async getCustomers(): Promise<Customer[]> {
    const collection = await this.getCollection()
    return await collection.find({}).sort({ name: 1 }).toArray()
  }

  async getCustomerById(id: string): Promise<Customer | null> {
    const collection = await this.getCollection()
    return await collection.findOne({ id })
  }

  async updateCustomer(id: string, data: UpdateCustomerData): Promise<Customer | null> {
    const collection = await this.getCollection()

    const updateData = {
      ...data,
      updatedAt: new Date(),
    }

    await collection.updateOne({ id }, { $set: updateData })
    return await collection.findOne({ id })
  }

  async deleteCustomer(id: string): Promise<boolean> {
    const collection = await this.getCollection()
    const result = await collection.deleteOne({ id })
    return result.deletedCount > 0
  }
}
