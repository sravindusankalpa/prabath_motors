import { type NextRequest, NextResponse } from "next/server"
import { VehicleService } from "@/lib/services/vehicle-service"

const vehicleService = new VehicleService()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const customerId = searchParams.get("customerId")

    let vehicles
    if (customerId) {
      vehicles = await vehicleService.getVehiclesByCustomerId(customerId)
    } else {
      vehicles = await vehicleService.getVehicles()
    }

    return NextResponse.json(vehicles)
  } catch (error) {
    console.error("Error fetching vehicles:", error)
    return NextResponse.json({ error: "Failed to fetch vehicles" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const vehicle = await vehicleService.createVehicle(data)
    return NextResponse.json(vehicle, { status: 201 })
  } catch (error) {
    console.error("Error creating vehicle:", error)
    return NextResponse.json({ error: "Failed to create vehicle" }, { status: 500 })
  }
}
