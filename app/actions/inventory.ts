"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

export async function createStockAdjustment(data: {
  warehouseId: string;
  adjustNumber: string;
  date: string;
  type: "ADDITION" | "DEDUCTION";
  notes: string;
  items: Array<{ productId: string; qty: number; unitCost: number }>;
  offsetAccountId: string; // The expense/revenue account for adjustment
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

  const totalValue = data.items.reduce((sum, item) => sum + (item.qty * item.unitCost), 0);

  const result = await prisma.$transaction(async (tx) => {
    // 1. Create Stock Adjustment Header
    const adjustment = await tx.stockAdjustment.create({
      data: {
        tenantId,
        warehouseId: data.warehouseId,
        adjustNumber: data.adjustNumber,
        date: data.date ? new Date(data.date) : new Date(),
        reason: data.notes,
        status: "APPROVED",
        items: {
          create: data.items.map(item => ({
            productId: item.productId,
            qtyAdjusted: data.type === "ADDITION" ? item.qty : -item.qty
          }))
        }
      }
    });

    // 2. Adjust Stock Balances & Ledgers
    for (const item of data.items) {
      let balance = await tx.stockBalance.findFirst({
        where: { productId: item.productId, warehouseId: data.warehouseId }
      });

      if (!balance && data.type === "DEDUCTION") {
        throw new Error(`Cannot deduct stock for product ${item.productId}. No balance exists.`);
      }

      const currentQty = balance ? balance.qtyAvailable : 0;
      let newQty = currentQty;

      if (data.type === "ADDITION") {
        newQty += item.qty;
      } else {
        if (currentQty < item.qty) {
          throw new Error(`Insufficient stock for product ${item.productId} to deduct.`);
        }
        newQty -= item.qty;
      }

      if (balance) {
        await tx.stockBalance.update({
          where: { id: balance.id },
          data: { qtyAvailable: newQty }
        });
      } else {
        await tx.stockBalance.create({
          data: {
            tenantId, productId: item.productId, warehouseId: data.warehouseId,
            qtyAvailable: newQty
          }
        });
      }

      await tx.stockLedger.create({
        data: {
          tenantId, productId: item.productId,
          documentType: "ADJUSTMENT", documentId: data.adjustNumber,
          qtyIn: data.type === "ADDITION" ? item.qty : 0,
          qtyOut: data.type === "DEDUCTION" ? item.qty : 0,
          balance: newQty,
          date: new Date()
        }
      });
    }

    // 3. GL Entry
    const jv = await tx.journalVoucher.create({
      data: {
        tenantId, branchId: warehouse.branchId, date: new Date(data.date),
        voucherType: "JOURNAL",
        referenceNumber: `ADJ-${data.adjustNumber}`, notes: data.notes, status: "POSTED"
      }
    });

    if (data.type === "ADDITION") {
      // Debit Inventory, Credit Offset (e.g. Found Stock Income)
      await tx.journalEntry.create({
        data: { voucherId: jv.id, accountId: "inventory-account-id-placeholder", type: "DEBIT", amount: totalValue, notes: data.notes }
      });
      await tx.journalEntry.create({
        data: { voucherId: jv.id, accountId: data.offsetAccountId, type: "CREDIT", amount: totalValue, notes: data.notes }
      });
    } else {
      // Debit Offset (e.g. Shrinkage Expense), Credit Inventory
      await tx.journalEntry.create({
        data: { voucherId: jv.id, accountId: data.offsetAccountId, type: "DEBIT", amount: totalValue, notes: data.notes }
      });
      await tx.journalEntry.create({
        data: { voucherId: jv.id, accountId: "inventory-account-id-placeholder", type: "CREDIT", amount: totalValue, notes: data.notes }
      });
    }

    return adjustment;
  });

  revalidatePath("/inventory");
  return { success: true, adjustmentId: result.id };
}
