"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function fetchPurchaseMasterData() {
  const suppliers = await prisma.supplier.findMany({
    select: { id: true, name: true }
  });
  
  const products = await prisma.product.findMany({
    where: { isActive: true },
    select: { id: true, code: true, nameEn: true, baseUomId: true, cost: true, tradePrice: true }
  });
  
  const branches = await prisma.branch.findMany({
    select: { id: true, name: true, code: true }
  });

  return { suppliers, products, branches };
}

export async function fetchActivePOs() {
  return prisma.purchaseOrder.findMany({
    include: {
      supplier: true,
      items: { include: { product: true } },
      grns: { include: { items: true } }
    },
    orderBy: { createdAt: 'desc' }
  });
}

export async function createSuitePO(data: any) {
  let tenant = await prisma.tenant.findFirst();
  if (!tenant) throw new Error("No tenant found");

  const po = await prisma.purchaseOrder.create({
    data: {
      tenantId: tenant.id,
      supplierId: data.supplierId,
      branchId: data.branchId,
      poNumber: data.poNumber,
      paymentTerms: data.paymentTerms,
      date: new Date(data.orderDate),
      expectedDate: new Date(data.expectedDate),
      warehouse: data.warehouse,
      notes: data.notes,
      subtotal: data.subtotal,
      discount: data.discount,
      tax: data.tax,
      total: data.totalValue,
      status: 'PO Issued',
      items: {
        create: data.items.map((it: any) => ({
          productId: it.productId,
          uomId: it.uomId,
          qty: it.qty,
          rate: it.price,
          tradeDiscPct: it.td,
          schemeDiscPct: it.sch,
          taxRatePct: it.tax,
          discount: ((it.qty * it.price) * ((it.td + it.sch) / 100)),
          tax: (((it.qty * it.price) - ((it.qty * it.price) * ((it.td + it.sch) / 100))) * (it.tax / 100)),
          total: it.net
        }))
      }
    }
  });

  revalidatePath("/purchase/suite");
  return po;
}

export async function submitSuiteGRN(data: any) {
  let tenant = await prisma.tenant.findFirst();
  if (!tenant) throw new Error("No tenant found");

  const grn = await prisma.goodsReceivedNote.create({
    data: {
      tenantId: tenant.id,
      poId: data.poId,
      grnNumber: data.grnNumber,
      date: new Date(data.receiptDate),
      notes: data.remarks,
      items: {
        create: data.items.map((it: any) => ({
          productId: it.productId,
          uomId: it.uomId,
          qtyReceived: it.receivedQty,
          qtyAccepted: it.acceptedQty,
          qtyRejected: it.rejectedQty,
          batchNumber: it.lotNumber,
          mfgDate: new Date(it.mfgDate),
          expiryDate: new Date(it.expDate),
          storageZone: it.zone
        }))
      }
    }
  });

  await prisma.purchaseOrder.update({
    where: { id: data.poId },
    data: { status: 'GRN Verified' }
  });

  // Note: StockLedger updates can be added here for acceptedQty

  revalidatePath("/purchase/suite");
  return grn;
}

export async function settleSuitePayment(data: any) {
  let tenant = await prisma.tenant.findFirst();
  if (!tenant) throw new Error("No tenant found");

  const invoice = await prisma.purchaseInvoice.create({
    data: {
      tenantId: tenant.id,
      supplierId: data.supplierId,
      grnId: data.grnId,
      invoiceNumber: data.supplierInvoiceNum,
      date: new Date(data.paidDate),
      subtotal: data.grossBilled,
      discount: data.cashDiscountAmount,
      tax: data.taxAmount,
      total: data.paidAmount, // This handles penalty implicitly via net calculation
      // Create associated payment
    }
  });

  await prisma.supplierPayment.create({
    data: {
      tenantId: tenant.id,
      supplierId: data.supplierId,
      paymentNumber: "PAY-" + Math.floor(1000 + Math.random() * 9000),
      amount: data.paidAmount,
      paymentMethod: data.mode,
      reference: data.txnRef,
      cashDiscount: data.cashDiscountPct,
      penalty: data.penalty
    }
  });

  await prisma.purchaseOrder.update({
    where: { id: data.poId },
    data: { status: 'Paid & Closed' }
  });

  revalidatePath("/purchase/suite");
  return invoice;
}
