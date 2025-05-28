"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDays, Car, CreditCard, Settings, Users, Wrench, Printer } from "lucide-react"
import { DashboardNav } from "@/components/dashboard-nav"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { UserNav } from "@/components/user-nav"

export default function DashboardPage() {
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return null // Don't render anything while redirecting
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Car className="h-6 w-6" />
          <span>PRABATH MOTORS</span>
        </Link>
        <nav className="ml-auto flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
            <span className="sr-only">Settings</span>
          </Button>
          <Button variant="outline" onClick={() => window.print()}>
            <Printer className="mr-2 h-4 w-4" />
            Generate PDF
          </Button>
          <UserNav />
        </nav>
      </header>
      <div className="flex flex-1">
        <DashboardNav />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold tracking-tight">Welcome, {user?.name}</h1>
            <span className="ml-2 rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
              {user?.role}
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$45,231.89</div>
                <p className="text-xs text-muted-foreground">+20.1% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Customers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+2350</div>
                <p className="text-xs text-muted-foreground">+180.1% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+12,234</div>
                <p className="text-xs text-muted-foreground">+19% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Services Completed</CardTitle>
                <Wrench className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+573</div>
                <p className="text-xs text-muted-foreground">+201 since last week</p>
              </CardContent>
            </Card>
          </div>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="bookings">Recent Bookings</TabsTrigger>
              <TabsTrigger value="invoices">Recent Invoices</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Weekly Revenue</CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <div className="h-[200px] w-full bg-muted/20 rounded-md flex items-center justify-center text-muted-foreground">
                      Revenue Chart
                    </div>
                  </CardContent>
                </Card>
                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>Recent Activities</CardTitle>
                    <CardDescription>You have completed 5 services today</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium leading-none">Oil Change - Toyota Camry</p>
                          <p className="text-sm text-muted-foreground">Completed 2 hours ago</p>
                        </div>
                        <div className="font-medium">$45.00</div>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium leading-none">Brake Replacement - Honda Civic</p>
                          <p className="text-sm text-muted-foreground">Completed 3 hours ago</p>
                        </div>
                        <div className="font-medium">$250.00</div>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium leading-none">Engine Diagnostics - Ford F-150</p>
                          <p className="text-sm text-muted-foreground">In progress</p>
                        </div>
                        <div className="font-medium">$120.00</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="bookings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Bookings</CardTitle>
                  <CardDescription>You have 12 bookings scheduled for today</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                        <div className="space-y-1">
                          <p className="font-medium">Customer #{i}</p>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <CalendarDays className="mr-1 h-3 w-3" />
                            <span>Today, {9 + i}:00 AM</span>
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Car className="mr-1 h-3 w-3" />
                            <span>
                              Vehicle:{" "}
                              {
                                ["Toyota Camry", "Honda Civic", "Ford F-150", "Chevrolet Malibu", "Nissan Altima"][
                                  i - 1
                                ]
                              }
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                          <Button size="sm">Check In</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    View All Bookings
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="invoices" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Invoices</CardTitle>
                  <CardDescription>You have 8 invoices generated today</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                        <div className="space-y-1">
                          <p className="font-medium">Invoice #{1000 + i}</p>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Users className="mr-1 h-3 w-3" />
                            <span>
                              Customer:{" "}
                              {["John Doe", "Jane Smith", "Robert Johnson", "Emily Davis", "Michael Brown"][i - 1]}
                            </span>
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <CreditCard className="mr-1 h-3 w-3" />
                            <span>Amount: ${[45, 250, 120, 75, 180][i - 1]}.00</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                          <Button size="sm">Print</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    View All Invoices
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
