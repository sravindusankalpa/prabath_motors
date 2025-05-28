"use client"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Car, Database, CheckCircle, AlertCircle } from "lucide-react"
import { DashboardNav } from "@/components/dashboard-nav"
import { UserNav } from "@/components/user-nav"
import { toast } from "@/components/ui/use-toast"

export default function SeedPage() {
  const { isAuthenticated } = useAuth()
  const [isSeeding, setIsSeeding] = useState(false)
  const [seedResult, setSeedResult] = useState<{ success: boolean; message: string } | null>(null)

  const handleSeedDatabase = async () => {
    setIsSeeding(true)
    setSeedResult(null)

    try {
      const response = await fetch("/api/seed", {
        method: "POST",
      })

      const result = await response.json()

      if (response.ok) {
        setSeedResult({ success: true, message: result.message })
        toast({
          title: "Success",
          description: "Database seeded successfully with sample data",
        })
      } else {
        setSeedResult({ success: false, message: result.error })
        toast({
          title: "Error",
          description: result.error || "Failed to seed database",
          variant: "destructive",
        })
      }
    } catch (error) {
      const errorMessage = "Failed to seed database"
      setSeedResult({ success: false, message: errorMessage })
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsSeeding(false)
    }
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Car className="h-6 w-6" />
          <span>PRABATH MOTORS</span>
        </Link>
        <nav className="ml-auto flex gap-2">
          <UserNav />
        </nav>
      </header>
      <div className="flex flex-1">
        <DashboardNav />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-tight">Database Setup</h1>
          </div>

          <Card className="max-w-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Seed Sample Data
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  This will populate your database with sample customers, vehicles, and invoices to help you get started
                  with the system.
                </p>

                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Sample data includes:</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• 5 sample customers with contact information</li>
                    <li>• 6 vehicles associated with customers</li>
                    <li>• 6 sample invoices with different statuses</li>
                    <li>• Various service types and pricing examples</li>
                  </ul>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-800">Important Note</h4>
                      <p className="text-sm text-yellow-700 mt-1">
                        This operation will only add data if your database is empty. If you already have data, this will
                        not affect your existing records.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <Button onClick={handleSeedDatabase} disabled={isSeeding} className="w-full">
                  {isSeeding ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Seeding Database...
                    </>
                  ) : (
                    <>
                      <Database className="mr-2 h-4 w-4" />
                      Seed Database with Sample Data
                    </>
                  )}
                </Button>

                {seedResult && (
                  <div
                    className={`p-4 rounded-lg border ${
                      seedResult.success ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {seedResult.success ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-red-600" />
                      )}
                      <span className={`font-medium ${seedResult.success ? "text-green-800" : "text-red-800"}`}>
                        {seedResult.success ? "Success!" : "Error"}
                      </span>
                    </div>
                    <p className={`text-sm mt-1 ${seedResult.success ? "text-green-700" : "text-red-700"}`}>
                      {seedResult.message}
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  After seeding, you can start creating invoices, managing customers, and exploring all the features of
                  PRABATH MOTORS.
                </p>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
