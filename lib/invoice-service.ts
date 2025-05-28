// This is a mock service for handling invoices
// In a real application, this would connect to a database or API

// Store invoices in localStorage for persistence
const INVOICES_STORAGE_KEY = "PRABATH MOTORS_invoices"

// Get all invoices
export const getInvoices = async () => {
  if (typeof window === "undefined") return []

  try {
    const storedInvoices = localStorage.getItem(INVOICES_STORAGE_KEY)
    return storedInvoices ? JSON.parse(storedInvoices) : []
  } catch (error) {
    console.error("Error getting invoices:", error)
    return []
  }
}

// Get a single invoice by ID
export const getInvoiceById = async (id: string) => {
  try {
    const invoices = await getInvoices()
    return invoices.find((invoice: any) => invoice.id === id) || null
  } catch (error) {
    console.error("Error getting invoice:", error)
    return null
  }
}

// Create a new invoice
export const createInvoice = async (invoiceData: any) => {
  try {
    const invoices = await getInvoices()

    // Add created timestamp
    const newInvoice = {
      ...invoiceData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // Add to invoices array
    invoices.push(newInvoice)

    // Save to localStorage
    localStorage.setItem(INVOICES_STORAGE_KEY, JSON.stringify(invoices))

    return newInvoice
  } catch (error) {
    console.error("Error creating invoice:", error)
    throw error
  }
}

// Update an existing invoice
export const updateInvoice = async (id: string, invoiceData: any) => {
  try {
    const invoices = await getInvoices()
    const index = invoices.findIndex((invoice: any) => invoice.id === id)

    if (index === -1) {
      throw new Error(`Invoice with ID ${id} not found`)
    }

    // Update invoice with new data
    const updatedInvoice = {
      ...invoices[index],
      ...invoiceData,
      updatedAt: new Date().toISOString(),
    }

    invoices[index] = updatedInvoice

    // Save to localStorage
    localStorage.setItem(INVOICES_STORAGE_KEY, JSON.stringify(invoices))

    return updatedInvoice
  } catch (error) {
    console.error("Error updating invoice:", error)
    throw error
  }
}

// Delete an invoice
export const deleteInvoice = async (id: string) => {
  try {
    const invoices = await getInvoices()
    const filteredInvoices = invoices.filter((invoice: any) => invoice.id !== id)

    // Save to localStorage
    localStorage.setItem(INVOICES_STORAGE_KEY, JSON.stringify(filteredInvoices))

    return true
  } catch (error) {
    console.error("Error deleting invoice:", error)
    throw error
  }
}
