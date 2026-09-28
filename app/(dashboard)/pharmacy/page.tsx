import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function PharmacyPage() {
  let controlledDrugs: any[] = [];
  let recalls: any[] = [];
  try {
    controlledDrugs = await prisma.controlledDrugRegister.findMany({
      include: { product: true },
      orderBy: { date: 'desc' },
      take: 10
    });
    recalls = await prisma.batchRecall.findMany({
      include: { product: true },
      orderBy: { recallDate: 'desc' }
    });
  } catch (err) {
    console.error("Prisma error:", err);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Pharmacy Tools</h1>
          <p className="text-sm text-[#64748B] mt-1">Manage controlled registers, FEFO rules, prescriptions, and cold-chain alerts.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-[#E2E8F0] hover:bg-gray-50 text-[#0F172A] px-4 py-2 rounded-md text-sm font-semibold shadow-sm transition-all">
            Controlled Drugs Register
          </button>
          <button className="bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-700 hover:to-emerald-600 text-white px-4 py-2 rounded-md text-sm font-semibold shadow-md transition-all active:scale-[0.98]">
            + Initiate Batch Recall
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm border-l-4 border-l-red-500">
          <p className="text-sm font-medium text-[#64748B]">Active Batch Recalls</p>
          <p className="text-2xl font-bold text-red-600 mt-2">
            {recalls.filter(r => r.status !== 'RETURNED_TO_COMPANY').length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm border-l-4 border-l-orange-500">
          <p className="text-sm font-medium text-[#64748B]">Near-Expiry Alerts</p>
          <p className="text-2xl font-bold text-orange-600 mt-2">0</p>
          <p className="text-xs text-[#64748B] mt-1">Expiring within 90 days</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm border-l-4 border-l-blue-500">
          <p className="text-sm font-medium text-[#64748B]">Prescription Items Sold</p>
          <p className="text-2xl font-bold text-blue-700 mt-2">0</p>
          <p className="text-xs text-[#64748B] mt-1">Today</p>
        </div>
        <div className="bg-gradient-to-br from-indigo-900 to-slate-800 p-6 rounded-xl shadow-md text-white relative overflow-hidden">
          <div className="absolute right-[-20px] top-[-20px] opacity-10">
             <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor"><path d="M11 2v20c-5.523 0-10-4.477-10-10S5.477 2 11 2zm2 0v20c5.523 0 10-4.477 10-10S18.523 2 13 2z"/></svg>
          </div>
          <p className="text-sm font-medium text-indigo-200">Cold Chain IoT</p>
          <div className="flex gap-4 mt-2">
            <div>
               <p className="text-xs text-indigo-300">Fridge A</p>
               <p className="font-bold text-green-400">4.2°C</p>
            </div>
            <div>
               <p className="text-xs text-indigo-300">Fridge B</p>
               <p className="font-bold text-green-400">5.1°C</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-[#E2E8F0] flex gap-4 bg-gray-50/50 items-center justify-between">
          <h2 className="font-bold text-[#0F172A]">Batch Recall Tracker</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] uppercase tracking-wider text-xs">
              <tr>
                <th className="px-6 py-3 font-semibold">Date</th>
                <th className="px-6 py-3 font-semibold">Product & Generic</th>
                <th className="px-6 py-3 font-semibold text-center">Batch No.</th>
                <th className="px-6 py-3 font-semibold">Reason</th>
                <th className="px-6 py-3 font-semibold text-center">Status</th>
                <th className="px-6 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {recalls.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-[#64748B]">
                    <div className="flex flex-col items-center justify-center">
                       <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                       <p>No batch recalls active.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                recalls.map(r => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-[#0F172A]">{new Date(r.recallDate).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-[#0F172A]">{r.product?.nameEn || 'Unknown'}</div>
                      <div className="text-xs text-[#64748B]">{r.product?.genericName || '-'}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="bg-red-50 text-red-700 px-2 py-1 rounded text-xs font-mono font-bold border border-red-200">
                        {r.batchNumber}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-[#0F172A]">
                      {r.reason}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold
                        ${r.status === 'RETURNED_TO_COMPANY' ? 'bg-[#10B981]/10 text-[#10B981]' : 
                          r.status === 'INITIATED' ? 'bg-red-100 text-red-700' :
                          'bg-orange-100 text-orange-700'}`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <button className="text-indigo-600 hover:text-indigo-800 font-medium">Trace Customers</button>
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
