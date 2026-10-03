import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import Link from "next/link";
import InvoiceForm from "./InvoiceForm";

export default async function NewSalesInvoicePage() {
  const session = await auth();
  if (!session?.user?.id) return <div>Unauthorized</div>;

  const userTenant = await prisma.tenantUser.findFirst({
    where: { userId: session.user.id }
  });
  if (!userTenant) return <div>No tenant assigned</div>;

  // Fetch pending Sales Orders
  const pendingSOs = await prisma.salesOrder.findMany({
    where: { tenantId: userTenant.tenantId, status: "PENDING" },
    include: {
      items: {
        include: { product: true }
      },
      customer: true
    }
  });

  const warehouses = await prisma.warehouse.findMany({
    where: { tenantId: userTenant.tenantId },
    select: { id: true, name: true }
  });

  const accounts = await prisma.account.findMany({
    where: { tenantId: userTenant.tenantId, type: { in: ["ASSET"] } },
    select: { id: true, name: true, code: true }
  });

  const rawSettings = await prisma.systemSetting.findMany({
    where: { tenantId: userTenant.tenantId }
  });
  const settings = rawSettings.reduce((acc, curr) => ({ ...acc, [curr.key]: curr.value }), {} as Record<string, string>);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/sales" className="text-[#64748B] hover:text-[#0F172A] transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Sales Invoice / Delivery</h1>
          <p className="text-sm text-[#64748B] mt-1">Invoice and dispatch inventory against a Pending Sales Order.</p>
        </div>
      </div>

      <InvoiceForm pendingSOs={pendingSOs} warehouses={warehouses} accounts={accounts} settings={settings} />
    </div>
  );
}
