import { getDatabase } from "@/lib/mongodb"
import type { Customer } from "@/lib/models/customer"
import type { Vehicle } from "@/lib/models/vehicle"
import type { Invoice } from "@/lib/models/invoice"

export async function seedDatabase() {
  const db = await getDatabase()

  // Check if data already exists
  const existingCustomers = await db.collection("customers").countDocuments()
  if (existingCustomers > 0) {
    console.log("Database already seeded")
    return
  }

  console.log("Seeding database with sample data...")

  // Sample customers
  const customers: Customer[] = [
    {
      id: "cust_1",
      name: "John Doe",
      email: "john.doe@email.com",
      phone: "555-123-4567",
      address: "123 Main St, Anytown, CA 12345",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "cust_2",
      name: "Jane Smith",
      email: "jane.smith@email.com",
      phone: "555-987-6543",
      address: "456 Oak St, Somewhere, CA 54321",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "cust_3",
      name: "Robert Johnson",
      email: "robert.johnson@email.com",
      phone: "555-456-7890",
      address: "789 Pine St, Elsewhere, CA 67890",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "cust_4",
      name: "Emily Davis",
      email: "emily.davis@email.com",
      phone: "555-321-9876",
      address: "321 Elm St, Another City, CA 13579",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "cust_5",
      name: "Michael Brown",
      email: "michael.brown@email.com",
      phone: "555-654-3210",
      address: "654 Maple Ave, Different Town, CA 24680",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]

  // Sample vehicles
  const vehicles: Vehicle[] = [
    {
      id: "veh_1",
      customerId: "cust_1",
      make: "Toyota",
      model: "Camry",
      year: "2018",
      licensePlate: "ABC123",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "veh_2",
      customerId: "cust_1",
      make: "Honda",
      model: "Accord",
      year: "2020",
      licensePlate: "DEF456",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "veh_3",
      customerId: "cust_2",
      make: "Honda",
      model: "Civic",
      year: "2020",
      licensePlate: "XYZ789",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "veh_4",
      customerId: "cust_3",
      make: "Ford",
      model: "F-150",
      year: "2019",
      licensePlate: "GHI012",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "veh_5",
      customerId: "cust_4",
      make: "Nissan",
      model: "Altima",
      year: "2021",
      licensePlate: "JKL345",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "veh_6",
      customerId: "cust_5",
      make: "BMW",
      model: "3 Series",
      year: "2020",
      licensePlate: "MNO678",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]

  // Sample invoices
  const invoices: Invoice[] = [
    {
      id: "inv_1",
      number: "INV-1001",
      date: "2025-05-18",
      dueDate: "2025-05-25",
      status: "Paid",
      customer: customers[0],
      vehicle: vehicles[0],
      items: [
        {
          description: "Oil Change - Standard oil change with filter replacement",
          quantity: 1,
          unitPrice: 45.0,
          total: 45.0,
        },
        {
          description: "Oil Filter - Replacement oil filter",
          quantity: 1,
          unitPrice: 15.0,
          total: 15.0,
        },
        {
          description: "Labor - Standard Service",
          quantity: 0.5,
          unitPrice: 80.0,
          total: 40.0,
        },
      ],
      subtotal: 100.0,
      taxRate: 8,
      tax: 8.0,
      total: 108.0,
      notes: "Vehicle was inspected and all fluids were topped off. Recommended brake service in the next 3 months.",
      createdAt: new Date("2025-05-18"),
      updatedAt: new Date("2025-05-18"),
    },
    {
      id: "inv_2",
      number: "INV-1002",
      date: "2025-05-17",
      dueDate: "2025-05-24",
      status: "Paid",
      customer: customers[1],
      vehicle: vehicles[2],
      items: [
        {
          description: "Brake Replacement (Front) - Front brake pad replacement",
          quantity: 1,
          unitPrice: 180.0,
          total: 180.0,
        },
        {
          description: "Brake Pads - High-quality brake pads",
          quantity: 1,
          unitPrice: 70.0,
          total: 70.0,
        },
        {
          description: "Labor - Standard Service",
          quantity: 1.5,
          unitPrice: 80.0,
          total: 120.0,
        },
      ],
      subtotal: 370.0,
      taxRate: 8,
      tax: 29.6,
      total: 399.6,
      notes:
        "Brake pads were completely worn. Rotors were resurfaced. Customer should return in 6 months for inspection.",
      createdAt: new Date("2025-05-17"),
      updatedAt: new Date("2025-05-17"),
    },
    {
      id: "inv_3",
      number: "INV-1003",
      date: "2025-05-16",
      dueDate: "2025-05-23",
      status: "Pending",
      customer: customers[2],
      vehicle: vehicles[3],
      items: [
        {
          description: "Transmission Fluid Change - Drain and replace transmission fluid",
          quantity: 1,
          unitPrice: 220.0,
          total: 220.0,
        },
        {
          description: "Transmission Fluid - High-quality transmission fluid",
          quantity: 1,
          unitPrice: 65.0,
          total: 65.0,
        },
      ],
      subtotal: 285.0,
      taxRate: 8,
      tax: 22.8,
      total: 307.8,
      notes: "Transmission fluid was dark and needed replacement. Recommended service every 30,000 miles.",
      createdAt: new Date("2025-05-16"),
      updatedAt: new Date("2025-05-16"),
    },
    {
      id: "inv_4",
      number: "INV-1004",
      date: "2025-05-15",
      dueDate: "2025-05-22",
      status: "Paid",
      customer: customers[3],
      vehicle: vehicles[4],
      items: [
        {
          description: "Tire Rotation - Rotate and balance all tires",
          quantity: 1,
          unitPrice: 75.0,
          total: 75.0,
        },
      ],
      subtotal: 75.0,
      taxRate: 8,
      tax: 6.0,
      total: 81.0,
      notes: "All tires rotated and balanced. Tire pressure checked and adjusted.",
      createdAt: new Date("2025-05-15"),
      updatedAt: new Date("2025-05-15"),
    },
    {
      id: "inv_5",
      number: "INV-1005",
      date: "2025-05-14",
      dueDate: "2025-05-21",
      status: "Pending",
      customer: customers[4],
      vehicle: vehicles[5],
      items: [
        {
          description: "Engine Diagnostics - Computer diagnostics for engine issues",
          quantity: 1,
          unitPrice: 120.0,
          total: 120.0,
        },
        {
          description: "Spark Plug Replacement - Replace spark plugs",
          quantity: 1,
          unitPrice: 120.0,
          total: 120.0,
        },
        {
          description: "Labor - Complex Service",
          quantity: 1,
          unitPrice: 95.0,
          total: 95.0,
        },
      ],
      subtotal: 335.0,
      taxRate: 8,
      tax: 26.8,
      total: 361.8,
      notes: "Engine misfiring issue resolved. Spark plugs were fouled and replaced. Engine running smoothly now.",
      createdAt: new Date("2025-05-14"),
      updatedAt: new Date("2025-05-14"),
    },
    {
      id: "inv_6",
      number: "INV-1006",
      date: "2025-05-13",
      dueDate: "2025-05-20",
      status: "Overdue",
      customer: customers[0],
      vehicle: vehicles[1],
      items: [
        {
          description: "AC Service - Air conditioning system check and recharge",
          quantity: 1,
          unitPrice: 180.0,
          total: 180.0,
        },
        {
          description: "Refrigerant - AC refrigerant refill",
          quantity: 1,
          unitPrice: 45.0,
          total: 45.0,
        },
      ],
      subtotal: 225.0,
      taxRate: 8,
      tax: 18.0,
      total: 243.0,
      notes: "AC system was low on refrigerant. System recharged and cooling properly now.",
      createdAt: new Date("2025-05-13"),
      updatedAt: new Date("2025-05-13"),
    },
  ]

  try {
    // Insert customers
    await db.collection("customers").insertMany(customers)
    console.log(`Inserted ${customers.length} customers`)

    // Insert vehicles
    await db.collection("vehicles").insertMany(vehicles)
    console.log(`Inserted ${vehicles.length} vehicles`)

    // Insert invoices
    await db.collection("invoices").insertMany(invoices)
    console.log(`Inserted ${invoices.length} invoices`)

    console.log("Database seeding completed successfully!")
  } catch (error) {
    console.error("Error seeding database:", error)
    throw error
  }
}
