"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Car, Save } from "lucide-react"
import { DashboardNav } from "@/components/dashboard-nav"

export default function ReceivePurchaseOrderPage({ params }: { params: { id: string } }) {
  const poId = params.id

  // Mock purchase order data
  const purchaseOrder = {
    id: poId,
    number: poId,
    dateCreated: "May 15, 2025",
    expectedDelivery: "May 22, 2025",
    status: "Ordered",
    supplier: {
      name: "FilterPro Supply",
    },
    items: [
      {
        id: "1",
        partName: "Oil Filter",
        sku: "FLT-OIL-1001",
        quantity: 50,
        received: 0,
      },
      {
        id: "2",
        partName: "Air Filter",
        sku: "FLT-AIR-1002",
        quantity: 30,
        received: 0,
      },
      {
        id: "3",
        partName: "Cabin Air Filter",
        sku: "FLT-CAB-1005",
        quantity: 25,
        received: 0,
      },
      {
        id: "4",
        partName: "Oil Filter Wrench",
        sku: "TLS-OIL-2001",
        quantity: 5,
        received: 0,
      },
    ],
  }

  const [receivedItems, setReceivedItems] = useState(
    purchaseOrder.items.map((item) => ({
      id: item.id,
      quantity: item.quantity.toString(),
      isFullyReceived: true,
    })),
  )
  const [notes, setNotes] = useState("")
  const [invoiceNumber, setInvoiceNumber] = useState("")
  const [receiveDate, setReceiveDate] = useState(new Date().toISOString().split("T")[0])

  const handleQuantityChange = (id: string, quantity: string) => {
    setReceivedItems(
      receivedItems.map((item) => {
        if (item.id === id) {
          const originalItem = purchaseOrder.items.find((i) => i.id === id)
          const isFullyReceived = Number.parseInt(quantity) === originalItem?.quantity
          return { ...item, quantity, isFullyReceived }
        }
        return item
      }),
    )
  }

  const handleCheckboxChange = (id: string, checked: boolean) => {
    setReceivedItems(
      receivedItems.map((item) => {
        if (item.id === id) {
          const originalItem = purchaseOrder.items.find((i) => i.id === id)
          return {
            ...item,
            isFullyReceived: checked,
            quantity: checked ? originalItem?.quantity.toString() || "0" : "0",
          }
        }
        return item
      }),
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would save the received items
    console.log("Receiving items:", {
      poId,
      receivedItems,
      notes,
      invoiceNumber,
      receiveDate,
    })
    // Redirect to purchase order page after saving
    window.location.href = `/inventory/purchase-orders/${poId}`
  }

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
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Receive Purchase Order</h1>
              <p className="text-muted-foreground">
                PO #{purchaseOrder.number} from {purchaseOrder.supplier.name}
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link href={`/inventory/purchase-orders/${poId}`}>Cancel</Link>
            </Button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Receive Items</CardTitle>
                  <CardDescription>Enter the quantities received for each item</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Part Name</TableHead>
                        <TableHead>SKU</TableHead>
                        <TableHead className="text-right">Ordered</TableHead>
                        <TableHead className="text-right">Previously Received</TableHead>
                        <TableHead className="text-right">Receiving Now</TableHead>
                        <TableHead>Fully Received</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {purchaseOrder.items.map((item, i) => {
                        const receivedItem = receivedItems.find((ri) => ri.id === item.id)
                        return (
                          <TableRow key={i}>
                            <TableCell className="font-medium">{item.partName}</TableCell>
                            <TableCell>{item.sku}</TableCell>
                            <TableCell className="text-right">{item.quantity}</TableCell>
                            <TableCell className="text-right">{item.received}</TableCell>
                            <TableCell className="text-right">
                              <Input
                                type="number"
                                min="0"
                                max={item.quantity - item.received}
                                value={receivedItem?.quantity || "0"}
                                onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                                className="w-20"
                              />
                            </TableCell>
                            <TableCell>
                              <Checkbox
                                checked={receivedItem?.isFullyReceived}
                                onCheckedChange={(checked) => handleCheckboxChange(item.id, checked === true)}
                              />
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Receipt Details</CardTitle>
                  <CardDescription>Enter information about this receipt</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="receiveDate">Receipt Date</Label>
                    <Input
                      id="receiveDate"
                      type="date"
                      value={receiveDate}
                      onChange={(e) => setReceiveDate(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="invoiceNumber">Supplier Invoice Number</Label>
                    <Input
                      id="invoiceNumber"
                      placeholder="Enter supplier's invoice number"
                      value={invoiceNumber}
                      onChange={(e) => setInvoiceNumber(e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Notes</CardTitle>
                  <CardDescription>Add any additional information about this receipt</CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Enter notes about this receipt (e.g., damaged items, partial delivery, etc.)"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={5}
                  />
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" asChild>
                    <Link href={`/inventory/purchase-orders/${poId}`}>Cancel</Link>
                  </Button>
                  <Button type="submit">
                    <Save className="mr-2 h-4 w-4" />
                    Receive Items
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </form>
        </main>
      </div>
    </div>
  )
}
