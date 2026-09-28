"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createPurchaseOrder(data: {
  supplierId: string;
  poNumber: string;
  expectedDate: string;
  notes: string;
  items: Array<{ productId: string; qty: number; rate: number; uomId: string; barcode?: string }>;
}) {
  // Ensure we have a tenant and a branch
  let tenant = await prisma.tenant.findFirst();
  if (!tenant) throw new Error("No tenant found");

  let branch = await prisma.branch.findFirst({ where: { tenantId: tenant.id } });
  if (!branch) {
    branch = await prisma.branch.create({ 
      data: { tenantId: tenant.id, name: "Main Warehouse", type: "HEAD_OFFICE" } 
    });
  }

  // Calculate totals
  const subtotal = data.items.reduce((sum, item) => sum + (item.qty * item.rate), 0);
  const total = subtotal; // Ignoring tax/discount for this basic version

  // Create the PO and its line items in a single transaction
  await prisma.purchaseOrder.create({
    data: {
      tenantId: tenant.id,
      supplierId: data.supplierId,
      branchId: branch.id,
      poNumber: data.poNumber,
      expectedDate: data.expectedDate ? new Date(data.expectedDate) : null,
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

  // Save barcodes if provided
  for (const item of data.items) {
    if (item.barcode && item.barcode.trim() !== "") {
      const existing = await prisma.productBarcode.findFirst({
        where: { productId: item.productId, barcode: item.barcode.trim() }
      });
      if (!existing) {
        await prisma.productBarcode.create({
          data: {
            productId: item.productId,
            barcode: item.barcode.trim(),
            uomId: item.uomId
          }
        });
      }
    }
  }

  revalidatePath("/purchase");
  return { success: true };
}
