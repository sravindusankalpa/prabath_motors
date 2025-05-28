import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Car, Edit, ArrowUpDown, Truck, History } from "lucide-react"
import { DashboardNav } from "@/components/dashboard-nav"

export default function PartDetailPage({ params }: { params: { id: string } }) {
  const partId = params.id

  // Mock part data
  const part = {
    id: partId,
    name: "Oil Filter",
    sku: "FLT-OIL-1001",
    description:
      "High-quality oil filter compatible with most passenger vehicles. Removes contaminants and extends engine life.",
    category: "Filters",
    location: "Aisle B, Shelf 3",
    stock: 45,
    minStock: 10,
    maxStock: 100,
    costPrice: 8.5,
    sellingPrice: 12.99,
    supplier: {
      name: "FilterPro Supply",
      contactPerson: "John Smith",
      phone: "555-123-4567",
      email: "orders@filterpro.com",
    },
    compatibility: [
      "Toyota Camry (2015-2022)",
      "Honda Accord (2016-2022)",
      "Ford Fusion (2017-2020)",
      "Chevrolet Malibu (2018-2022)",
    ],
    transactions: [
      {
        date: "May 15, 2025",
        type: "Purchase",
        quantity: 50,
        reference: "PO-2025-0568",
      },
      {
        date: "May 12, 2025",
        type: "Usage",
        quantity: -5,
        reference: "REP-2025-1234",
      },
      {
        date: "May 10, 2025",
        type: "Usage",
        quantity: -3,
        reference: "REP-2025-1210",
      },
      {
        date: "May 5, 2025",
        type: "Adjustment",
        quantity: -2,
        reference: "ADJ-2025-0045",
      },
      {
        date: "April 28, 2025",
        type: "Purchase",
        quantity: 25,
        reference: "PO-2025-0489",
      },
    ],
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Car className="h-6 w-6" />
          <span>PRABATH MOTORS</span>
        </Link>
        <nav className="ml-auto flex gap-2">
          <Button variant="outline">Logout</Button>
        </nav>
      </header>
      <div className="flex flex-1">
        <DashboardNav />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{part.name}</h1>
              <p className="text-muted-foreground">SKU: {part.sku}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link href="/inventory">Back to Inventory</Link>
              </Button>
              <Button asChild>
                <Link href={`/inventory/${part.id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Part
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Part Details</CardTitle>
                <CardDescription>Detailed information about this part</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Category</p>
                    <p>{part.category}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Location</p>
                    <p>{part.location}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Cost Price</p>
                    <p>${part.costPrice.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Selling Price</p>
                    <p>${part.sellingPrice.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Markup</p>
                    <p>{(((part.sellingPrice - part.costPrice) / part.costPrice) * 100).toFixed(2)}%</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Profit Margin</p>
                    <p>${(part.sellingPrice - part.costPrice).toFixed(2)} per unit</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium">Description</p>
                  <p className="text-sm">{part.description}</p>
                </div>

                <div>
                  <p className="text-sm font-medium">Compatible With</p>
                  <ul className="list-disc pl-5 text-sm">
                    {part.compatibility.map((vehicle, i) => (
                      <li key={i}>{vehicle}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Inventory Status</CardTitle>
                <CardDescription>Current stock levels and thresholds</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Current Stock</span>
                  <Badge
                    variant={part.stock === 0 ? "destructive" : part.stock < part.minStock ? "secondary" : "outline"}
                    className="text-lg py-1 px-3"
                  >
                    {part.stock} units
                  </Badge>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span>Minimum Stock Level</span>
                    <span>{part.minStock} units</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Maximum Stock Level</span>
                    <span>{part.maxStock} units</span>
                  </div>
                </div>

                <div className="h-4 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      part.stock === 0 ? "bg-red-500" : part.stock < part.minStock ? "bg-amber-500" : "bg-green-500"
                    }`}
                    style={{ width: `${Math.min((part.stock / part.maxStock) * 100, 100)}%` }}
                  ></div>
                </div>

                <div className="pt-4 space-y-4">
                  <div>
                    <p className="text-sm font-medium">Supplier Information</p>
                    <div className="text-sm mt-1">
                      <p className="font-medium">{part.supplier.name}</p>
                      <p>Contact: {part.supplier.contactPerson}</p>
                      <p>Phone: {part.supplier.phone}</p>
                      <p>Email: {part.supplier.email}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button className="flex-1" asChild>
                      <Link href="/inventory/purchase-orders/new">
                        <Truck className="mr-2 h-4 w-4" />
                        Create Purchase Order
                      </Link>
                    </Button>
                    <Button variant="outline" className="flex-1" asChild>
                      <Link href="/inventory/adjust">
                        <ArrowUpDown className="mr-2 h-4 w-4" />
                        Adjust Stock
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>Record of all stock movements for this part</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <History className="mr-2 h-4 w-4" />
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Transaction Type</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead>Reference</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {part.transactions.map((transaction, i) => (
                    <TableRow key={i}>
                      <TableCell>{transaction.date}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            transaction.type === "Purchase"
                              ? "outline"
                              : transaction.type === "Usage"
                                ? "secondary"
                                : "default"
                          }
                        >
                          {transaction.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        <span
                          className={
                            transaction.quantity > 0 ? "text-green-600" : transaction.quantity < 0 ? "text-red-600" : ""
                          }
                        >
                          {transaction.quantity > 0 ? "+" : ""}
                          {transaction.quantity}
                        </span>
                      </TableCell>
                      <TableCell>{transaction.reference}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
