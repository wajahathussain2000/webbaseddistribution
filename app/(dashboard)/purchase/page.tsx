import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function PurchaseOrdersPage() {
  // Fetch recent purchase orders
  let purchaseOrders: any[] = [];
  try {
    purchaseOrders = await prisma.purchaseOrder.findMany({
      include: {
        supplier: true,
        branch: true,
      },
      orderBy: { date: 'desc' },
      take: 50,
    });
  } catch (err) {
    console.error("Prisma query failed. You may need to run npx prisma generate", err);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Purchase Orders</h1>
          <p className="text-sm text-[#64748B] mt-1">Manage and track orders sent to your suppliers.</p>
        </div>
        <Link href="/purchase/new" className="bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-700 hover:to-emerald-600 text-white px-4 py-2 rounded-md text-sm font-semibold shadow-md transition-all active:scale-[0.98]">
          + New Purchase Order
        </Link>
      </div>

      <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-[#E2E8F0] flex gap-4 bg-gray-50/50">
          <div className="flex-1 max-w-md relative">
            <input 
              type="text" 
              placeholder="Search by PO Number or Supplier..." 
              className="w-full pl-10 pr-4 py-2 border border-[#E2E8F0] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-[#0F172A]"
            />
            <div className="absolute left-3 top-2.5 text-[#64748B]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          <select className="border border-[#E2E8F0] rounded-md px-3 py-2 text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-teal-500">
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="PARTIAL">Partial GRN</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] uppercase tracking-wider text-xs">
              <tr>
                <th className="px-6 py-3 font-semibold">PO Number</th>
                <th className="px-6 py-3 font-semibold">Date</th>
                <th className="px-6 py-3 font-semibold">Supplier</th>
                <th className="px-6 py-3 font-semibold">Branch</th>
                <th className="px-6 py-3 font-semibold text-right">Total Amount</th>
                <th className="px-6 py-3 font-semibold text-center">Status</th>
                <th className="px-6 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {purchaseOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-[#64748B]">
                    <div className="flex flex-col items-center justify-center">
                      <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <p>No Purchase Orders found.</p>
                      <p className="text-xs mt-1">Create your first PO to start ordering stock.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                purchaseOrders.map((po) => (
                  <tr key={po.id} className="hover:bg-teal-50/50 transition-colors group">
                    <td className="px-6 py-4 font-mono font-medium text-teal-700">{po.poNumber}</td>
                    <td className="px-6 py-4 text-[#0F172A]">
                      {new Date(po.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 font-medium text-[#0F172A]">
                      {po.supplier?.name || '-'}
                    </td>
                    <td className="px-6 py-4 text-[#64748B]">{po.branch?.name || '-'}</td>
                    <td className="px-6 py-4 text-right font-mono font-medium text-[#0F172A]">
                      Rs {po.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold
                        ${po.status === 'COMPLETED' ? 'bg-[#10B981]/10 text-[#10B981]' : 
                          po.status === 'PENDING' ? 'bg-orange-100 text-orange-700' :
                          po.status === 'PARTIAL' ? 'bg-blue-100 text-blue-700' :
                          'bg-red-100 text-red-700'}`}
                      >
                        {po.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-teal-600 hover:text-teal-800 text-sm font-medium mr-3">View</button>
                      <button className="text-[#64748B] hover:text-[#0F172A] text-sm font-medium">Receive (GRN)</button>
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
