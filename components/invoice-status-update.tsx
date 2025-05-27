"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, AlertCircle, XCircle, Loader2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface InvoiceStatusUpdateProps {
  invoiceId: string
  currentStatus: string
  onStatusUpdate: (newStatus: string) => void
}

const statusOptions = [
  {
    value: "Draft",
    label: "Draft",
    description: "Invoice is being prepared",
    icon: Clock,
    color: "bg-gray-100 text-gray-800",
  },
  {
    value: "Pending",
    label: "Pending",
    description: "Sent to customer, awaiting payment",
    icon: Clock,
    color: "bg-yellow-100 text-yellow-800",
  },
  {
    value: "Paid",
    label: "Paid",
    description: "Payment received and processed",
    icon: CheckCircle,
    color: "bg-green-100 text-green-800",
  },
  {
    value: "Overdue",
    label: "Overdue",
    description: "Payment is past due date",
    icon: AlertCircle,
    color: "bg-red-100 text-red-800",
  },
  {
    value: "Cancelled",
    label: "Cancelled",
    description: "Invoice has been cancelled",
    icon: XCircle,
    color: "bg-gray-100 text-gray-800",
  },
]

export function InvoiceStatusUpdate({ invoiceId, currentStatus, onStatusUpdate }: InvoiceStatusUpdateProps) {
  const [selectedStatus, setSelectedStatus] = useState(currentStatus)
  const [isUpdating, setIsUpdating] = useState(false)

  const handleStatusUpdate = async () => {
    if (selectedStatus === currentStatus) {
      toast({
        title: "No changes",
        description: "Status is already set to this value",
      })
      return
    }

    setIsUpdating(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      onStatusUpdate(selectedStatus)

      toast({
        title: "Status updated",
        description: `Invoice status changed to ${selectedStatus}`,
      })
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Failed to update invoice status",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const currentStatusInfo = statusOptions.find((option) => option.value === currentStatus)
  const selectedStatusInfo = statusOptions.find((option) => option.value === selectedStatus)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Update Invoice Status
          {currentStatusInfo && (
            <Badge className={currentStatusInfo.color}>
              <currentStatusInfo.icon className="w-3 h-3 mr-1" />
              {currentStatus}
            </Badge>
          )}
        </CardTitle>
        <CardDescription>Change the status of this invoice</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Select New Status</label>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <option.icon className="w-4 h-4" />
                      <span>{option.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Status Description</label>
            <p className="text-sm text-muted-foreground">
              {selectedStatusInfo?.description || "Select a status to see description"}
            </p>
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleStatusUpdate} disabled={isUpdating || selectedStatus === currentStatus}>
            {isUpdating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Status"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
