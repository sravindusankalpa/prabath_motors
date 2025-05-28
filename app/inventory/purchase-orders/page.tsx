import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Car, Plus, Search } from "lucide-react"
import { DashboardNav } from "@/components/dashboard-nav"

export default function PurchaseOrdersPage() {
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
            <h1 className="text-2xl font-bold tracking-tight">Purchase Orders</h1>
            <Button asChild>
              <Link href="/inventory/purchase-orders/new">
                <Plus className="mr-2 h-4 w-4" />
                Create Purchase Order
              </Link>
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Purchase Order Management</CardTitle>
              <CardDescription>Track and manage orders for inventory replenishment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input type="search" placeholder="Search purchase orders..." className="pl-8" />
                </div>
                <Button variant="outline">Filter</Button>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>PO Number</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Date Created</TableHead>
                    <TableHead>Expected Delivery</TableHead>
                    <TableHead className="text-right">Total Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    {
                      id: "PO-2025-0568",
                      supplier: "FilterPro Supply",
                      dateCreated: "May 15, 2025",
                      expectedDelivery: "May 22, 2025",
                      totalAmount: "$1,245.50",
                      status: "Ordered",
                    },
                    {
                      id: "PO-2025-0567",
                      supplier: "BrakeMaster Inc.",
                      dateCreated: "May 14, 2025",
                      expectedDelivery: "May 21, 2025",
                      totalAmount: "$2,890.75",
                      status: "Pending",
                    },
                    {
                      id: "PO-2025-0566",
                      supplier: "EngineParts Ltd.",
                      dateCreated: "May 12, 2025",
                      expectedDelivery: "May 19, 2025",
                      totalAmount: "$3,450.00",
                      status: "Shipped",
                    },
                    {
                      id: "PO-2025-0565",
                      supplier: "CoolSystems Inc.",
                      dateCreated: "May 10, 2025",
                      expectedDelivery: "May 17, 2025",
                      totalAmount: "$875.25",
                      status: "Received",
                    },
                    {
                      id: "PO-2025-0564",
                      supplier: "ElectroParts Co.",
                      dateCreated: "May 8, 2025",
                      expectedDelivery: "May 15, 2025",
                      totalAmount: "$1,650.00",
                      status: "Received",
                    },
                  ].map((po) => (
                    <TableRow key={po.id}>
                      <TableCell className="font-medium">{po.id}</TableCell>
                      <TableCell>{po.supplier}</TableCell>
                      <TableCell>{po.dateCreated}</TableCell>
                      <TableCell>{po.expectedDelivery}</TableCell>
                      <TableCell className="text-right">{po.totalAmount}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            po.status === "Received"
                              ? "outline"
                              : po.status === "Shipped"
                                ? "secondary"
                                : po.status === "Ordered"
                                  ? "default"
                                  : "destructive"
                          }
                        >
                          {po.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/inventory/purchase-orders/${po.id}`}>View</Link>
                          </Button>
                          {po.status !== "Received" && (
                            <Button size="sm" asChild>
                              <Link href={`/inventory/purchase-orders/${po.id}/receive`}>Receive</Link>
                            </Button>
                          )}
                        </div>
                      </TableCell>
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
