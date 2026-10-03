import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import Link from "next/link";
import VoucherForm from "./VoucherForm";

export default async function NewVoucherPage() {
  const session = await auth();
  if (!session?.user?.id) return <div>Unauthorized</div>;

  const userTenant = await prisma.tenantUser.findFirst({
    where: { userId: session.user.id }
  });
  if (!userTenant) return <div>No tenant assigned</div>;

  const accounts = await prisma.account.findMany({
    where: { tenantId: userTenant.tenantId },
    select: { id: true, name: true, code: true, type: true }
  });

  const customers = await prisma.customer.findMany({
    where: { tenantId: userTenant.tenantId },
    select: { id: true, name: true, code: true }
  });

  const suppliers = await prisma.supplier.findMany({
    where: { tenantId: userTenant.tenantId },
    select: { id: true, name: true, code: true }
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/finance/vouchers" className="text-[#64748B] hover:text-[#0F172A] transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Create Voucher</h1>
          <p className="text-sm text-[#64748B] mt-1">Record manual payments and receipts.</p>
        </div>
      </div>

      <VoucherForm accounts={accounts} customers={customers} suppliers={suppliers} />
    </div>
  );
}
