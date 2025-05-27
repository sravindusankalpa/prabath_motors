"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Car, CheckCircle, Clock, MessageSquare } from "lucide-react"
import { DashboardNav } from "@/components/dashboard-nav"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { sendStatusUpdate } from "@/lib/notifications"

export default function BookingDetailPage({ params }: { params: { id: string } }) {
  const bookingId = params.id

  // Mock booking data
  const [booking, setBooking] = useState({
    id: bookingId,
    customer: {
      name: "John Doe",
      email: "john@example.com",
      phone: "555-123-4567",
      whatsapp: "+1555-123-4567",
    },
    vehicle: {
      make: "Toyota",
      model: "Camry",
      year: "2018",
      licensePlate: "ABC123",
    },
    service: "Oil Change",
    date: "May 20, 2025",
    time: "10:00 AM",
    status: "Pending",
    notes: "Customer mentioned unusual noise from engine.",
    statusHistory: [
      {
        status: "Booked",
        timestamp: "May 15, 2025, 2:30 PM",
        notes: "Initial booking created",
      },
      {
        status: "Confirmed",
        timestamp: "May 15, 2025, 3:15 PM",
        notes: "Booking confirmed with customer",
      },
    ],
  })

  const [statusNote, setStatusNote] = useState("")
  const [notificationSent, setNotificationSent] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  const updateStatus = async (newStatus: string) => {
    setIsUpdating(true)

    // In a real app, this would be an API call
    setTimeout(() => {
      const updatedBooking = {
        ...booking,
        status: newStatus,
        statusHistory: [
          ...booking.statusHistory,
          {
            status: newStatus,
            timestamp: new Date().toLocaleString(),
            notes: statusNote,
          },
        ],
      }

      setBooking(updatedBooking)

      // Send notification to customer
      sendStatusUpdate(booking.customer.whatsapp, booking.customer.name, booking.service, newStatus).then(() => {
        setNotificationSent(true)
        setTimeout(() => setNotificationSent(false), 5000)
      })

      setStatusNote("")
      setIsUpdating(false)
    }, 1000)
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Car className="h-6 w-6" />
          <span>GarageHub</span>
        </Link>
        <nav className="ml-auto flex gap-2">
          <Button variant="outline">Logout</Button>
        </nav>
      </header>
      <div className="flex flex-1">
        <DashboardNav />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-tight">Booking #{booking.id}</h1>
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link href="/bookings">Back to Bookings</Link>
              </Button>
            </div>
          </div>

          {notificationSent && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle>Notification Sent</AlertTitle>
              <AlertDescription>
                Status update notification has been sent to the customer via WhatsApp.
              </AlertDescription>
            </Alert>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Booking Details</CardTitle>
                    <CardDescription>
                      Scheduled for {booking.date} at {booking.time}
                    </CardDescription>
                  </div>
                  <Badge
                    variant={
                      booking.status === "Completed"
                        ? "outline"
                        : booking.status === "In Progress"
                          ? "secondary"
                          : "default"
                    }
                    className="text-sm"
                  >
                    {booking.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Customer Information</h3>
                  <div className="text-sm">
                    <p className="font-medium">{booking.customer.name}</p>
                    <p>{booking.customer.email}</p>
                    <p>{booking.customer.phone}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Vehicle Information</h3>
                  <div className="text-sm">
                    <p>
                      {booking.vehicle.year} {booking.vehicle.make} {booking.vehicle.model}
                    </p>
                    <p>License Plate: {booking.vehicle.licensePlate}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Service</h3>
                  <p className="text-sm">{booking.service}</p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Notes</h3>
                  <p className="text-sm">{booking.notes}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Update Repair Status</CardTitle>
                <CardDescription>Change the status of this repair and notify the customer</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select defaultValue={booking.status} onValueChange={(value) => updateStatus(value)}>
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Vehicle Received">Vehicle Received</SelectItem>
                      <SelectItem value="Diagnosis">Diagnosis</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Parts Ordered">Parts Ordered</SelectItem>
                      <SelectItem value="Waiting for Approval">Waiting for Approval</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="Ready for Pickup">Ready for Pickup</SelectItem>
                      <SelectItem value="Delivered">Delivered</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Status Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Add notes about this status update"
                    value={statusNote}
                    onChange={(e) => setStatusNote(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    These notes will be included in the notification to the customer.
                  </p>
                </div>

                <Button
                  className="w-full"
                  onClick={() => updateStatus(booking.status)}
                  disabled={isUpdating || statusNote.trim() === ""}
                >
                  {isUpdating ? (
                    <>
                      <Clock className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Update Status & Notify Customer
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Status History</CardTitle>
              <CardDescription>Track all status changes for this booking</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {booking.statusHistory.map((history, i) => (
                  <div key={i} className="flex items-start border-l-2 border-muted pl-4 last:border-l-transparent">
                    <div className="space-y-1 w-full">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Badge variant="outline" className="mr-2">
                            {history.status}
                          </Badge>
                          <span className="text-sm text-muted-foreground">{history.timestamp}</span>
                        </div>
                      </div>
                      {history.notes && <p className="text-sm">{history.notes}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
