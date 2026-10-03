"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

export async function createSalesReturn(data: {
  customerId: string;
  returnNumber: string;
  date: string;
  warehouseId: string;
  accountId: string; // The AR or Cash account to credit
  reason: string;
  items: Array<{
    productId: string;
    uomId: string;
    qty: number;
    amount: number;
    reason: string;
  }>;
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const userTenant = await prisma.tenantUser.findFirst({
    where: { userId: session.user.id }
  });
  if (!userTenant) throw new Error("No tenant assigned to user");
  const tenantId = userTenant.tenantId;

  const warehouse = await prisma.warehouse.findFirst({
    where: { id: data.warehouseId, tenantId }
  });
  if (!warehouse) throw new Error("Warehouse not found");

  const total = data.items.reduce((sum, item) => sum + item.amount, 0);

  const result = await prisma.$transaction(async (tx) => {
    // 1. Create Sales Return
    const sr = await tx.salesReturn.create({
      data: {
        tenantId,
        customerId: data.customerId,
        returnNumber: data.returnNumber,
        date: data.date ? new Date(data.date) : new Date(),
        reason: data.reason,
        total,
        items: {
          create: data.items.map(item => ({
            productId: item.productId,
            uomId: item.uomId,
            qty: item.qty,
            amount: item.amount,
            reason: item.reason
          }))
        }
      }
    });

    let totalCogs = 0;

    // 2. Add Stock Back and Reverse COGS
    for (const item of data.items) {
      if (item.qty <= 0) continue;

      let balance = await tx.stockBalance.findFirst({
        where: { productId: item.productId, warehouseId: warehouse.id }
      });
      
      if (!balance) {
        balance = await tx.stockBalance.create({
          data: {
            tenantId, productId: item.productId, warehouseId: warehouse.id,
            qtyAvailable: item.qty
          }
        });
      } else {
        balance = await tx.stockBalance.update({
          where: { id: balance.id },
          data: { qtyAvailable: balance.qtyAvailable + item.qty }
        });
      }

      const prodCost = await tx.product.findUnique({ where: { id: item.productId } });
      const unitCost = prodCost?.cost || 0;
      totalCogs += (unitCost * item.qty);

      // Record Stock Ledger
      await tx.stockLedger.create({
        data: {
          tenantId, productId: item.productId,
          documentType: "SALES_RETURN", documentId: data.returnNumber,
          qtyIn: item.qty, qtyOut: 0, balance: balance.qtyAvailable,
          date: new Date()
        }
      });
    }

    // 3. GL Entry (Reverse of Sales: Debit Sales/Revenue Return, Credit AR/Cash)
    const jv = await tx.journalVoucher.create({
      data: {
        tenantId, branchId: warehouse.branchId, date: new Date(data.date),
        voucherType: "JOURNAL",
        referenceNumber: `SR-${data.returnNumber}`, notes: `Sales Return ${data.returnNumber}`, status: "POSTED"
      }
    });

    // Debit Sales Returns (Contra Revenue) - Using placeholder for MVP
    await tx.journalEntry.create({
      data: { voucherId: jv.id, accountId: "sales-return-account-id", notes: "Sales Return", type: "DEBIT", amount: total, costCentreId: data.customerId }
    });
    // Credit Selected Account (Asset - Cash/Bank/AR)
    await tx.journalEntry.create({
      data: { voucherId: jv.id, accountId: data.accountId, notes: "Customer Credit for Return", type: "CREDIT", amount: total, costCentreId: data.customerId }
    });
    // Debit Inventory (Asset)
    await tx.journalEntry.create({
      data: { voucherId: jv.id, accountId: "inventory-account-id-placeholder", notes: "Inventory Received from Return", type: "DEBIT", amount: totalCogs }
    });
    // Credit COGS (Expense Reversal)
    await tx.journalEntry.create({
      data: { voucherId: jv.id, accountId: "cogs-account-id-placeholder", notes: "COGS Reversal", type: "CREDIT", amount: totalCogs }
    });

    return sr;
  });

  revalidatePath("/sales");
  revalidatePath("/inventory");
  return { success: true, returnId: result.id };
}

export async function createPurchaseReturn(data: {
  supplierId: string;
  returnNumber: string;
  date: string;
  warehouseId: string;
  accountId: string; // The AP or Cash account to debit
  reason: string;
  items: Array<{
    productId: string;
    uomId: string;
    qty: number;
    amount: number;
    reason: string;
  }>;
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const userTenant = await prisma.tenantUser.findFirst({
    where: { userId: session.user.id }
  });
  if (!userTenant) throw new Error("No tenant assigned to user");
  const tenantId = userTenant.tenantId;

  const warehouse = await prisma.warehouse.findFirst({
    where: { id: data.warehouseId, tenantId }
  });
  if (!warehouse) throw new Error("Warehouse not found");

  const total = data.items.reduce((sum, item) => sum + item.amount, 0);

  const result = await prisma.$transaction(async (tx) => {
    // 1. Create Purchase Return
    const pr = await tx.purchaseReturn.create({
      data: {
        tenantId,
        supplierId: data.supplierId,
        returnNumber: data.returnNumber,
        date: data.date ? new Date(data.date) : new Date(),
        reason: data.reason,
        total,
        items: {
          create: data.items.map(item => ({
            productId: item.productId,
            uomId: item.uomId,
            qty: item.qty,
            amount: item.amount,
            reason: item.reason
          }))
        }
      }
    });

    // 2. Deduct Stock
    for (const item of data.items) {
      if (item.qty <= 0) continue;

      let balance = await tx.stockBalance.findFirst({
        where: { productId: item.productId, warehouseId: warehouse.id }
      });
      
      if (!balance || balance.qtyAvailable < item.qty) {
        throw new Error(`Insufficient stock to return for product ID: ${item.productId}`);
      }
      
      balance = await tx.stockBalance.update({
        where: { id: balance.id },
        data: { qtyAvailable: balance.qtyAvailable - item.qty }
      });

      // Record Stock Ledger
      await tx.stockLedger.create({
        data: {
          tenantId, productId: item.productId,
          documentType: "PURCHASE_RETURN", documentId: data.returnNumber,
          qtyIn: 0, qtyOut: item.qty, balance: balance.qtyAvailable,
          date: new Date()
        }
      });
    }

    // 3. GL Entry (Reverse of Purchase: Debit AP/Cash, Credit Inventory/Purchase Return)
    const jv = await tx.journalVoucher.create({
      data: {
        tenantId, branchId: warehouse.branchId, date: new Date(data.date),
        voucherType: "JOURNAL",
        referenceNumber: `PR-${data.returnNumber}`, notes: `Purchase Return ${data.returnNumber}`, status: "POSTED"
      }
    });

    // Debit Selected Account (Liability AP / Asset Cash)
    await tx.journalEntry.create({
      data: { voucherId: jv.id, accountId: data.accountId, notes: "Vendor Debit for Return", type: "DEBIT", amount: total, costCentreId: data.supplierId }
    });
    // Credit Inventory
    await tx.journalEntry.create({
      data: { voucherId: jv.id, accountId: "inventory-account-id-placeholder", notes: "Inventory Returned", type: "CREDIT", amount: total }
    });

    return pr;
  });

  revalidatePath("/purchase");
  revalidatePath("/inventory");
  return { success: true, returnId: result.id };
}
