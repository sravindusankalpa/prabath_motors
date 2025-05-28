import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Car, Download, Printer, Truck } from "lucide-react"
import { DashboardNav } from "@/components/dashboard-nav"

export default function PurchaseOrderDetailPage({ params }: { params: { id: string } }) {
  const poId = params.id

  // Mock purchase order data
  const purchaseOrder = {
    id: poId,
    number: poId,
    dateCreated: "May 15, 2025",
    expectedDelivery: "May 22, 2025",
    status: "Ordered",
    supplier: {
      name: "FilterPro Supply",
      contactPerson: "John Smith",
      phone: "555-123-4567",
      email: "orders@filterpro.com",
      address: "123 Supplier St, Vendor City, VC 12345",
    },
    items: [
      {
        partName: "Oil Filter",
        sku: "FLT-OIL-1001",
        quantity: 50,
        unitPrice: 8.5,
        total: 425.0,
      },
      {
        partName: "Air Filter",
        sku: "FLT-AIR-1002",
        quantity: 30,
        unitPrice: 12.5,
        total: 375.0,
      },
      {
        partName: "Cabin Air Filter",
        sku: "FLT-CAB-1005",
        quantity: 25,
        unitPrice: 15.0,
        total: 375.0,
      },
      {
        partName: "Oil Filter Wrench",
        sku: "TLS-OIL-2001",
        quantity: 5,
        unitPrice: 14.1,
        total: 70.5,
      },
    ],
    subtotal: 1245.5,
    tax: 0,
    total: 1245.5,
    notes: "Please deliver during business hours (8am-5pm). Contact garage manager upon arrival.",
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
              <h1 className="text-2xl font-bold tracking-tight">Purchase Order #{purchaseOrder.number}</h1>
              <p className="text-muted-foreground">Created on {purchaseOrder.dateCreated}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link href="/inventory/purchase-orders">Back to Purchase Orders</Link>
              </Button>
              <Button variant="outline" size="icon">
                <Printer className="h-4 w-4" />
                <span className="sr-only">Print</span>
              </Button>
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
                <span className="sr-only">Download</span>
              </Button>
              {purchaseOrder.status !== "Received" && (
                <Button asChild>
                  <Link href={`/inventory/purchase-orders/${purchaseOrder.id}/receive`}>
                    <Truck className="mr-2 h-4 w-4" />
                    Receive Items
                  </Link>
                </Button>
              )}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Purchase Order Details</CardTitle>
                    <CardDescription>Basic information about this order</CardDescription>
                  </div>
                  <Badge
                    variant={
                      purchaseOrder.status === "Received"
                        ? "outline"
                        : purchaseOrder.status === "Shipped"
                          ? "secondary"
                          : purchaseOrder.status === "Ordered"
                            ? "default"
                            : "destructive"
                    }
                    className="text-sm"
                  >
                    {purchaseOrder.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">PO Number</p>
                    <p>{purchaseOrder.number}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Date Created</p>
                    <p>{purchaseOrder.dateCreated}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Expected Delivery</p>
                    <p>{purchaseOrder.expectedDelivery}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Status</p>
                    <Badge
                      variant={
                        purchaseOrder.status === "Received"
                          ? "outline"
                          : purchaseOrder.status === "Shipped"
                            ? "secondary"
                            : purchaseOrder.status === "Ordered"
                              ? "default"
                              : "destructive"
                      }
                    >
                      {purchaseOrder.status}
                    </Badge>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium">Notes</p>
                  <p className="text-sm">{purchaseOrder.notes}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Supplier Information</CardTitle>
                <CardDescription>Details about the supplier for this order</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-medium">{purchaseOrder.supplier.name}</p>
                  <p>{purchaseOrder.supplier.address}</p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span>Contact Person:</span>
                    <span>{purchaseOrder.supplier.contactPerson}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Phone:</span>
                    <span>{purchaseOrder.supplier.phone}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Email:</span>
                    <span>{purchaseOrder.supplier.email}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
              <CardDescription>Parts included in this purchase order</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Part Name</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="text-right">Unit Price</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {purchaseOrder.items.map((item, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{item.partName}</TableCell>
                      <TableCell>{item.sku}</TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell className="text-right">${item.unitPrice.toFixed(2)}</TableCell>
                      <TableCell className="text-right">${item.total.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="flex justify-end mt-6">
                <div className="w-1/3 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${purchaseOrder.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span>${purchaseOrder.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-medium border-t pt-2">
                    <span>Total:</span>
                    <span>${purchaseOrder.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
