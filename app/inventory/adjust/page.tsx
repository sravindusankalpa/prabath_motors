"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Car, Save, Search } from "lucide-react"
import { DashboardNav } from "@/components/dashboard-nav"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default function AdjustInventoryPage() {
  const [selectedPart, setSelectedPart] = useState<string | null>(null)
  const [adjustmentType, setAdjustmentType] = useState("add")
  const [quantity, setQuantity] = useState("")
  const [reason, setReason] = useState("")

  // Mock parts data
  const parts = [
    {
      id: "1",
      name: "Oil Filter",
      sku: "FLT-OIL-1001",
      category: "Filters",
      stock: 45,
    },
    {
      id: "2",
      name: "Brake Pad Set (Front)",
      sku: "BRK-PAD-2010",
      category: "Brakes",
      stock: 8,
    },
    {
      id: "3",
      name: "Spark Plug",
      sku: "ENG-SPK-3005",
      category: "Engine",
      stock: 120,
    },
    {
      id: "4",
      name: "Air Filter",
      sku: "FLT-AIR-1002",
      category: "Filters",
      stock: 0,
    },
    {
      id: "5",
      name: "Transmission Fluid",
      sku: "FLD-TRN-5001",
      category: "Fluids",
      stock: 28,
    },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would adjust the inventory
    console.log("Adjusting inventory:", {
      partId: selectedPart,
      type: adjustmentType,
      quantity,
      reason,
    })
    // Redirect to inventory page after saving
    window.location.href = "/inventory"
  }

  const getSelectedPartDetails = () => {
    return parts.find((part) => part.id === selectedPart)
  }

  const calculateNewStock = () => {
    const part = getSelectedPartDetails()
    if (!part || !quantity) return part?.stock || 0

    const quantityNum = Number.parseInt(quantity)
    return adjustmentType === "add" ? part.stock + quantityNum : part.stock - quantityNum
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
            <h1 className="text-2xl font-bold tracking-tight">Adjust Inventory</h1>
            <Button variant="outline" asChild>
              <Link href="/inventory">Back to Inventory</Link>
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Select Part</CardTitle>
                <CardDescription>Choose the part you want to adjust</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative mb-4">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input type="search" placeholder="Search parts..." className="pl-8" />
                </div>

                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Part Name</TableHead>
                        <TableHead>SKU</TableHead>
                        <TableHead className="text-right">Current Stock</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {parts.map((part) => (
                        <TableRow key={part.id} className={selectedPart === part.id ? "bg-muted/50" : ""}>
                          <TableCell className="font-medium">{part.name}</TableCell>
                          <TableCell>{part.sku}</TableCell>
                          <TableCell className="text-right">
                            <Badge
                              variant={part.stock === 0 ? "destructive" : part.stock < 10 ? "secondary" : "outline"}
                            >
                              {part.stock} units
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant={selectedPart === part.id ? "default" : "outline"}
                              size="sm"
                              onClick={() => setSelectedPart(part.id)}
                            >
                              {selectedPart === part.id ? "Selected" : "Select"}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Adjustment Details</CardTitle>
                <CardDescription>Specify the adjustment type and quantity</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {selectedPart ? (
                    <>
                      <div className="p-3 bg-muted rounded-md mb-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{getSelectedPartDetails()?.name}</p>
                            <p className="text-sm text-muted-foreground">SKU: {getSelectedPartDetails()?.sku}</p>
                          </div>
                          <Badge variant="outline" className="text-base py-1 px-3">
                            {getSelectedPartDetails()?.stock} units
                          </Badge>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="adjustmentType">Adjustment Type</Label>
                        <Select value={adjustmentType} onValueChange={setAdjustmentType}>
                          <SelectTrigger id="adjustmentType">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="add">Add Stock</SelectItem>
                            <SelectItem value="remove">Remove Stock</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="quantity">Quantity</Label>
                        <Input
                          id="quantity"
                          type="number"
                          min="1"
                          placeholder="Enter quantity"
                          value={quantity}
                          onChange={(e) => setQuantity(e.target.value)}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="reason">Reason for Adjustment</Label>
                        <Select defaultValue="inventory-count">
                          <SelectTrigger id="reason">
                            <SelectValue placeholder="Select reason" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="inventory-count">Inventory Count</SelectItem>
                            <SelectItem value="damaged">Damaged/Defective</SelectItem>
                            <SelectItem value="returned">Customer Return</SelectItem>
                            <SelectItem value="lost">Lost/Missing</SelectItem>
                            <SelectItem value="correction">Data Correction</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea
                          id="notes"
                          placeholder="Enter additional details about this adjustment"
                          value={reason}
                          onChange={(e) => setReason(e.target.value)}
                          rows={3}
                        />
                      </div>

                      {quantity && (
                        <div className="p-3 bg-muted rounded-md mt-4">
                          <p className="font-medium">Adjustment Summary</p>
                          <div className="flex justify-between items-center mt-2">
                            <span>Current Stock:</span>
                            <span>{getSelectedPartDetails()?.stock} units</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>{adjustmentType === "add" ? "Adding" : "Removing"}:</span>
                            <span className={adjustmentType === "add" ? "text-green-600" : "text-red-600"}>
                              {adjustmentType === "add" ? "+" : "-"}
                              {quantity} units
                            </span>
                          </div>
                          <div className="flex justify-between items-center font-medium border-t mt-2 pt-2">
                            <span>New Stock Level:</span>
                            <span>{calculateNewStock()} units</span>
                          </div>
                        </div>
                      )}

                      <CardFooter className="px-0 pt-4">
                        <Button type="submit" className="w-full">
                          <Save className="mr-2 h-4 w-4" />
                          Save Adjustment
                        </Button>
                      </CardFooter>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-[300px] text-center text-muted-foreground">
                      <p>Please select a part from the list to adjust its inventory.</p>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
