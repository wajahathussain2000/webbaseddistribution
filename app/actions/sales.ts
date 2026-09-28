"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createSalesOrder(data: {
  customerId: string;
  orderNumber: string;
  notes: string;
  items: Array<{ productId: string; qty: number; rate: number; uomId: string }>;
}) {
  // Ensure we have a tenant and a branch
  let tenant = await prisma.tenant.findFirst();
  if (!tenant) throw new Error("No tenant found");

  let branch = await prisma.branch.findFirst({ where: { tenantId: tenant.id } });
  if (!branch) {
    branch = await prisma.branch.create({ 
      data: { tenantId: tenant.id, name: "Main Branch", type: "HEAD_OFFICE" } 
    });
  }

  // Calculate totals
  const subtotal = data.items.reduce((sum, item) => sum + (item.qty * item.rate), 0);
  const total = subtotal; // Ignoring tax/discount for this basic version

  // Create the Sales Order and its line items in a single transaction
  await prisma.salesOrder.create({
    data: {
      tenantId: tenant.id,
      customerId: data.customerId,
      branchId: branch.id,
      orderNumber: data.orderNumber,
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

  revalidatePath("/sales");
  return { success: true };
}
