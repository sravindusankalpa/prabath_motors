import Link from "next/link"
import {
  BarChart,
  CalendarDays,
  Car,
  FileText,
  MessageSquare,
  Settings,
  Users,
  Wrench,
  Package,
  Truck,
} from "lucide-react"

export function DashboardNav() {
  return (
    <div className="hidden border-r bg-muted/40 md:block md:w-64">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-2 text-sm font-medium">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted hover:text-primary transition-colors"
            >
              <BarChart className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="/bookings"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted hover:text-primary transition-colors"
            >
              <CalendarDays className="h-4 w-4" />
              Bookings
            </Link>
            <Link
              href="/customers"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted hover:text-primary transition-colors"
            >
              <Users className="h-4 w-4" />
              Customers
            </Link>
            <Link
              href="/services"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted hover:text-primary transition-colors"
            >
              <Wrench className="h-4 w-4" />
              Services
            </Link>
            <Link
              href="/invoices"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted hover:text-primary transition-colors"
            >
              <FileText className="h-4 w-4" />
              Invoices
            </Link>
            <Link
              href="/inventory"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted hover:text-primary transition-colors"
            >
              <Package className="h-4 w-4" />
              Inventory
            </Link>
            <Link
              href="/inventory/purchase-orders"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted hover:text-primary transition-colors ml-6"
            >
              <Truck className="h-4 w-4" />
              Purchase Orders
            </Link>
            <Link
              href="/inventory/suppliers"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted hover:text-primary transition-colors ml-6"
            >
              <Users className="h-4 w-4" />
              Suppliers
            </Link>
            <Link
              href="/vehicles"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted hover:text-primary transition-colors"
            >
              <Car className="h-4 w-4" />
              Vehicles
            </Link>
            <Link
              href="/notifications"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted hover:text-primary transition-colors"
            >
              <MessageSquare className="h-4 w-4" />
              Notifications
            </Link>
            <Link
              href="/repair-status"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted hover:text-primary transition-colors"
            >
              <Wrench className="h-4 w-4" />
              Repair Status
            </Link>
            <Link
              href="/settings"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted hover:text-primary transition-colors"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>
          </nav>
        </div>
      </div>
    </div>
  )
}
