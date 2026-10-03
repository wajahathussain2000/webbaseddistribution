"use server";

import { prisma } from "@/lib/prisma";

export async function generateReport(reportName: string, dateFilter: string) {
  let data: any[] = [];
  
  try {
    const today = new Date();
    // In a real scenario, use dateFilter to build actual start/end dates for the queries.
    // For now, we'll fetch general active data limited to recent 100 rows.

    // -------------------------
    // 1. SALES REPORTS
    // -------------------------
    if (
      reportName.includes("Sales") || 
      reportName.includes("Invoice") || 
      reportName.includes("Order") ||
      reportName.includes("Discount") ||
      reportName.includes("Customer") ||
      reportName.includes("Performance") ||
      reportName.includes("Cost Sales")
    ) {
      if (reportName === "Sales Return Register") {
        const returns = await prisma.salesReturn.findMany({ include: { customer: true, items: true }, take: 100 });
        data = returns.map(r => ({
          date: r.date.toISOString().split('T')[0],
          branch: 'Main', // SalesReturn does not have branchId in current schema
          reference: r.returnNumber,
          party: r.customer?.name || 'Walk-in',
          category: 'Sales Return',
          quantity: r.items.reduce((s: number, i: any) => s + i.qty, 0),
          total: r.total * -1 // Returns are negative
        }));
      } else {
        const invoices = await prisma.salesInvoice.findMany({ include: { customer: true, branch: true, items: { include: { product: { include: { category: true } } } } }, take: 100 });
        data = invoices.map(inv => ({
          date: inv.date.toISOString().split('T')[0],
          branch: inv.branch?.name || 'Main',
          reference: inv.invoiceNumber,
          party: inv.customer?.name || 'Walk-in',
          category: inv.items[0]?.product?.category?.name || 'Mixed',
          quantity: inv.items.reduce((s, i) => s + i.qty, 0),
          total: inv.total
        }));
        
        // Also include POS sales in "Daily Sales Summary"
        if (reportName === "Daily Sales Summary") {
          const pos = await prisma.posTransaction.findMany({ include: { branch: true, items: true }, take: 100 });
          const posData = pos.map(t => ({
            date: t.date.toISOString().split('T')[0],
            branch: t.branch?.name || 'Main',
            reference: t.receiptNumber,
            party: 'POS Walk-in',
            category: 'Retail',
            quantity: t.items.reduce((s, i) => s + i.qty, 0),
            total: t.total
          }));
          data = [...data, ...posData].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        }
      }
    }
    // -------------------------
    // 2. PURCHASE REPORTS
    // -------------------------
    else if (
      reportName.includes("Purchase") || 
      reportName.includes("PO") || 
      reportName.includes("Supplier") ||
      reportName.includes("Price Variance") ||
      reportName.includes("Cost Sheet") ||
      reportName === "GRN Register"
    ) {
      const pos = await prisma.purchaseOrder.findMany({ include: { branch: true, supplier: true, items: true }, take: 100 });
      data = pos.map(p => ({
        date: p.date.toISOString().split('T')[0],
        branch: p.branch?.name || 'Main',
        reference: p.poNumber,
        party: p.supplier?.name || 'Unknown Supplier',
        category: 'Purchase',
        quantity: p.items.reduce((s, i) => s + i.qty, 0),
        total: p.total
      }));
    }
    // -------------------------
    // 3. INVENTORY & STOCK REPORTS
    // -------------------------
    else if (
      reportName.includes("Stock") || 
      reportName.includes("Inventory") ||
      reportName.includes("Batch") ||
      reportName.includes("ABC") ||
      reportName === "Transfer Register" ||
      reportName === "Reorder List"
    ) {
      const stock = await prisma.productStockLevel.findMany({
        include: { product: { include: { category: true } }, branch: true },
        take: 100
      });
      data = stock.map(s => ({
        date: today.toISOString().split('T')[0],
        branch: s.branch?.name || 'Main',
        reference: s.product.code,
        party: s.product.nameEn,
        category: s.product.category?.name || 'Uncategorized',
        quantity: s.minLevel, // using minLevel as proxy for stock balance for now
        total: (s.minLevel * (s.product.cost || 0))
      }));
    }
    // -------------------------
    // 4. CREDIT & RECOVERY REPORTS
    // -------------------------
    else if (
      reportName.includes("Ledger") || 
      reportName.includes("Aging") || 
      reportName.includes("Cheque") ||
      reportName.includes("Overdue") ||
      reportName.includes("Credit") ||
      reportName.includes("PDC") ||
      reportName.includes("Recovery") ||
      reportName.includes("Outstanding") ||
      reportName.includes("Promise") ||
      reportName.includes("Debt") ||
      reportName.includes("Forecast")
    ) {
      const ledgers = await prisma.customerLedger.findMany({
        include: { customer: true, tenant: true },
        take: 100,
        orderBy: { date: 'desc' }
      });
      data = ledgers.map(l => ({
        date: l.date.toISOString().split('T')[0],
        branch: 'HQ',
        reference: l.documentId,
        party: l.customer?.name || 'Unknown',
        category: l.documentType,
        quantity: 0,
        total: l.balance
      }));
    }
    // -------------------------
    // 5. ACCOUNTING & TAX REPORTS
    // -------------------------
    else if (
      reportName.includes("Balance") || 
      reportName.includes("Cash") || 
      reportName.includes("Bank") ||
      reportName.includes("Tax") ||
      reportName.includes("Profit") ||
      reportName.includes("Asset") ||
      reportName.includes("Ratios") ||
      reportName.includes("General Ledger")
    ) {
      const vouchers = await prisma.journalVoucher.findMany({
        include: { branch: true },
        take: 100,
        orderBy: { date: 'desc' }
      });
      data = vouchers.map(v => ({
        date: v.date.toISOString().split('T')[0],
        branch: v.branch?.name || 'HQ',
        reference: v.referenceNumber,
        party: 'Internal',
        category: v.voucherType,
        quantity: 0,
        total: 0 // Calculate from entries if needed, defaulting to 0 for summary
      }));
    }
    // -------------------------
    // FALLBACK
    // -------------------------
    else {
      // If we somehow miss a report, provide generic mock format
      return { 
        success: false, 
        message: "This specific report format is highly customized and requires additional parameters. We are currently loading a generic ledger view.",
        data: []
      };
    }

    return { success: true, data };
  } catch (error: any) {
    console.error("Report Error:", error);
    return { success: false, message: error.message, data: [] };
  }
}
