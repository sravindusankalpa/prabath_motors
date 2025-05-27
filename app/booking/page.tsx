"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Car, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export default function BookingPage() {
  const [date, setDate] = useState<Date>()
  const [step, setStep] = useState(1)
  const [bookingComplete, setBookingComplete] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (step < 3) {
      setStep(step + 1)
    } else {
      setBookingComplete(true)
    }
  }

  if (bookingComplete) {
    return (
      <div className="flex min-h-screen w-full flex-col">
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Car className="h-6 w-6" />
            <span>GarageHub</span>
          </Link>
          <nav className="ml-auto flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/login">Login</Link>
            </Button>
          </nav>
        </header>
        <main className="flex flex-1 flex-col items-center justify-center p-4 md:p-8">
          <Card className="max-w-md w-full">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              <CardTitle className="text-center text-2xl">Booking Confirmed!</CardTitle>
              <CardDescription className="text-center">
                Your appointment has been scheduled successfully.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border p-4">
                <div className="grid gap-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Service:</span>
                    <span className="text-sm">Oil Change</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Date:</span>
                    <span className="text-sm">{date ? format(date, "PPP") : "Not selected"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Time:</span>
                    <span className="text-sm">10:00 AM</span>
                  </div>
                </div>
              </div>
              <div className="text-center text-sm text-muted-foreground">
                A confirmation has been sent to your email and WhatsApp.
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button className="w-full" asChild>
                <Link href="/">Return to Home</Link>
              </Button>
              <Button variant="outline" className="w-full">
                Manage Booking
              </Button>
            </CardFooter>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Car className="h-6 w-6" />
          <span>GarageHub</span>
        </Link>
        <nav className="ml-auto flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/login">Login</Link>
          </Button>
        </nav>
      </header>
      <main className="flex flex-1 flex-col items-center justify-center p-4 md:p-8">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Book a Service</CardTitle>
            <CardDescription>Schedule your vehicle service appointment online.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {step === 1 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="service">Select Service</Label>
                    <Select defaultValue="oil-change">
                      <SelectTrigger id="service">
                        <SelectValue placeholder="Select a service" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="oil-change">Oil Change</SelectItem>
                        <SelectItem value="brake-replacement">Brake Replacement</SelectItem>
                        <SelectItem value="engine-diagnostics">Engine Diagnostics</SelectItem>
                        <SelectItem value="tire-rotation">Tire Rotation</SelectItem>
                        <SelectItem value="ac-service">AC Service</SelectItem>
                        <SelectItem value="full-inspection">Full Inspection</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date">Select Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP") : "Select a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Select Time</Label>
                    <Select defaultValue="10-00">
                      <SelectTrigger id="time">
                        <SelectValue placeholder="Select a time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="09-00">9:00 AM</SelectItem>
                        <SelectItem value="10-00">10:00 AM</SelectItem>
                        <SelectItem value="11-00">11:00 AM</SelectItem>
                        <SelectItem value="12-00">12:00 PM</SelectItem>
                        <SelectItem value="13-00">1:00 PM</SelectItem>
                        <SelectItem value="14-00">2:00 PM</SelectItem>
                        <SelectItem value="15-00">3:00 PM</SelectItem>
                        <SelectItem value="16-00">4:00 PM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="vehicle-make">Vehicle Make</Label>
                    <Select defaultValue="toyota">
                      <SelectTrigger id="vehicle-make">
                        <SelectValue placeholder="Select make" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="toyota">Toyota</SelectItem>
                        <SelectItem value="honda">Honda</SelectItem>
                        <SelectItem value="ford">Ford</SelectItem>
                        <SelectItem value="chevrolet">Chevrolet</SelectItem>
                        <SelectItem value="nissan">Nissan</SelectItem>
                        <SelectItem value="bmw">BMW</SelectItem>
                        <SelectItem value="audi">Audi</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vehicle-model">Vehicle Model</Label>
                    <Input id="vehicle-model" placeholder="e.g. Camry" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vehicle-year">Vehicle Year</Label>
                    <Input id="vehicle-year" placeholder="e.g. 2020" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="license-plate">License Plate</Label>
                    <Input id="license-plate" placeholder="e.g. ABC123" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea id="notes" placeholder="Any specific issues or requests?" />
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="john@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" placeholder="+1 (555) 123-4567" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp">WhatsApp Number (for notifications)</Label>
                    <Input id="whatsapp" placeholder="+1 (555) 123-4567" />
                  </div>
                </div>
              )}
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            {step > 1 ? (
              <Button variant="outline" onClick={() => setStep(step - 1)}>
                Back
              </Button>
            ) : (
              <Button variant="outline" asChild>
                <Link href="/">Cancel</Link>
              </Button>
            )}
            <Button onClick={handleSubmit}>{step < 3 ? "Next" : "Complete Booking"}</Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}
