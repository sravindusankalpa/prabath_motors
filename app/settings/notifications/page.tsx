import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Car } from "lucide-react"
import { DashboardNav } from "@/components/dashboard-nav"

export default function NotificationSettingsPage() {
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
            <h1 className="text-2xl font-bold tracking-tight">Notification Settings</h1>
          </div>

          <Tabs defaultValue="repair-status" className="space-y-4">
            <TabsList>
              <TabsTrigger value="repair-status">Repair Status Updates</TabsTrigger>
              <TabsTrigger value="booking">Booking Notifications</TabsTrigger>
              <TabsTrigger value="invoice">Invoice Notifications</TabsTrigger>
            </TabsList>

            <TabsContent value="repair-status" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Repair Status Notification Templates</CardTitle>
                  <CardDescription>Customize the messages sent to customers when repair status changes</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="vehicle-received">Vehicle Received</Label>
                    <Input
                      id="vehicle-received"
                      defaultValue="Hello {{customer_name}}, we've received your {{vehicle_info}} for {{service_name}}. We'll begin working on it shortly."
                    />
                    <p className="text-xs text-muted-foreground">
                      Available variables: {{ customer_name }}, {{ vehicle_info }}, {{ service_name }}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="diagnosis">Diagnosis Complete</Label>
                    <Input
                      id="diagnosis"
                      defaultValue="Hello {{customer_name}}, we've completed the diagnosis of your {{vehicle_info}}. {{diagnosis_results}}"
                    />
                    <p className="text-xs text-muted-foreground">
                      Available variables: {{ customer_name }}, {{ vehicle_info }}, {{ diagnosis_results }}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="in-progress">Repair In Progress</Label>
                    <Input
                      id="in-progress"
                      defaultValue="Hello {{customer_name}}, we've started working on your {{vehicle_info}}. Estimated completion time: {{estimated_completion}}."
                    />
                    <p className="text-xs text-muted-foreground">
                      Available variables: {{ customer_name }}, {{ vehicle_info }}, {{ estimated_completion }}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="parts-ordered">Parts Ordered</Label>
                    <Input
                      id="parts-ordered"
                      defaultValue="Hello {{customer_name}}, we've ordered parts for your {{vehicle_info}}. Estimated arrival: {{parts_arrival}}."
                    />
                    <p className="text-xs text-muted-foreground">
                      Available variables: {{ customer_name }}, {{ vehicle_info }}, {{ parts_arrival }}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="waiting-approval">Waiting for Approval</Label>
                    <Input
                      id="waiting-approval"
                      defaultValue="Hello {{customer_name}}, we need your approval for additional repairs on your {{vehicle_info}}. Please call us at {{garage_phone}}."
                    />
                    <p className="text-xs text-muted-foreground">
                      Available variables: {{ customer_name }}, {{ vehicle_info }}, {{ garage_phone }}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="completed">Repair Completed</Label>
                    <Input
                      id="completed"
                      defaultValue="Hello {{customer_name}}, great news! The repairs on your {{vehicle_info}} are complete. Your vehicle is ready for pickup."
                    />
                    <p className="text-xs text-muted-foreground">
                      Available variables: {{ customer_name }}, {{ vehicle_info }}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Status Update Settings</CardTitle>
                  <CardDescription>Configure when and how status updates are sent</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between space-x-2">
                    <div className="flex flex-col space-y-1">
                      <Label htmlFor="auto-notify" className="font-medium">
                        Automatic Notifications
                      </Label>
                      <span className="text-sm text-muted-foreground">
                        Automatically send notifications when status changes
                      </span>
                    </div>
                    <Switch id="auto-notify" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between space-x-2">
                    <div className="flex flex-col space-y-1">
                      <Label htmlFor="include-notes" className="font-medium">
                        Include Status Notes
                      </Label>
                      <span className="text-sm text-muted-foreground">
                        Include technician notes in customer notifications
                      </span>
                    </div>
                    <Switch id="include-notes" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between space-x-2">
                    <div className="flex flex-col space-y-1">
                      <Label htmlFor="send-photos" className="font-medium">
                        Send Repair Photos
                      </Label>
                      <span className="text-sm text-muted-foreground">
                        Include photos of repairs in status updates when available
                      </span>
                    </div>
                    <Switch id="send-photos" defaultChecked />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="booking" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Booking Notification Templates</CardTitle>
                  <CardDescription>Customize the messages sent for booking-related notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="booking-confirmation">Booking Confirmation</Label>
                    <Input
                      id="booking-confirmation"
                      defaultValue="Hello {{customer_name}}, your appointment for {{service_name}} has been confirmed for {{appointment_date}} at {{appointment_time}}. Thank you for choosing our garage!"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="booking-reminder">Booking Reminder</Label>
                    <Input
                      id="booking-reminder"
                      defaultValue="Hello {{customer_name}}, this is a reminder that your appointment for {{service_name}} is scheduled for tomorrow at {{appointment_time}}. See you soon!"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="invoice" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Invoice Notification Templates</CardTitle>
                  <CardDescription>Customize the messages sent for invoice-related notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="invoice-generated">Invoice Generated</Label>
                    <Input
                      id="invoice-generated"
                      defaultValue="Hello {{customer_name}}, your invoice #{{invoice_number}} for {{service_name}} has been generated. Total amount: {{invoice_amount}}. Thank you for your business!"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="payment-reminder">Payment Reminder</Label>
                    <Input
                      id="payment-reminder"
                      defaultValue="Hello {{customer_name}}, this is a friendly reminder that invoice #{{invoice_number}} for {{invoice_amount}} is due on {{due_date}}. Please contact us if you have any questions."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="payment-received">Payment Received</Label>
                    <Input
                      id="payment-received"
                      defaultValue="Hello {{customer_name}}, we've received your payment of {{payment_amount}} for invoice #{{invoice_number}}. Thank you for your business!"
                    />
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
