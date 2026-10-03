import { prisma } from "@/lib/prisma";
import Link from "next/link";
import PurchaseOrderForm from "./PurchaseOrderForm";
import { auth } from "@/auth";

export default async function NewPurchaseOrderPage() {
  // Fetch required data for dropdowns
  let suppliers: any[] = [];
  let products: any[] = [];
  let accounts: any[] = [];

  try {
    const session = await auth();
    if (!session?.user?.id) return <div>Unauthorized</div>;

    const userTenant = await prisma.tenantUser.findFirst({
      where: { userId: session.user.id }
    });
    if (!userTenant) return <div>No tenant assigned</div>;

    suppliers = await prisma.supplier.findMany({ where: { tenantId: userTenant.tenantId } });

    products = await prisma.product.findMany({
      where: { tenantId: userTenant.tenantId, isActive: true },
      // @ts-ignore
      select: { id: true, code: true, barcode: true, nameEn: true, cost: true, tradePrice: true, baseUomId: true }
    });

    accounts = await prisma.account.findMany({
      where: { tenantId: userTenant.tenantId, type: { in: ["ASSET", "LIABILITY"] } },
      select: { id: true, name: true, code: true, type: true }
    });
  } catch (err) {
    console.error(err);
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/purchase" className="text-[#64748B] hover:text-[#0F172A] transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Create Purchase Order</h1>
          <p className="text-sm text-[#64748B] mt-1">Draft a new order to send to your supplier.</p>
        </div>
      </div>

      <PurchaseOrderForm suppliers={suppliers} products={products} accounts={accounts} />
    </div>
  );
}
