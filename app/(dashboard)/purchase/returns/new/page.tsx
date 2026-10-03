import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import Link from "next/link";
import PurchaseReturnForm from "./PurchaseReturnForm";

export default async function NewPurchaseReturnPage() {
  const session = await auth();
  if (!session?.user?.id) return <div>Unauthorized</div>;

  const userTenant = await prisma.tenantUser.findFirst({
    where: { userId: session.user.id }
  });
  if (!userTenant) return <div>No tenant assigned</div>;

  const suppliers = await prisma.supplier.findMany({
    where: { tenantId: userTenant.tenantId },
    select: { id: true, name: true, code: true }
  });

  const warehouses = await prisma.warehouse.findMany({
    where: { tenantId: userTenant.tenantId },
    select: { id: true, name: true }
  });

  const products = await prisma.product.findMany({
    where: { tenantId: userTenant.tenantId, isActive: true },
    select: { id: true, code: true, nameEn: true }
  });

  const accounts = await prisma.account.findMany({
    where: { tenantId: userTenant.tenantId },
    select: { id: true, name: true, code: true, type: true }
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/purchase" className="text-[#64748B] hover:text-[#0F172A] transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Purchase Return / Debit Note</h1>
          <p className="text-sm text-[#64748B] mt-1">Record items returned to vendors.</p>
        </div>
      </div>

      <PurchaseReturnForm suppliers={suppliers} warehouses={warehouses} products={products} accounts={accounts} />
    </div>
  );
}
