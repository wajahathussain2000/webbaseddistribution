import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { auth } from "@/auth";

export default async function InventoryPage() {
  // Fetch warehouses
  let warehouses: any[] = [];
  let balances: any[] = [];
  
  try {
    const session = await auth();
    if (!session?.user?.id) return <div>Unauthorized</div>;

    const userTenant = await prisma.tenantUser.findFirst({
      where: { userId: session.user.id }
    });
    if (!userTenant) return <div>No tenant assigned</div>;

    warehouses = await prisma.warehouse.findMany({ where: { tenantId: userTenant.tenantId } });

    balances = await prisma.stockBalance.findMany({
      where: { warehouse: { tenantId: userTenant.tenantId } },
      include: {
        product: true,
        warehouse: true,
        batch: true
      },
      take: 50
    });
  } catch (err) {
    console.error("Prisma error, likely needs generate:", err);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Inventory & Stock</h1>
          <p className="text-sm text-[#64748B] mt-1">Real-time tracking of batches, expiry dates, and warehouse balances.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-[#E2E8F0] hover:bg-gray-50 text-[#0F172A] px-4 py-2 rounded-md text-sm font-semibold shadow-sm transition-all">
            Stock Transfer
          </button>
          <button className="bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-700 hover:to-emerald-600 text-white px-4 py-2 rounded-md text-sm font-semibold shadow-md transition-all active:scale-[0.98]">
            + Stock Adjustment
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* KPI Cards */}
        <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm">
          <p className="text-sm font-medium text-[#64748B]">Total Items in Stock</p>
          <p className="text-2xl font-bold text-[#0F172A] mt-2">
            {balances.reduce((sum, b) => sum + b.qtyAvailable, 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm border-l-4 border-l-teal-500">
          <p className="text-sm font-medium text-[#64748B]">Reserved for Orders</p>
          <p className="text-2xl font-bold text-teal-700 mt-2">
            {balances.reduce((sum, b) => sum + b.qtyReserved, 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm border-l-4 border-l-orange-500">
          <p className="text-sm font-medium text-[#64748B]">Low Stock Alerts</p>
          <p className="text-2xl font-bold text-orange-600 mt-2">0</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm border-l-4 border-l-red-500">
          <p className="text-sm font-medium text-[#64748B]">Near Expiry (30 Days)</p>
          <p className="text-2xl font-bold text-red-600 mt-2">0</p>
        </div>
      </div>

      <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-[#E2E8F0] flex gap-4 bg-gray-50/50">
          <div className="flex-1 max-w-md relative">
            <input 
              type="text" 
              placeholder="Search product, batch, or SKU..." 
              className="w-full pl-10 pr-4 py-2 border border-[#E2E8F0] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-[#0F172A]"
            />
            <div className="absolute left-3 top-2.5 text-[#64748B]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          <select className="border border-[#E2E8F0] rounded-md px-3 py-2 text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-teal-500">
            <option value="">All Warehouses</option>
            {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
          </select>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] uppercase tracking-wider text-xs">
              <tr>
                <th className="px-6 py-3 font-semibold">Product</th>
                <th className="px-6 py-3 font-semibold">SKU</th>
                <th className="px-6 py-3 font-semibold">Warehouse</th>
                <th className="px-6 py-3 font-semibold">Batch / Expiry</th>
                <th className="px-6 py-3 font-semibold text-right">Available Qty</th>
                <th className="px-6 py-3 font-semibold text-right">Reserved Qty</th>
                <th className="px-6 py-3 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {balances.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-[#64748B]">
                    <div className="flex flex-col items-center justify-center">
                      <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                      <p>No stock balances found.</p>
                      <p className="text-xs mt-1">Receive a Purchase Order (GRN) to populate inventory.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                balances.map((balance) => (
                  <tr key={balance.id} className="hover:bg-teal-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-[#0F172A]">{balance.product?.nameEn || '-'}</td>
                    <td className="px-6 py-4 font-mono text-sm text-[#64748B]">{balance.product?.code || '-'}</td>
                    <td className="px-6 py-4 text-[#0F172A]">{balance.warehouse?.name || '-'}</td>
                    <td className="px-6 py-4">
                      {balance.batch ? (
                        <div>
                          <div className="font-mono font-medium text-[#0F172A]">{balance.batch.batchNumber}</div>
                          <div className="text-xs text-[#64748B]">
                            Exp: {balance.batch.expiryDate ? new Date(balance.batch.expiryDate).toLocaleDateString() : 'N/A'}
                          </div>
                        </div>
                      ) : (
                        <span className="text-[#64748B] italic">No Batch</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right font-mono font-bold text-teal-700">
                      {balance.qtyAvailable}
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-orange-600">
                      {balance.qtyReserved}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#10B981]/10 text-[#10B981]">
                        In Stock
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
