import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Car, Search } from "lucide-react"
import { DashboardNav } from "@/components/dashboard-nav"

export default function RepairStatusPage() {
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
            <h1 className="text-2xl font-bold tracking-tight">Repair Status Tracker</h1>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Active Repairs</CardTitle>
              <CardDescription>Track and update the status of all vehicle repairs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input type="search" placeholder="Search by customer, vehicle, or service..." className="pl-8" />
                </div>
                <Button variant="outline">Filter</Button>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    {
                      id: "1",
                      customer: "John Doe",
                      vehicle: "Toyota Camry (2018)",
                      service: "Oil Change",
                      startDate: "May 20, 2025",
                      status: "In Progress",
                      lastUpdated: "Today, 10:30 AM",
                    },
                    {
                      id: "2",
                      customer: "Jane Smith",
                      vehicle: "Ford F-150 (2019)",
                      service: "Brake Replacement",
                      startDate: "May 19, 2025",
                      status: "Parts Ordered",
                      lastUpdated: "Today, 9:15 AM",
                    },
                    {
                      id: "3",
                      customer: "Robert Johnson",
                      vehicle: "Chevrolet Malibu (2017)",
                      service: "Engine Diagnostics",
                      startDate: "May 18, 2025",
                      status: "Waiting for Approval",
                      lastUpdated: "Yesterday, 4:45 PM",
                    },
                    {
                      id: "4",
                      customer: "Emily Davis",
                      vehicle: "Nissan Altima (2021)",
                      service: "Tire Rotation",
                      startDate: "May 20, 2025",
                      status: "Vehicle Received",
                      lastUpdated: "Today, 8:30 AM",
                    },
                    {
                      id: "5",
                      customer: "Michael Brown",
                      vehicle: "BMW 3 Series (2020)",
                      service: "AC Service",
                      startDate: "May 17, 2025",
                      status: "Completed",
                      lastUpdated: "Yesterday, 2:00 PM",
                    },
                  ].map((repair, i) => (
                    <TableRow key={i}>
                      <TableCell>{repair.customer}</TableCell>
                      <TableCell>{repair.vehicle}</TableCell>
                      <TableCell>{repair.service}</TableCell>
                      <TableCell>{repair.startDate}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            repair.status === "Completed"
                              ? "outline"
                              : repair.status === "In Progress"
                                ? "secondary"
                                : repair.status === "Waiting for Approval"
                                  ? "destructive"
                                  : "default"
                          }
                        >
                          {repair.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{repair.lastUpdated}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/bookings/${repair.id}`}>Update</Link>
                          </Button>
                          <Button size="sm" asChild>
                            <Link href={`/invoices/generate-pdf`}>Invoice</Link>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Repair Status Overview</CardTitle>
              <CardDescription>Summary of all repair statuses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-muted/20 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold">3</div>
                  <div className="text-sm text-muted-foreground">Vehicle Received</div>
                </div>
                <div className="bg-muted/20 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold">5</div>
                  <div className="text-sm text-muted-foreground">In Progress</div>
                </div>
                <div className="bg-muted/20 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold">2</div>
                  <div className="text-sm text-muted-foreground">Waiting for Approval</div>
                </div>
                <div className="bg-muted/20 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold">8</div>
                  <div className="text-sm text-muted-foreground">Completed Today</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
