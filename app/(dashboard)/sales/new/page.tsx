import { prisma } from "@/lib/prisma";
import Link from "next/link";
import SalesOrderForm from "./SalesOrderForm";

export default async function NewSalesOrderPage() {
  // Fetch required data for dropdowns
  let customers: any[] = [];
  let products: any[] = [];

  try {
    // If no customers exist, we'll create a dummy one just so the form works in this demo
    customers = await prisma.customer.findMany();
    if (customers.length === 0) {
      let tenant = await prisma.tenant.findFirst();
      if (!tenant) {
        tenant = await prisma.tenant.create({ data: { name: "Default Company" } });
      }
      const dummyCustomer = await prisma.customer.create({
        data: { tenantId: tenant.id, name: "City Pharmacy" }
      });
      customers = [dummyCustomer];
    }

    products = await prisma.product.findMany({
      where: { isActive: true },
      select: { id: true, code: true, nameEn: true, cost: true, tradePrice: true, retailPrice: true, baseUomId: true }
    });
  } catch (err) {
    console.error(err);
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/sales" className="text-[#64748B] hover:text-[#0F172A] transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">New Sales Order</h1>
          <p className="text-sm text-[#64748B] mt-1">Book a new order from a customer.</p>
        </div>
      </div>

      <SalesOrderForm customers={customers} products={products} />
    </div>
  );
}
