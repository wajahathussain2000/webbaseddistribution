"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

export async function createVoucher(data: {
  type: "RECEIPT" | "PAYMENT" | "JOURNAL";
  date: string;
  referenceNumber: string;
  notes: string;
  mainAccountId: string; // The Bank/Cash account (for receipts/payments)
  entries: Array<{
    accountId: string; // The offsetting account (Customer AR, Supplier AP, Expense, etc.)
    costCentreId?: string; // Polymorphic ID for Customer/Supplier
    amount: number;
    notes?: string;
  }>;
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const userTenant = await prisma.tenantUser.findFirst({
    where: { userId: session.user.id }
  });
  if (!userTenant) throw new Error("No tenant assigned to user");

  const userBranch = await prisma.userBranchAccess.findFirst({
    where: { tenantUserId: userTenant.id }
  });
  if (!userBranch) throw new Error("No branch assigned to user");

  const tenantId = userTenant.tenantId;
  const branchId = userBranch.branchId;

  const totalAmount = data.entries.reduce((sum, e) => sum + e.amount, 0);

  const result = await prisma.$transaction(async (tx) => {
    // 1. Create Journal Voucher
    let voucherType = "JOURNAL";
    if (data.type === "RECEIPT") voucherType = "BANK_REC";
    if (data.type === "PAYMENT") voucherType = "BANK_PAY";

    const jv = await tx.journalVoucher.create({
      data: {
        tenantId,
        branchId,
        date: data.date ? new Date(data.date) : new Date(),
        voucherType,
        referenceNumber: data.referenceNumber,
        notes: data.notes,
        status: "POSTED"
      }
    });

    // 2. Main Account Entry (Debit for Receipt, Credit for Payment)
    if (data.type === "RECEIPT" || data.type === "PAYMENT") {
      await tx.journalEntry.create({
        data: {
          voucherId: jv.id,
          accountId: data.mainAccountId,
          type: data.type === "RECEIPT" ? "DEBIT" : "CREDIT",
          amount: totalAmount,
          notes: data.notes
        }
      });
    }

    // 3. Offsetting Entries
    for (const entry of data.entries) {
      let entryType = "DEBIT";
      if (data.type === "RECEIPT") entryType = "CREDIT"; // If we receive cash, we credit the customer/AR
      if (data.type === "PAYMENT") entryType = "DEBIT"; // If we pay cash, we debit the supplier/AP/Expense

      // For JOURNAL type, we expect the frontend to pass exact Debit/Credit in the future.
      // For this simple version, we'll treat JOURNAL as needing explicit D/C, but here we simplify.

      await tx.journalEntry.create({
        data: {
          voucherId: jv.id,
          accountId: entry.accountId,
          type: entryType,
          amount: entry.amount,
          notes: entry.notes || data.notes,
          costCentreId: entry.costCentreId || null
        }
      });
    }

    return jv;
  });

  revalidatePath("/finance/vouchers");
  revalidatePath("/reports/customer-ledger");
  return { success: true, voucherId: result.id };
}
