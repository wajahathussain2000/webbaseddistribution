"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

export async function createGRN(data: {
  poId: string;
  grnNumber: string;
  date: string;
  notes: string;
  warehouseId: string;
  items: Array<{
    productId: string;
    uomId: string;
    qtyReceived: number;
    unitCost: number; // passed from PO
  }>;
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const userTenant = await prisma.tenantUser.findFirst({
    where: { userId: session.user.id }
  });
  if (!userTenant) throw new Error("No tenant assigned to user");

  const po = await prisma.purchaseOrder.findFirst({
    where: { id: data.poId, tenantId: userTenant.tenantId }
  });
  if (!po) throw new Error("Purchase Order not found");

  const warehouse = await prisma.warehouse.findFirst({
    where: { id: data.warehouseId, tenantId: userTenant.tenantId }
  });
  if (!warehouse) throw new Error("Warehouse not found");

  const result = await prisma.$transaction(async (tx) => {
    // 1. Create GRN
    const grn = await tx.goodsReceivedNote.create({
      data: {
        tenantId: userTenant.tenantId,
        poId: po.id,
        grnNumber: data.grnNumber,
        date: data.date ? new Date(data.date) : new Date(),
        notes: data.notes,
        items: {
          create: data.items.map(item => ({
            productId: item.productId,
            uomId: item.uomId,
            qtyReceived: item.qtyReceived,
            qtyAccepted: item.qtyReceived, // Assuming all accepted for MVP
            qtyRejected: 0
          }))
        }
      }
    });

    // 2. Update Stock and GL
    let totalReceivedValue = 0;

    for (const item of data.items) {
      if (item.qtyReceived <= 0) continue;

      totalReceivedValue += (item.qtyReceived * item.unitCost);

      // Find or create stock balance
      let balance = await tx.stockBalance.findFirst({
        where: { productId: item.productId, warehouseId: warehouse.id }
      });
      
      if (!balance) {
        balance = await tx.stockBalance.create({
          data: {
            tenantId: userTenant.tenantId, productId: item.productId, warehouseId: warehouse.id,
            qtyAvailable: item.qtyReceived
          }
        });
      } else {
        balance = await tx.stockBalance.update({
          where: { id: balance.id },
          data: { qtyAvailable: balance.qtyAvailable + item.qtyReceived }
        });
      }

      // Record Stock Ledger
      await tx.stockLedger.create({
        data: {
          tenantId: userTenant.tenantId, productId: item.productId,
          documentType: "GRN", documentId: data.grnNumber,
          qtyIn: item.qtyReceived, qtyOut: 0, balance: balance.qtyAvailable,
          date: new Date()
        }
      });
    }

    // 3. GL Entry (Debit Inventory, Credit AP / GRNI)
    const jv = await tx.journalVoucher.create({
      data: {
        tenantId: userTenant.tenantId, branchId: warehouse.branchId, date: new Date(data.date),
        voucherType: "JOURNAL",
        referenceNumber: `GRN-${data.grnNumber}`, notes: `Goods Received Note ${data.grnNumber}`, status: "POSTED"
      }
    });

    // Debit Inventory
    await tx.journalEntry.create({
      data: { voucherId: jv.id, accountId: "inventory-account-id-placeholder", notes: "Inventory Received via GRN", type: "DEBIT", amount: totalReceivedValue, costCentreId: po.supplierId }
    });
    // Credit AP
    await tx.journalEntry.create({
      data: { voucherId: jv.id, accountId: "ap-account-id-placeholder", notes: "Liability from GRN", type: "CREDIT", amount: totalReceivedValue, costCentreId: po.supplierId }
    });

    // 4. Mark PO as COMPLETED (Assuming fully received for MVP)
    await tx.purchaseOrder.update({
      where: { id: po.id },
      data: { status: "COMPLETED" }
    });

    return grn;
  });

  revalidatePath("/warehouse/grn");
  revalidatePath("/purchase");
  return { success: true, grnId: result.id };
}
