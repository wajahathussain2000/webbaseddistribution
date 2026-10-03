import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import Link from "next/link";
import PosInterface from "./PosInterface";

export default async function POSPage() {
  const session = await auth();
  if (!session?.user?.id) return <div>Unauthorized</div>;

  const userTenant = await prisma.tenantUser.findFirst({
    where: { userId: session.user.id }
  });
  if (!userTenant) return <div>No tenant assigned</div>;

  const products = await prisma.product.findMany({
    where: { tenantId: userTenant.tenantId, isActive: true },
    select: { id: true, nameEn: true, code: true, retailPrice: true, imageUrl: true, category: { select: { name: true } } },
    take: 100 // Limit for MVP, ideally should be paginated/searchable
  });

  const warehouses = await prisma.warehouse.findMany({
    where: { tenantId: userTenant.tenantId },
    select: { id: true, name: true }
  });

  const accounts = await prisma.account.findMany({
    where: { tenantId: userTenant.tenantId, type: "ASSET" },
    select: { id: true, name: true, code: true }
  });

  const rawSettings = await prisma.systemSetting.findMany({
    where: { tenantId: userTenant.tenantId }
  });
  const settings = rawSettings.reduce((acc, curr) => ({ ...acc, [curr.key]: curr.value }), {} as Record<string, string>);

  return (
    <div className="h-[calc(100vh-4rem)] -m-6 flex flex-col bg-slate-100">
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-slate-500 hover:text-slate-800">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <h1 className="text-xl font-bold text-slate-800">Retail POS Terminal</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-500"></div> Online
          </div>
        </div>
      </div>

      <PosInterface products={products} warehouses={warehouses} accounts={accounts} settings={settings} />
    </div>
  );
}
