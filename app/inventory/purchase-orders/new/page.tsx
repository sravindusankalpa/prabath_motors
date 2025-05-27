"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Car, Plus, Save, Trash2 } from "lucide-react"
import { DashboardNav } from "@/components/dashboard-nav"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

export default function CreatePurchaseOrderPage() {
  const [selectedSupplier, setSelectedSupplier] = useState("")
  const [expectedDate, setExpectedDate] = useState<Date>()
  const [items, setItems] = useState<Array<{ id: string; partId: string; quantity: string; price: string }>>([
    { id: "1", partId: "", quantity: "", price: "" },
  ])

  // Mock data
  const suppliers = [
    { id: "filterpro", name: "FilterPro Supply" },
    { id: "brakemaster", name: "BrakeMaster Inc." },
    { id: "engineparts", name: "EngineParts Ltd." },
    { id: "electroparts", name: "ElectroParts Co." },
    { id: "coolsystems", name: "CoolSystems Inc." },
  ]

  const parts = [
    { id: "1", name: "Oil Filter", sku: "FLT-OIL-1001", price: 8.5 },
    { id: "2", name: "Brake Pad Set (Front)", sku: "BRK-PAD-2010", price: 65.75 },
    { id: "3", name: "Spark Plug", sku: "ENG-SPK-3005", price: 4.99 },
    { id: "4", name: "Air Filter", sku: "FLT-AIR-1002", price: 12.5 },
    { id: "5", name: "Transmission Fluid", sku: "FLD-TRN-5001", price: 18.99 },
  ]

  const addItem = () => {
    setItems([...items, { id: `${items.length + 1}`, partId: "", quantity: "", price: "" }])
  }

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id))
    }
  }

  const updateItem = (id: string, field: string, value: string) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          if (field === "partId" && value) {
            const selectedPart = parts.find((part) => part.id === value)
            return { ...item, [field]: value, price: selectedPart ? selectedPart.price.toString() : item.price }
          }
          return { ...item, [field]: value }
        }
        return item
      }),
    )
  }

  const calculateSubtotal = () => {
    return items.reduce((total, item) => {
      const quantity = Number.parseInt(item.quantity) || 0
      const price = Number.parseFloat(item.price) || 0
      return total + quantity * price
    }, 0)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would save the purchase order
    console.log("Saving purchase order:", {
      supplier: selectedSupplier,
      expectedDate,
      items,
      subtotal: calculateSubtotal(),
    })
    // Redirect to purchase orders page after saving
    window.location.href = "/inventory/purchase-orders"
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
            <h1 className="text-2xl font-bold tracking-tight">Create Purchase Order</h1>
            <Button variant="outline" asChild>
              <Link href="/inventory/purchase-orders">Cancel</Link>
            </Button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Purchase Order Details</CardTitle>
                  <CardDescription>Enter the basic details for this purchase order</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="poNumber">PO Number</Label>
                      <Input id="poNumber" value="PO-2025-0569" disabled />
                      <p className="text-xs text-muted-foreground">Auto-generated</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="date">Date Created</Label>
                      <Input id="date" value={format(new Date(), "PPP")} disabled />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="supplier">Supplier</Label>
                      <Select value={selectedSupplier} onValueChange={setSelectedSupplier} required>
                        <SelectTrigger id="supplier">
                          <SelectValue placeholder="Select supplier" />
                        </SelectTrigger>
                        <SelectContent>
                          {suppliers.map((supplier) => (
                            <SelectItem key={supplier.id} value={supplier.id}>
                              {supplier.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="expectedDate">Expected Delivery Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !expectedDate && "text-muted-foreground",
                            )}
                          >
                            {expectedDate ? format(expectedDate, "PPP") : "Select a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar mode="single" selected={expectedDate} onSelect={setExpectedDate} initialFocus />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Order Items</CardTitle>
                  <CardDescription>Add the parts you want to order</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Part</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Unit Price ($)</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <Select
                              value={item.partId}
                              onValueChange={(value) => updateItem(item.id, "partId", value)}
                              required
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select part" />
                              </SelectTrigger>
                              <SelectContent>
                                {parts.map((part) => (
                                  <SelectItem key={part.id} value={part.id}>
                                    {part.name} ({part.sku})
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min="1"
                              placeholder="Qty"
                              value={item.quantity}
                              onChange={(e) => updateItem(item.id, "quantity", e.target.value)}
                              required
                              className="w-20"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              placeholder="0.00"
                              value={item.price}
                              onChange={(e) => updateItem(item.id, "price", e.target.value)}
                              required
                              className="w-24"
                            />
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            ${((Number.parseFloat(item.price) || 0) * (Number.parseInt(item.quantity) || 0)).toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeItem(item.id)}
                              disabled={items.length === 1}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Remove</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  <Button type="button" variant="outline" size="sm" className="mt-4" onClick={addItem}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Item
                  </Button>

                  <div className="flex justify-end mt-6">
                    <div className="w-1/3 space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>${calculateSubtotal().toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax (0%):</span>
                        <span>$0.00</span>
                      </div>
                      <div className="flex justify-between font-medium border-t pt-2">
                        <span>Total:</span>
                        <span>${calculateSubtotal().toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" asChild>
                    <Link href="/inventory/purchase-orders">Cancel</Link>
                  </Button>
                  <Button type="submit">
                    <Save className="mr-2 h-4 w-4" />
                    Create Purchase Order
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
