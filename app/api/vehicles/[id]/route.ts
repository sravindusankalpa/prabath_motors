import { type NextRequest, NextResponse } from "next/server"
import { VehicleService } from "@/lib/services/vehicle-service"

const vehicleService = new VehicleService()

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const vehicle = await vehicleService.getVehicleById(params.id)

    if (!vehicle) {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 })
    }

    return NextResponse.json(vehicle)
  } catch (error) {
    console.error("Error fetching vehicle:", error)
    return NextResponse.json({ error: "Failed to fetch vehicle" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await request.json()
    const vehicle = await vehicleService.updateVehicle(params.id, data)

    if (!vehicle) {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 })
    }

    return NextResponse.json(vehicle)
  } catch (error) {
    console.error("Error updating vehicle:", error)
    return NextResponse.json({ error: "Failed to update vehicle" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const success = await vehicleService.deleteVehicle(params.id)

    if (!success) {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Vehicle deleted successfully" })
  } catch (error) {
    console.error("Error deleting vehicle:", error)
    return NextResponse.json({ error: "Failed to delete vehicle" }, { status: 500 })
  }
}
