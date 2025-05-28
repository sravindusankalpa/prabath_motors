import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Car, Plus, Search } from "lucide-react"
import { DashboardNav } from "@/components/dashboard-nav"

export default function SuppliersPage() {
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
            <h1 className="text-2xl font-bold tracking-tight">Suppliers</h1>
            <Button asChild>
              <Link href="/inventory/suppliers/add">
                <Plus className="mr-2 h-4 w-4" />
                Add Supplier
              </Link>
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Supplier Management</CardTitle>
              <CardDescription>Manage your parts suppliers and vendor relationships</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input type="search" placeholder="Search suppliers..." className="pl-8" />
                </div>
                <Button variant="outline">Filter</Button>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Supplier Name</TableHead>
                    <TableHead>Contact Person</TableHead>
                    <TableHead>Contact Information</TableHead>
                    <TableHead>Parts Supplied</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    {
                      id: "1",
                      name: "FilterPro Supply",
                      contactPerson: "John Smith",
                      email: "orders@filterpro.com",
                      phone: "555-123-4567",
                      partsCount: 45,
                      status: "Active",
                    },
                    {
                      id: "2",
                      name: "BrakeMaster Inc.",
                      contactPerson: "Sarah Johnson",
                      email: "sales@brakemaster.com",
                      phone: "555-987-6543",
                      partsCount: 32,
                      status: "Active",
                    },
                    {
                      id: "3",
                      name: "EngineParts Ltd.",
                      contactPerson: "Michael Brown",
                      email: "orders@engineparts.com",
                      phone: "555-456-7890",
                      partsCount: 78,
                      status: "Active",
                    },
                    {
                      id: "4",
                      name: "ElectroParts Co.",
                      contactPerson: "Jessica Williams",
                      email: "support@electroparts.com",
                      phone: "555-789-0123",
                      partsCount: 56,
                      status: "Inactive",
                    },
                    {
                      id: "5",
                      name: "CoolSystems Inc.",
                      contactPerson: "David Lee",
                      email: "sales@coolsystems.com",
                      phone: "555-234-5678",
                      partsCount: 29,
                      status: "Active",
                    },
                  ].map((supplier) => (
                    <TableRow key={supplier.id}>
                      <TableCell className="font-medium">{supplier.name}</TableCell>
                      <TableCell>{supplier.contactPerson}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{supplier.email}</div>
                          <div className="text-muted-foreground">{supplier.phone}</div>
                        </div>
                      </TableCell>
                      <TableCell>{supplier.partsCount} parts</TableCell>
                      <TableCell>
                        <Badge variant={supplier.status === "Active" ? "outline" : "secondary"}>
                          {supplier.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/inventory/suppliers/${supplier.id}`}>View</Link>
                          </Button>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/inventory/suppliers/${supplier.id}/edit`}>Edit</Link>
                          </Button>
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
