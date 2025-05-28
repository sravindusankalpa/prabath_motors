import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Car, Plus, Search, AlertTriangle, FileDown, FileUp } from "lucide-react"
import { DashboardNav } from "@/components/dashboard-nav"

export default function InventoryPage() {
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
            <h1 className="text-2xl font-bold tracking-tight">Parts Inventory</h1>
            <div className="flex gap-2">
              <Button variant="outline">
                <FileDown className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Button variant="outline">
                <FileUp className="mr-2 h-4 w-4" />
                Import
              </Button>
              <Button asChild>
                <Link href="/inventory/add">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Part
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Parts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,248</div>
                <p className="text-xs text-muted-foreground">Across 42 categories</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$124,568.00</div>
                <p className="text-xs text-muted-foreground">+$12,234 from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-500">24</div>
                <p className="text-xs text-muted-foreground">Require attention</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-500">7</div>
                <p className="text-xs text-muted-foreground">Need immediate reorder</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Parts Inventory</CardTitle>
              <CardDescription>Manage your parts inventory and stock levels</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input type="search" placeholder="Search parts by name, SKU, or category..." className="pl-8" />
                </div>
                <Button variant="outline">Filter</Button>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Part Name</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Stock</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    {
                      id: "1",
                      name: "Oil Filter",
                      sku: "FLT-OIL-1001",
                      category: "Filters",
                      stock: 45,
                      minStock: 10,
                      price: "$12.99",
                      status: "In Stock",
                    },
                    {
                      id: "2",
                      name: "Brake Pad Set (Front)",
                      sku: "BRK-PAD-2010",
                      category: "Brakes",
                      stock: 8,
                      minStock: 10,
                      price: "$89.95",
                      status: "Low Stock",
                    },
                    {
                      id: "3",
                      name: "Spark Plug",
                      sku: "ENG-SPK-3005",
                      category: "Engine",
                      stock: 120,
                      minStock: 30,
                      price: "$7.50",
                      status: "In Stock",
                    },
                    {
                      id: "4",
                      name: "Air Filter",
                      sku: "FLT-AIR-1002",
                      category: "Filters",
                      stock: 0,
                      minStock: 15,
                      price: "$18.75",
                      status: "Out of Stock",
                    },
                    {
                      id: "5",
                      name: "Transmission Fluid",
                      sku: "FLD-TRN-5001",
                      category: "Fluids",
                      stock: 28,
                      minStock: 10,
                      price: "$24.50",
                      status: "In Stock",
                    },
                    {
                      id: "6",
                      name: "Alternator",
                      sku: "ELC-ALT-7015",
                      category: "Electrical",
                      stock: 3,
                      minStock: 5,
                      price: "$175.00",
                      status: "Low Stock",
                    },
                    {
                      id: "7",
                      name: "Timing Belt Kit",
                      sku: "ENG-TBK-3050",
                      category: "Engine",
                      stock: 0,
                      minStock: 3,
                      price: "$129.99",
                      status: "Out of Stock",
                    },
                  ].map((part) => (
                    <TableRow key={part.id}>
                      <TableCell className="font-medium">{part.name}</TableCell>
                      <TableCell>{part.sku}</TableCell>
                      <TableCell>{part.category}</TableCell>
                      <TableCell className="text-right">
                        {part.stock}{" "}
                        {part.stock <= part.minStock && (
                          <AlertTriangle
                            className={`inline-block h-4 w-4 ml-1 ${
                              part.stock === 0 ? "text-red-500" : "text-amber-500"
                            }`}
                          />
                        )}
                      </TableCell>
                      <TableCell className="text-right">{part.price}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            part.status === "In Stock"
                              ? "outline"
                              : part.status === "Low Stock"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {part.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/inventory/${part.id}`}>View</Link>
                          </Button>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/inventory/${part.id}/edit`}>Edit</Link>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Low Stock Alert</CardTitle>
                <CardDescription>Parts that need to be reordered soon</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      name: "Brake Pad Set (Front)",
                      sku: "BRK-PAD-2010",
                      stock: 8,
                      minStock: 10,
                      supplier: "BrakeMaster Inc.",
                    },
                    {
                      name: "Alternator",
                      sku: "ELC-ALT-7015",
                      stock: 3,
                      minStock: 5,
                      supplier: "ElectroParts Co.",
                    },
                    {
                      name: "Cabin Air Filter",
                      sku: "FLT-CAB-1005",
                      stock: 6,
                      minStock: 10,
                      supplier: "FilterPro Supply",
                    },
                  ].map((part, i) => (
                    <div key={i} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                      <div>
                        <p className="font-medium">{part.name}</p>
                        <p className="text-sm text-muted-foreground">SKU: {part.sku}</p>
                        <p className="text-sm text-muted-foreground">Supplier: {part.supplier}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-amber-500 font-medium">
                          {part.stock} / {part.minStock}
                        </p>
                        <Button size="sm" className="mt-1" asChild>
                          <Link href="/inventory/purchase-orders/new">Reorder</Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Out of Stock</CardTitle>
                <CardDescription>Parts that need immediate attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      name: "Air Filter",
                      sku: "FLT-AIR-1002",
                      minStock: 15,
                      supplier: "FilterPro Supply",
                    },
                    {
                      name: "Timing Belt Kit",
                      sku: "ENG-TBK-3050",
                      minStock: 3,
                      supplier: "EngineParts Ltd.",
                    },
                    {
                      name: "Radiator Cap",
                      sku: "CLG-RAD-4002",
                      minStock: 8,
                      supplier: "CoolSystems Inc.",
                    },
                  ].map((part, i) => (
                    <div key={i} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                      <div>
                        <p className="font-medium">{part.name}</p>
                        <p className="text-sm text-muted-foreground">SKU: {part.sku}</p>
                        <p className="text-sm text-muted-foreground">Supplier: {part.supplier}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-red-500 font-medium">0 / {part.minStock}</p>
                        <Button size="sm" className="mt-1" asChild>
                          <Link href="/inventory/purchase-orders/new">Order Now</Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
