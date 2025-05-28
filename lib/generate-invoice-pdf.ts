"use client"

import { jsPDF } from "jspdf"
import html2canvas from "html2canvas"

// Client-side PDF generation function
export const generateInvoicePDF = async (invoiceElement: HTMLElement): Promise<void> => {
  try {
    const canvas = await html2canvas(invoiceElement, {
      scale: 2,
      logging: false,
      useCORS: true,
    })

    const imgData = canvas.toDataURL("image/png")
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    })

    const imgWidth = 210 // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width

    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight)
    pdf.save(`Invoice.pdf`)
  } catch (error) {
    console.error("Error generating PDF:", error)
    throw error
  }
}

// Function to create a printable invoice
export const createPrintableInvoice = (invoice: any): string => {
  return `
    <!-- Header -->
    <div style="display: flex; justify-content: space-between; margin-bottom: 32px;">
      <div>
        <div style="font-size: 24px; font-weight: bold; color: #1A66B3;">GARAGE<span style="display: block; color: black;">HUB</span></div>
        <div style="margin-top: 8px; font-size: 14px;">
          <p>577 Mechanic Street, Autoville, AV 12345</p>
          <p>+1 (555) 123-4567</p>
          <p>service@PRABATH MOTORS.com</p>
          <p>www.PRABATH MOTORS.com</p>
        </div>
      </div>
      <div style="text-align: right;">
        <div style="font-size: 20px; font-weight: bold; margin-bottom: 8px;">INVOICE</div>
        <div style="font-size: 14px;">
          <p><span style="font-weight: 600;">Invoice #:</span> ${invoice.number}</p>
          <p><span style="font-weight: 600;">Date:</span> ${invoice.date}</p>
          <p><span style="font-weight: 600;">Due Date:</span> ${invoice.dueDate}</p>
          <p><span style="font-weight: 600;">Status:</span> ${invoice.status}</p>
        </div>
      </div>
    </div>

    <!-- Divider -->
    <div style="height: 2px; background-color: #1A66B3; margin-bottom: 32px;"></div>

    <!-- Client and Vehicle Info -->
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-bottom: 32px;">
      <div>
        <h2 style="font-size: 18px; font-weight: bold; margin-bottom: 8px; color: #1A66B3;">Bill To:</h2>
        <div style="font-size: 14px;">
          <p style="font-weight: 600;">${invoice.customer.name}</p>
          <p>${invoice.customer.address}</p>
          <p>Phone: ${invoice.customer.phone}</p>
          <p>Email: ${invoice.customer.email}</p>
        </div>
      </div>
      <div>
        <h2 style="font-size: 18px; font-weight: bold; margin-bottom: 8px; color: #1A66B3;">Vehicle Information:</h2>
        <div style="font-size: 14px;">
          <p style="font-weight: 600;">${invoice.vehicle.year} ${invoice.vehicle.make} ${invoice.vehicle.model}</p>
          <p>License Plate: ${invoice.vehicle.licensePlate}</p>
        </div>
      </div>
    </div>

    <!-- Items Table -->
    <div style="margin-bottom: 32px;">
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background-color: #1A66B3; color: white;">
            <th style="padding: 8px 16px; text-align: left;">Description</th>
            <th style="padding: 8px 16px; text-align: right;">Quantity</th>
            <th style="padding: 8px 16px; text-align: right;">Unit Price</th>
            <th style="padding: 8px 16px; text-align: right;">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${invoice.items
            .map(
              (item: any, index: number) => `
            <tr style="background-color: ${index % 2 === 0 ? "#f3f4f6" : "white"};">
              <td style="padding: 8px 16px; font-size: 14px;">${item.description}</td>
              <td style="padding: 8px 16px; font-size: 14px; text-align: right;">${item.quantity}</td>
              <td style="padding: 8px 16px; font-size: 14px; text-align: right;">Rs.${item.unitPrice.toFixed(2)}</td>
              <td style="padding: 8px 16px; font-size: 14px; text-align: right;">Rs.${item.total.toFixed(2)}</td>
            </tr>
          `,
            )
            .join("")}
        </tbody>
      </table>
    </div>

    <!-- Totals -->
    <div style="display: flex; justify-content: flex-end; margin-bottom: 32px;">
      <div style="width: 256px;">
        <div style="display: flex; justify-content: space-between; padding: 8px 0;">
          <span style="font-weight: 600;">Subtotal:</span>
          <span>Rs.${invoice.subtotal.toFixed(2)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; padding: 8px 0;">
          <span style="font-weight: 600;">Tax:</span>
          <span>Rs.${invoice.tax.toFixed(2)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; padding: 8px 16px; background-color: #1A66B3; color: white;">
          <span style="font-weight: bold;">TOTAL:</span>
          <span style="font-weight: bold;">Rs.${invoice.total.toFixed(2)}</span>
        </div>
      </div>
    </div>

    <!-- Payment Terms -->
    <div style="margin-bottom: 32px;">
      <h2 style="font-size: 18px; font-weight: bold; margin-bottom: 8px; color: #1A66B3;">Payment Terms:</h2>
      <p style="font-size: 14px;">Payment due within 7 days of invoice date. We accept cash, credit cards, and bank transfers.</p>
    </div>

    <!-- Signature -->
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-bottom: 32px;">
      <div>
        <div style="border-bottom: 1px dashed #a0aec0; height: 32px; margin-bottom: 8px;"></div>
        <p style="text-align: center; font-size: 14px; font-weight: 600;">Customer Signature</p>
      </div>
      <div>
        <div style="border-bottom: 1px dashed #a0aec0; height: 32px; margin-bottom: 8px;"></div>
        <p style="text-align: center; font-size: 14px; font-weight: 600;">Authorized Signature</p>
      </div>
    </div>

    <!-- Footer -->
    <div style="margin-top: 64px; padding-top: 16px; border-top: 1px solid #1A66B3; text-align: center; font-size: 14px;">
      <p>Thank you for your business! If you have any questions about this invoice, please contact us.</p>
    </div>
  `
}

// Function to generate and save invoice PDF
export const generateAndSaveInvoicePDF = async (invoice: any): Promise<void> => {
  try {
    // Create a temporary container for the invoice HTML
    const container = document.createElement("div")
    container.innerHTML = createPrintableInvoice(invoice)
    document.body.appendChild(container)

    // Generate the PDF
    await generateInvoicePDF(container)

    // Clean up the temporary container
    document.body.removeChild(container)
  } catch (error) {
    console.error("Error generating and saving PDF:", error)
    throw error
  }
}
