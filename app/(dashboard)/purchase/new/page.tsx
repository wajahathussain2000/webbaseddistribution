import { prisma } from "@/lib/prisma";
import Link from "next/link";
import PurchaseOrderForm from "./PurchaseOrderForm";

export default async function NewPurchaseOrderPage() {
  // Fetch required data for dropdowns
  let suppliers: any[] = [];
  let products: any[] = [];

  try {
    // If no suppliers exist, we'll create a dummy one just so the form works in this demo
    suppliers = await prisma.supplier.findMany();
    if (suppliers.length === 0) {
      let tenant = await prisma.tenant.findFirst();
      if (!tenant) {
        tenant = await prisma.tenant.create({ data: { name: "Default Company" } });
      }
      const dummySupplier = await prisma.supplier.create({
        data: { tenantId: tenant.id, name: "GSK Pharmaceuticals" }
      });
      suppliers = [dummySupplier];
    }

    products = await prisma.product.findMany({
      where: { isActive: true },
      // @ts-ignore (Temporary until prisma generate runs successfully)
      select: { id: true, code: true, barcode: true, nameEn: true, cost: true, tradePrice: true, baseUomId: true }
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

      <PurchaseOrderForm suppliers={suppliers} products={products} />
    </div>
  );
}
