import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function WarehousePage() {
  let pickingLists: any[] = [];
  
  try {
    pickingLists = await prisma.pickingList.findMany({
      orderBy: { date: 'desc' },
      take: 20
    });
  } catch (err) {
    console.error("Prisma error:", err);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Warehouse Operations</h1>
          <p className="text-sm text-[#64748B] mt-1">Manage picking lists, loading sheets, and gate passes.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-[#E2E8F0] hover:bg-gray-50 text-[#0F172A] px-4 py-2 rounded-md text-sm font-semibold shadow-sm transition-all">
            Loading Sheets
          </button>
          <button className="bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-700 hover:to-emerald-600 text-white px-4 py-2 rounded-md text-sm font-semibold shadow-md transition-all active:scale-[0.98]">
            Generate Gate Pass
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm border-l-4 border-l-orange-500">
          <p className="text-sm font-medium text-[#64748B]">Pending Picking Lists</p>
          <p className="text-2xl font-bold text-orange-600 mt-2">
            {pickingLists.filter(p => p.status === "PENDING").length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm border-l-4 border-l-blue-500">
          <p className="text-sm font-medium text-[#64748B]">Active Loading Sheets</p>
          <p className="text-2xl font-bold text-blue-600 mt-2">0</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm border-l-4 border-l-teal-500">
          <p className="text-sm font-medium text-[#64748B]">Gate Passes Today</p>
          <p className="text-2xl font-bold text-teal-700 mt-2">0</p>
        </div>
      </div>

      <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-[#E2E8F0] bg-gray-50/50">
          <h2 className="font-bold text-[#0F172A]">Recent Picking Lists</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] uppercase tracking-wider text-xs">
              <tr>
                <th className="px-6 py-3 font-semibold">List ID</th>
                <th className="px-6 py-3 font-semibold">Date</th>
                <th className="px-6 py-3 font-semibold">Invoice Ref</th>
                <th className="px-6 py-3 font-semibold">Assigned To</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {pickingLists.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-[#64748B]">
                    <p>No picking lists available.</p>
                    <p className="text-xs mt-1">Approve a Sales Order to generate a picking list.</p>
                  </td>
                </tr>
              ) : (
                pickingLists.map(list => (
                  <tr key={list.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-mono text-sm text-[#0F172A]">{list.id.split('-')[0]}</td>
                    <td className="px-6 py-4 text-[#64748B]">{new Date(list.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 font-medium text-teal-600">{list.invoiceId || 'N/A'}</td>
                    <td className="px-6 py-4 text-[#0F172A]">{list.assignedTo || 'Unassigned'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold
                        ${list.status === 'PENDING' ? 'bg-orange-100 text-orange-700' :
                          list.status === 'PICKING' ? 'bg-blue-100 text-blue-700' :
                          'bg-green-100 text-green-700'}`}
                      >
                        {list.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-teal-600 font-semibold hover:text-teal-800 text-sm">Print Barcode List</button>
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
