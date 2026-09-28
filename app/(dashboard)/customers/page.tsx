import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function CustomersPage() {
  let customers: any[] = [];
  try {
    customers = await prisma.customer.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50
    });
  } catch (err) {
    console.error("Prisma error:", err);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Customer Management</h1>
          <p className="text-sm text-[#64748B] mt-1">Manage retailers, pharmacies, hospitals, and view their ledgers.</p>
        </div>
        <button className="bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-700 hover:to-emerald-600 text-white px-4 py-2 rounded-md text-sm font-semibold shadow-md transition-all active:scale-[0.98]">
          + Add Customer
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm">
          <p className="text-sm font-medium text-[#64748B]">Total Customers</p>
          <p className="text-2xl font-bold text-[#0F172A] mt-2">{customers.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm border-l-4 border-l-teal-500">
          <p className="text-sm font-medium text-[#64748B]">Pharmacies</p>
          <p className="text-2xl font-bold text-teal-700 mt-2">
            {customers.filter(c => c.category === 'PHARMACY').length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm border-l-4 border-l-orange-500">
          <p className="text-sm font-medium text-[#64748B]">Blocked / Dormant</p>
          <p className="text-2xl font-bold text-orange-600 mt-2">
            {customers.filter(c => c.status !== 'ACTIVE').length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm border-l-4 border-l-red-500">
          <p className="text-sm font-medium text-[#64748B]">Expiring Licences</p>
          <p className="text-2xl font-bold text-red-600 mt-2">0</p>
        </div>
      </div>

      <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-[#E2E8F0] flex gap-4 bg-gray-50/50">
          <div className="flex-1 max-w-md relative">
            <input 
              type="text" 
              placeholder="Search by name, phone, or route..." 
              className="w-full pl-10 pr-4 py-2 border border-[#E2E8F0] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-[#0F172A]"
            />
            <div className="absolute left-3 top-2.5 text-[#64748B]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
          </div>
          <select className="border border-[#E2E8F0] rounded-md px-3 py-2 text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-teal-500">
            <option value="">All Categories</option>
            <option value="RETAILER">Retailer</option>
            <option value="PHARMACY">Pharmacy</option>
            <option value="HOSPITAL">Hospital</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] uppercase tracking-wider text-xs">
              <tr>
                <th className="px-6 py-3 font-semibold">Customer / Shop</th>
                <th className="px-6 py-3 font-semibold">Category</th>
                <th className="px-6 py-3 font-semibold">Contact & Area</th>
                <th className="px-6 py-3 font-semibold text-right">Credit Limit</th>
                <th className="px-6 py-3 font-semibold text-center">Status</th>
                <th className="px-6 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {customers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-[#64748B]">
                    <p>No customers found.</p>
                  </td>
                </tr>
              ) : (
                customers.map(customer => (
                  <tr key={customer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-[#0F172A]">{customer.name}</div>
                      <div className="text-xs text-[#64748B]">{customer.shopName || customer.code}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-semibold">
                        {customer.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-[#0F172A]">{customer.phone || 'N/A'}</div>
                      <div className="text-xs text-[#64748B]">{customer.area || customer.route || 'No Area Assigned'}</div>
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-[#0F172A]">
                      Rs {customer.creditLimit.toLocaleString()} <br/>
                      <span className="text-xs text-[#64748B]">{customer.creditDays} Days</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold
                        ${customer.status === 'ACTIVE' ? 'bg-[#10B981]/10 text-[#10B981]' : 
                          'bg-red-100 text-red-700'}`}
                      >
                        {customer.status}
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
