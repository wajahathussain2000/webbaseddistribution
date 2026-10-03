"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

export async function createPurchaseOrder(data: {
  supplierId: string;
  accountId: string;
  poNumber: string;
  expectedDate: string;
  notes: string;
  items: Array<{ productId: string; qty: number; rate: number; uomId: string; barcode?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const userTenant = await prisma.tenantUser.findFirst({
    where: { userId: session.user.id }
  });
  if (!userTenant) throw new Error("No tenant assigned to user");
  const tenantId = userTenant.tenantId;

  const userBranch = await prisma.userBranchAccess.findFirst({
    where: { tenantUserId: userTenant.id }
  });
  if (!userBranch) throw new Error("No branch assigned to user");
  const branchId = userBranch.branchId;

  // Find MAIN warehouse to add stock
  const warehouse = await prisma.warehouse.findFirst({ where: { branchId, type: "MAIN" }});
  if (!warehouse) throw new Error("No MAIN warehouse found for this branch");

  const subtotal = data.items.reduce((sum, item) => sum + (item.qty * item.rate), 0);
  const total = subtotal;

  const result = await prisma.$transaction(async (tx) => {
    // 1. Create Purchase Order (Status: PENDING - Stock/GL will be handled in GRN/Invoice)
    const po = await tx.purchaseOrder.create({
      data: {
        tenantId,
        supplierId: data.supplierId,
        branchId,
        poNumber: data.poNumber,
        expectedDate: data.expectedDate ? new Date(data.expectedDate) : null,
        status: "PENDING",
        subtotal,
        total,
        notes: data.notes,
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

    return po;
  });

  revalidatePath("/purchase");
  return { success: true };
}
