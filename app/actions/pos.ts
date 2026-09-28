"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createPosTransaction(data: {
  receiptNumber: string;
  paymentMethod: string;
  amountTendered: number;
  changeGiven: number;
  items: Array<{ productId: string; qty: number; rate: number }>;
}) {
  let tenant = await prisma.tenant.findFirst();
  if (!tenant) throw new Error("No tenant found");

  let branch = await prisma.branch.findFirst({ where: { tenantId: tenant.id } });
  if (!branch) {
    branch = await prisma.branch.create({ 
      data: { tenantId: tenant.id, name: "Main POS Branch", type: "SHOP" } 
    });
  }

  const subtotal = data.items.reduce((sum, item) => sum + (item.qty * item.rate), 0);
  const total = subtotal;

  await prisma.posTransaction.create({
    data: {
      tenantId: tenant.id,
      branchId: branch.id,
      receiptNumber: data.receiptNumber,
      paymentMethod: data.paymentMethod,
      subtotal,
      total,
      amountTendered: data.amountTendered,
      changeGiven: data.changeGiven,
      type: "SALE",
      items: {
        create: data.items.map(item => ({
          productId: item.productId,
          qty: item.qty,
          rate: item.rate,
          total: item.qty * item.rate
        }))
      }
    }
  });

  revalidatePath("/pos");
  return { success: true };
}
