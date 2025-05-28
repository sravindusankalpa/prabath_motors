"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Car, MessageSquare, Send } from "lucide-react"
import { DashboardNav } from "@/components/dashboard-nav"
import { Badge } from "@/components/ui/badge"

export default function NotificationsPage() {
  const [whatsappEnabled, setWhatsappEnabled] = useState(true)
  const [emailEnabled, setEmailEnabled] = useState(true)
  const [smsEnabled, setSmsEnabled] = useState(false)

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
            <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
            <Button>
              <Send className="mr-2 h-4 w-4" />
              Send Test Notification
            </Button>
          </div>

          <Tabs defaultValue="settings" className="space-y-4">
            <TabsList>
              <TabsTrigger value="settings">Notification Settings</TabsTrigger>
              <TabsTrigger value="templates">Message Templates</TabsTrigger>
              <TabsTrigger value="history">Notification History</TabsTrigger>
            </TabsList>

            <TabsContent value="settings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Channels</CardTitle>
                  <CardDescription>Configure how you want to notify your customers.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between space-x-2">
                    <div className="flex flex-col space-y-1">
                      <Label htmlFor="whatsapp" className="font-medium">
                        WhatsApp Notifications
                      </Label>
                      <span className="text-sm text-muted-foreground">
                        Send booking confirmations and reminders via WhatsApp
                      </span>
                    </div>
                    <Switch id="whatsapp" checked={whatsappEnabled} onCheckedChange={setWhatsappEnabled} />
                  </div>

                  {whatsappEnabled && (
                    <div className="rounded-md border p-4">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="whatsapp-api-key">WhatsApp Business API Key</Label>
                          <Input id="whatsapp-api-key" type="password" value="••••••••••••••••" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="whatsapp-phone">WhatsApp Business Phone Number</Label>
                          <Input id="whatsapp-phone" placeholder="+1 (555) 123-4567" />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between space-x-2">
                    <div className="flex flex-col space-y-1">
                      <Label htmlFor="email" className="font-medium">
                        Email Notifications
                      </Label>
                      <span className="text-sm text-muted-foreground">
                        Send booking confirmations and invoices via email
                      </span>
                    </div>
                    <Switch id="email" checked={emailEnabled} onCheckedChange={setEmailEnabled} />
                  </div>

                  {emailEnabled && (
                    <div className="rounded-md border p-4">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="smtp-host">SMTP Host</Label>
                          <Input id="smtp-host" placeholder="smtp.example.com" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="smtp-user">SMTP Username</Label>
                            <Input id="smtp-user" placeholder="username" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="smtp-pass">SMTP Password</Label>
                            <Input id="smtp-pass" type="password" placeholder="••••••••" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="from-email">From Email</Label>
                          <Input id="from-email" placeholder="service@yourgaragename.com" />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between space-x-2">
                    <div className="flex flex-col space-y-1">
                      <Label htmlFor="sms" className="font-medium">
                        SMS Notifications
                      </Label>
                      <span className="text-sm text-muted-foreground">Send booking reminders via SMS</span>
                    </div>
                    <Switch id="sms" checked={smsEnabled} onCheckedChange={setSmsEnabled} />
                  </div>

                  {smsEnabled && (
                    <div className="rounded-md border p-4">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="sms-api-key">SMS API Key</Label>
                          <Input id="sms-api-key" type="password" placeholder="Enter your SMS API key" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="sms-from">From Number</Label>
                          <Input id="sms-from" placeholder="+1 (555) 123-4567" />
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Notification Triggers</CardTitle>
                  <CardDescription>Configure when notifications should be sent.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between space-x-2">
                    <div className="flex flex-col space-y-1">
                      <Label className="font-medium">Booking Confirmation</Label>
                      <span className="text-sm text-muted-foreground">
                        Send notification when a booking is confirmed
                      </span>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between space-x-2">
                    <div className="flex flex-col space-y-1">
                      <Label className="font-medium">Booking Reminder</Label>
                      <span className="text-sm text-muted-foreground">Send reminder before scheduled appointment</span>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between space-x-2">
                    <div className="flex flex-col space-y-1">
                      <Label className="font-medium">Service Completion</Label>
                      <span className="text-sm text-muted-foreground">Send notification when service is completed</span>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between space-x-2">
                    <div className="flex flex-col space-y-1">
                      <Label className="font-medium">Invoice Generated</Label>
                      <span className="text-sm text-muted-foreground">
                        Send notification when an invoice is generated
                      </span>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between space-x-2">
                    <div className="flex flex-col space-y-1">
                      <Label className="font-medium">Payment Received</Label>
                      <span className="text-sm text-muted-foreground">Send notification when payment is received</span>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="templates" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Message Templates</CardTitle>
                  <CardDescription>Customize the messages sent to your customers.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="booking-confirmation">Booking Confirmation</Label>
                    <Input
                      id="booking-confirmation"
                      defaultValue="Hello {'{{customer_name}}'}, your appointment for {'{{service_name}}'} has been confirmed for {'{{appointment_date}}'} at {'{{appointment_time}}'}. Thank you for choosing our garage!"
                    />
                    <p className="text-xs text-muted-foreground">
                      Available variables: {"{{customer_name}}"}, {"{{service_name}}"}, {"{{appointment_date}}"},{" "}
                      {"{{appointment_time}}"}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="booking-reminder">Booking Reminder</Label>
                    <Input
                      id="booking-reminder"
                      defaultValue="Hello {'{{customer_name}}'}, this is a reminder that your appointment for {'{{service_name}}'} is scheduled for tomorrow at {'{{appointment_time}}'}. See you soon!"
                    />
                    <p className="text-xs text-muted-foreground">
                      Available variables: {"{{customer_name}}"}, {"{{service_name}}"}, {"{{appointment_date}}"},{" "}
                      {"{{appointment_time}}"}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="service-completion">Service Completion</Label>
                    <Input
                      id="service-completion"
                      defaultValue="Hello {'{{customer_name}}'}, your {'{{service_name}}'} has been completed. Your vehicle is ready for pickup. Thank you for your business!"
                    />
                    <p className="text-xs text-muted-foreground">
                      Available variables: {"{{customer_name}}"}, {"{{service_name}}"}, {"{{vehicle_info}}"}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="invoice-generated">Invoice Generated</Label>
                    <Input
                      id="invoice-generated"
                      defaultValue="Hello {'{{customer_name}}'}, your invoice #{'{{invoice_number}}'} for {'{{service_name}}'} has been generated. Total amount: {'{{invoice_amount}}'}. Thank you for your business!"
                    />
                    <p className="text-xs text-muted-foreground">
                      Available variables: {"{{customer_name}}"}, {"{{invoice_number}}"}, {"{{service_name}}"},{" "}
                      {"{{invoice_amount}}"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Notification History</CardTitle>
                  <CardDescription>View all sent notifications.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        type: "WhatsApp",
                        recipient: "John Doe",
                        message: "Booking confirmation for Oil Change on May 20, 2025 at 10:00 AM",
                        status: "Delivered",
                        time: "Today, 9:30 AM",
                      },
                      {
                        type: "Email",
                        recipient: "Jane Smith",
                        message: "Invoice #1002 for Brake Replacement",
                        status: "Sent",
                        time: "Today, 8:45 AM",
                      },
                      {
                        type: "WhatsApp",
                        recipient: "Robert Johnson",
                        message: "Reminder for Engine Diagnostics appointment tomorrow at 1:00 PM",
                        status: "Delivered",
                        time: "Yesterday, 4:15 PM",
                      },
                      {
                        type: "Email",
                        recipient: "Emily Davis",
                        message: "Service completion notification for Tire Rotation",
                        status: "Sent",
                        time: "Yesterday, 2:30 PM",
                      },
                      {
                        type: "WhatsApp",
                        recipient: "Michael Brown",
                        message: "Booking confirmation for AC Service on May 20, 2025 at 4:00 PM",
                        status: "Failed",
                        time: "Yesterday, 11:20 AM",
                      },
                    ].map((notification, i) => (
                      <div key={i} className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0">
                        <div className="space-y-1">
                          <div className="flex items-center">
                            <MessageSquare className="mr-2 h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">
                              {notification.type} to {notification.recipient}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">{notification.message}</p>
                          <p className="text-xs text-muted-foreground">{notification.time}</p>
                        </div>
                        <Badge
                          variant={
                            notification.status === "Delivered"
                              ? "outline"
                              : notification.status === "Sent"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {notification.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
