import type { ObjectId } from "mongodb"

export interface Vehicle {
  _id?: ObjectId
  id: string
  customerId: string
  make: string
  model: string
  year: string
  licensePlate: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateVehicleData {
  customerId: string
  make: string
  model: string
  year: string
  licensePlate: string
}

export interface UpdateVehicleData extends Partial<CreateVehicleData> {}
