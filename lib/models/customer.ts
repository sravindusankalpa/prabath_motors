import type { ObjectId } from "mongodb"

export interface Customer {
  _id?: ObjectId
  id: string
  name: string
  email: string
  phone: string
  address: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateCustomerData {
  name: string
  email: string
  phone: string
  address: string
}

export interface UpdateCustomerData extends Partial<CreateCustomerData> {}
