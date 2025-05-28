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
import { Car, Save, X } from "lucide-react"
import { DashboardNav } from "@/components/dashboard-nav"

export default function AddPartPage() {
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    category: "",
    description: "",
    location: "",
    costPrice: "",
    sellingPrice: "",
    currentStock: "",
    minStock: "",
    maxStock: "",
    supplier: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would save the part to the database
    console.log("Saving part:", formData)
    // Redirect to inventory page after saving
    window.location.href = "/inventory"
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
            <h1 className="text-2xl font-bold tracking-tight">Add New Part</h1>
            <Button variant="outline" asChild>
              <Link href="/inventory">Cancel</Link>
            </Button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>Enter the basic details of the part</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Part Name</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="e.g. Oil Filter"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sku">SKU / Part Number</Label>
                      <Input
                        id="sku"
                        name="sku"
                        placeholder="e.g. FLT-OIL-1001"
                        value={formData.sku}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) => handleSelectChange("category", value)}
                      >
                        <SelectTrigger id="category">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="filters">Filters</SelectItem>
                          <SelectItem value="brakes">Brakes</SelectItem>
                          <SelectItem value="engine">Engine</SelectItem>
                          <SelectItem value="electrical">Electrical</SelectItem>
                          <SelectItem value="fluids">Fluids</SelectItem>
                          <SelectItem value="suspension">Suspension</SelectItem>
                          <SelectItem value="cooling">Cooling System</SelectItem>
                          <SelectItem value="transmission">Transmission</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Storage Location</Label>
                      <Input
                        id="location"
                        name="location"
                        placeholder="e.g. Aisle B, Shelf 3"
                        value={formData.location}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Enter a detailed description of the part"
                      value={formData.description}
                      onChange={handleChange}
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Pricing Information</CardTitle>
                  <CardDescription>Set the cost and selling prices</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="costPrice">Cost Price ($)</Label>
                    <Input
                      id="costPrice"
                      name="costPrice"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      value={formData.costPrice}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sellingPrice">Selling Price ($)</Label>
                    <Input
                      id="sellingPrice"
                      name="sellingPrice"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      value={formData.sellingPrice}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  {formData.costPrice && formData.sellingPrice && (
                    <div className="pt-2">
                      <div className="flex justify-between text-sm">
                        <span>Markup:</span>
                        <span>
                          {(
                            ((Number.parseFloat(formData.sellingPrice) - Number.parseFloat(formData.costPrice)) /
                              Number.parseFloat(formData.costPrice)) *
                            100
                          ).toFixed(2)}
                          %
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Profit per unit:</span>
                        <span>
                          $
                          {(Number.parseFloat(formData.sellingPrice) - Number.parseFloat(formData.costPrice)).toFixed(
                            2,
                          )}
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Inventory Settings</CardTitle>
                  <CardDescription>Configure stock levels and supplier</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentStock">Current Stock</Label>
                    <Input
                      id="currentStock"
                      name="currentStock"
                      type="number"
                      min="0"
                      placeholder="0"
                      value={formData.currentStock}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="minStock">Minimum Stock Level</Label>
                    <Input
                      id="minStock"
                      name="minStock"
                      type="number"
                      min="0"
                      placeholder="0"
                      value={formData.minStock}
                      onChange={handleChange}
                      required
                    />
                    <p className="text-xs text-muted-foreground">System will alert when stock falls below this level</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxStock">Maximum Stock Level</Label>
                    <Input
                      id="maxStock"
                      name="maxStock"
                      type="number"
                      min="0"
                      placeholder="0"
                      value={formData.maxStock}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="supplier">Supplier</Label>
                    <Select value={formData.supplier} onValueChange={(value) => handleSelectChange("supplier", value)}>
                      <SelectTrigger id="supplier">
                        <SelectValue placeholder="Select supplier" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="filterpro">FilterPro Supply</SelectItem>
                        <SelectItem value="brakemaster">BrakeMaster Inc.</SelectItem>
                        <SelectItem value="engineparts">EngineParts Ltd.</SelectItem>
                        <SelectItem value="electroparts">ElectroParts Co.</SelectItem>
                        <SelectItem value="coolsystems">CoolSystems Inc.</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      <Link href="/inventory/suppliers" className="text-primary underline">
                        Manage suppliers
                      </Link>
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Vehicle Compatibility</CardTitle>
                  <CardDescription>Specify which vehicles this part is compatible with</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="compatibility">Compatible Vehicles</Label>
                    <Textarea
                      id="compatibility"
                      placeholder="Enter vehicle makes, models, and years this part is compatible with. One per line."
                      rows={4}
                    />
                    <p className="text-xs text-muted-foreground">
                      Example: Toyota Camry (2015-2022), Honda Accord (2016-2022)
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" asChild>
                    <Link href="/inventory">
                      <X className="mr-2 h-4 w-4" />
                      Cancel
                    </Link>
                  </Button>
                  <Button type="submit">
                    <Save className="mr-2 h-4 w-4" />
                    Save Part
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
