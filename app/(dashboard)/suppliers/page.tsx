import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function SuppliersPage() {
  let suppliers: any[] = [];
  try {
    suppliers = await prisma.supplier.findMany({
      include: {
        ledgers: { orderBy: { date: 'desc' }, take: 1 }
      },
      orderBy: { name: 'asc' },
      take: 50
    });
  } catch (err) {
    console.error("Prisma error:", err);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Suppliers & Vendors</h1>
          <p className="text-sm text-[#64748B] mt-1">Manage purchasing channels, payables, and service providers.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-[#E2E8F0] hover:bg-gray-50 text-[#0F172A] px-4 py-2 rounded-md text-sm font-semibold shadow-sm transition-all">
            + New Vendor (Service)
          </button>
          <button className="bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-700 hover:to-emerald-600 text-white px-4 py-2 rounded-md text-sm font-semibold shadow-md transition-all active:scale-[0.98]">
            + Add Supplier
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm">
          <p className="text-sm font-medium text-[#64748B]">Active Suppliers</p>
          <p className="text-2xl font-bold text-[#0F172A] mt-2">{suppliers.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm border-l-4 border-l-red-500">
          <p className="text-sm font-medium text-[#64748B]">Total Payables (Due)</p>
          <p className="text-2xl font-bold text-red-600 mt-2">
            Rs {suppliers.reduce((sum, s) => sum + (s.ledgers[0]?.balance || 0), 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm border-l-4 border-l-orange-500">
          <p className="text-sm font-medium text-[#64748B]">Overdue Invoices</p>
          <p className="text-2xl font-bold text-orange-600 mt-2">0</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm border-l-4 border-l-teal-500">
          <p className="text-sm font-medium text-[#64748B]">Vendor Bills</p>
          <p className="text-2xl font-bold text-teal-700 mt-2">0</p>
        </div>
      </div>

      <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden flex flex-col">
        {/* Tabs */}
        <div className="flex border-b border-[#E2E8F0] bg-gray-50/50">
          <button className="px-6 py-3 text-sm font-bold text-teal-700 border-b-2 border-teal-500">
            Suppliers (Goods)
          </button>
          <button className="px-6 py-3 text-sm font-semibold text-[#64748B] hover:text-[#0F172A]">
            Vendors (Services)
          </button>
          <button className="px-6 py-3 text-sm font-semibold text-[#64748B] hover:text-[#0F172A]">
            Principals (Manufacturers)
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] uppercase tracking-wider text-xs">
              <tr>
                <th className="px-6 py-3 font-semibold">Supplier Name</th>
                <th className="px-6 py-3 font-semibold">Contact & Phone</th>
                <th className="px-6 py-3 font-semibold text-center">Payment Terms</th>
                <th className="px-6 py-3 font-semibold text-right">Current Balance</th>
                <th className="px-6 py-3 font-semibold text-center">Status</th>
                <th className="px-6 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {suppliers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-[#64748B]">
                    <p>No suppliers found.</p>
                  </td>
                </tr>
              ) : (
                suppliers.map(supplier => (
                  <tr key={supplier.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-[#0F172A]">{supplier.name}</div>
                      <div className="text-xs text-[#64748B]">Tax: {supplier.taxNumber || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-[#0F172A]">{supplier.contact || 'No Contact Person'}</div>
                      <div className="text-xs text-[#64748B]">{supplier.phone || supplier.email || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-semibold">
                        {supplier.paymentTermsDays} Days
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-mono font-bold text-red-600">
                      Rs {(supplier.ledgers[0]?.balance || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold
                        ${supplier.status === 'ACTIVE' ? 'bg-[#10B981]/10 text-[#10B981]' : 
                          'bg-red-100 text-red-700'}`}
                      >
                        {supplier.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <button className="text-indigo-600 hover:text-indigo-800 font-medium">Ledger</button>
                      <button className="text-teal-600 hover:text-teal-800 font-medium">Edit</button>
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
