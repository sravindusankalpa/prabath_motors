"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Car, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/lib/auth-context"

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Hardcoded credentials
  const validCredentials = [
    { email: "admin@garagehub.com", password: "admin123", role: "admin" },
    { email: "mechanic@garagehub.com", password: "mechanic123", role: "mechanic" },
    { email: "staff@garagehub.com", password: "staff123", role: "staff" },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Simulate API call delay
    setTimeout(() => {
      const matchedUser = validCredentials.find((cred) => cred.email === email && cred.password === password)

      if (matchedUser) {
        // Login successful
        login({
          id: "1",
          name: email.split("@")[0],
          email: email,
          role: matchedUser.role,
        })
        router.push("/dashboard")
      } else {
        // Login failed
        setError("Invalid email or password. Try one of the demo accounts listed below.")
      }
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-muted/40 p-4">
      <Link href="/" className="mb-4 flex items-center gap-2 text-2xl font-bold">
        <Car className="h-8 w-8" />
        <span>GarageHub</span>
      </Link>

      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/forgot-password" className="text-sm text-primary underline-offset-4 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>

          <div className="mt-4 rounded-md border p-4">
            <h3 className="mb-2 font-medium">Demo Accounts</h3>
            <div className="space-y-2 text-sm">
              {validCredentials.map((cred, index) => (
                <div key={index} className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="font-medium">Email:</span> {cred.email}
                  </div>
                  <div>
                    <span className="font-medium">Password:</span> {cred.password}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-primary underline-offset-4 hover:underline">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
