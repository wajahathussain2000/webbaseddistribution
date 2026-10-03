"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

export async function createSalesInvoice(data: {
  orderId: string;
  invoiceNumber: string;
  date: string;
  warehouseId: string;
  accountId: string; // Cash or Accounts Receivable
  items: Array<{
    productId: string;
    uomId: string;
    qty: number;
    rate: number;
  }>;
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const userTenant = await prisma.tenantUser.findFirst({
    where: { userId: session.user.id }
  });
  if (!userTenant) throw new Error("No tenant assigned to user");
  const tenantId = userTenant.tenantId;

  const so = await prisma.salesOrder.findFirst({
    where: { id: data.orderId, tenantId }
  });
  if (!so) throw new Error("Sales Order not found");

  const warehouse = await prisma.warehouse.findFirst({
    where: { id: data.warehouseId, tenantId }
  });
  if (!warehouse) throw new Error("Warehouse not found");

  const subtotal = data.items.reduce((sum, item) => sum + (item.qty * item.rate), 0);
  const total = subtotal;

  const result = await prisma.$transaction(async (tx) => {
    // 1. Create Sales Invoice
    const invoice = await tx.salesInvoice.create({
      data: {
        tenantId,
        orderId: so.id,
        customerId: so.customerId,
        branchId: so.branchId,
        invoiceNumber: data.invoiceNumber,
        date: data.date ? new Date(data.date) : new Date(),
        status: "PAID", // Simplified for MVP
        subtotal,
        total,
        amountPaid: total,
        items: {
          create: data.items.map(item => ({
            productId: item.productId,
            uomId: item.uomId,
            qty: item.qty,
            rate: item.rate,
            total: item.qty * item.rate
          }))
        }
      }
    });

    let totalCogs = 0;

    // 2. Update Stock and COGS
    for (const item of data.items) {
      if (item.qty <= 0) continue;

      const balance = await tx.stockBalance.findFirst({
        where: { productId: item.productId, warehouseId: warehouse.id }
      });
      
      if (!balance || balance.qtyAvailable < item.qty) {
        throw new Error(`Insufficient stock for product ID: ${item.productId}`);
      }

      const prodCost = await tx.product.findUnique({ where: { id: item.productId } });
      const unitCost = prodCost?.cost || 0;
      totalCogs += (unitCost * item.qty);

      // Deduct stock
      await tx.stockBalance.update({
        where: { id: balance.id },
        data: { qtyAvailable: balance.qtyAvailable - item.qty }
      });

      // Record Stock Ledger
      await tx.stockLedger.create({
        data: {
          tenantId, productId: item.productId,
          documentType: "SALES_INVOICE", documentId: data.invoiceNumber,
          qtyIn: 0, qtyOut: item.qty, balance: balance.qtyAvailable - item.qty,
          date: new Date()
        }
      });
    }

    // 3. GL Entry (Double-Entry: AR/Cash vs Revenue, COGS vs Inventory)
    const jv = await tx.journalVoucher.create({
      data: {
        tenantId, branchId: so.branchId, date: new Date(data.date),
        voucherType: "JOURNAL",
        referenceNumber: `INV-${data.invoiceNumber}`, notes: `Sales Invoice ${data.invoiceNumber}`, status: "POSTED"
      }
    });

    // Debit Selected Account (Asset - Cash/Bank/AR)
    await tx.journalEntry.create({
      data: { voucherId: jv.id, accountId: data.accountId, notes: "Sales Receipt / Receivable", type: "DEBIT", amount: total, costCentreId: so.customerId }
    });
    // Credit Sales (Revenue)
    await tx.journalEntry.create({
      data: { voucherId: jv.id, accountId: "sales-account-id-placeholder", notes: "Sales Revenue", type: "CREDIT", amount: total, costCentreId: so.customerId }
    });
    // Debit COGS (Expense)
    await tx.journalEntry.create({
      data: { voucherId: jv.id, accountId: "cogs-account-id-placeholder", notes: "Cost of Goods Sold", type: "DEBIT", amount: totalCogs }
    });
    // Credit Inventory (Asset)
    await tx.journalEntry.create({
      data: { voucherId: jv.id, accountId: "inventory-account-id-placeholder", notes: "Inventory Deduction", type: "CREDIT", amount: totalCogs }
    });

    // 4. Mark PO as COMPLETED
    await tx.salesOrder.update({
      where: { id: so.id },
      data: { status: "COMPLETED" }
    });

    return invoice;
  });

  revalidatePath("/sales");
  revalidatePath("/inventory");
  return { success: true, invoiceId: result.id };
}
