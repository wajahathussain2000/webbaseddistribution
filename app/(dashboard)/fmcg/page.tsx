import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function FmcgPage() {
  let audits: any[] = [];
  let displaySchemes: any[] = [];
  let focusProducts: any[] = [];
  
  try {
    audits = await prisma.retailAudit.findMany({
      include: { customer: true, employee: true },
      orderBy: { date: 'desc' },
      take: 10
    });
    displaySchemes = await prisma.displayRentalScheme.findMany({
      include: { customer: true },
      where: { status: 'ACTIVE' }
    });
    focusProducts = await prisma.product.findMany({
      where: { isFocusSku: true },
      select: { nameEn: true, code: true }
    });
  } catch (err) {
    console.error("Prisma error:", err);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">FMCG Trade Marketing</h1>
          <p className="text-sm text-[#64748B] mt-1">Manage Retail Audits, Planograms, Focus SKUs, and Display Rentals.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-[#E2E8F0] hover:bg-gray-50 text-[#0F172A] px-4 py-2 rounded-md text-sm font-semibold shadow-sm transition-all">
            Manage Focus SKUs
          </button>
          <button className="bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-700 hover:to-emerald-600 text-white px-4 py-2 rounded-md text-sm font-semibold shadow-md transition-all active:scale-[0.98]">
            + Retail Audit
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm border-l-4 border-l-blue-500">
          <p className="text-sm font-medium text-[#64748B]">Focus SKUs</p>
          <p className="text-2xl font-bold text-[#0F172A] mt-2">
            {focusProducts.length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm border-l-4 border-l-teal-500">
          <p className="text-sm font-medium text-[#64748B]">Active Display Rentals</p>
          <p className="text-2xl font-bold text-teal-700 mt-2">
            {displaySchemes.length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm border-l-4 border-l-orange-500">
          <p className="text-sm font-medium text-[#64748B]">Lines Per Call (MTD)</p>
          <p className="text-2xl font-bold text-orange-600 mt-2">0.0</p>
          <p className="text-xs text-[#64748B] mt-1">Average items per order</p>
        </div>
        <div className="bg-gradient-to-br from-indigo-900 to-slate-800 p-6 rounded-xl shadow-md text-white relative overflow-hidden">
          <div className="absolute right-[-20px] top-[-20px] opacity-10">
             <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          </div>
          <p className="text-sm font-medium text-indigo-200">Planogram Audit AI</p>
          <button className="mt-3 text-xs font-bold bg-white text-indigo-900 px-3 py-1.5 rounded hover:bg-gray-100 transition-colors">
            Scan Shelf Photos
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Retail Audits */}
        <div className="col-span-1 lg:col-span-2 bg-white border border-[#E2E8F0] rounded-xl shadow-sm flex flex-col overflow-hidden">
          <div className="p-4 border-b border-[#E2E8F0] flex gap-4 bg-gray-50/50 items-center justify-between">
            <h2 className="font-bold text-[#0F172A]">Recent Retail Audits</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] uppercase tracking-wider text-xs">
                <tr>
                  <th className="px-6 py-3 font-semibold">Date & Shop</th>
                  <th className="px-6 py-3 font-semibold">Salesman</th>
                  <th className="px-6 py-3 font-semibold text-center">Shelf Share %</th>
                  <th className="px-6 py-3 font-semibold text-center">Planogram</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {audits.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-[#64748B]">
                      <p>No retail audits performed recently.</p>
                    </td>
                  </tr>
                ) : (
                  audits.map(audit => (
                    <tr key={audit.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-bold text-[#0F172A]">{audit.customer?.name || 'Unknown'}</div>
                        <div className="text-xs text-[#64748B]">{new Date(audit.date).toLocaleDateString()}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-[#0F172A]">{audit.employee?.name || 'Unknown'}</div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="font-mono font-bold text-teal-700">
                          {audit.shelfSharePercent ? `${audit.shelfSharePercent}%` : '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {audit.planogramScore ? (
                          <div className="w-full bg-gray-200 rounded-full h-2.5 max-w-[100px] mx-auto">
                            <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${audit.planogramScore}%` }}></div>
                          </div>
                        ) : '-'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Col: Focus SKUs & Display Rentals */}
        <div className="col-span-1 space-y-6">
          <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-[#E2E8F0] bg-gray-50/50">
              <h2 className="font-bold text-[#0F172A]">Display Rental Schemes</h2>
            </div>
            <div className="p-4">
              {displaySchemes.length === 0 ? (
                 <p className="text-sm text-[#64748B] text-center py-4">No active rentals.</p>
              ) : (
                <ul className="space-y-4">
                  {displaySchemes.map(ds => (
                    <li key={ds.id} className="flex justify-between items-center text-sm border-b pb-2">
                      <div>
                        <p className="font-semibold text-[#0F172A]">{ds.customer?.name || 'Unknown'}</p>
                        <p className="text-xs text-[#64748B]">Till: {new Date(ds.endDate).toLocaleDateString()}</p>
                      </div>
                      <span className="font-mono font-bold text-teal-700">Rs {ds.amount}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
