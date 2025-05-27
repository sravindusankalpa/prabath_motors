import { getDatabase } from "@/lib/mongodb"
import type { Vehicle, CreateVehicleData, UpdateVehicleData } from "@/lib/models/vehicle"

export class VehicleService {
  private async getCollection() {
    const db = await getDatabase()
    return db.collection<Vehicle>("vehicles")
  }

  async createVehicle(data: CreateVehicleData): Promise<Vehicle> {
    const collection = await this.getCollection()

    const vehicleId = `veh_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const vehicle: Vehicle = {
      id: vehicleId,
      customerId: data.customerId,
      make: data.make,
      model: data.model,
      year: data.year,
      licensePlate: data.licensePlate,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await collection.insertOne(vehicle)
    return { ...vehicle, _id: result.insertedId }
  }

  async getVehicles(): Promise<Vehicle[]> {
    const collection = await this.getCollection()
    return await collection.find({}).sort({ createdAt: -1 }).toArray()
  }

  async getVehiclesByCustomerId(customerId: string): Promise<Vehicle[]> {
    const collection = await this.getCollection()
    return await collection.find({ customerId }).sort({ createdAt: -1 }).toArray()
  }

  async getVehicleById(id: string): Promise<Vehicle | null> {
    const collection = await this.getCollection()
    return await collection.findOne({ id })
  }

  async updateVehicle(id: string, data: UpdateVehicleData): Promise<Vehicle | null> {
    const collection = await this.getCollection()

    const updateData = {
      ...data,
      updatedAt: new Date(),
    }

    await collection.updateOne({ id }, { $set: updateData })
    return await collection.findOne({ id })
  }

  async deleteVehicle(id: string): Promise<boolean> {
    const collection = await this.getCollection()
    const result = await collection.deleteOne({ id })
    return result.deletedCount > 0
  }
}
