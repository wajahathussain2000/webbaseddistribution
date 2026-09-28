import { prisma } from "@/lib/prisma";
import Link from "next/link";
import DemoAlertButton from "@/app/components/DemoAlertButton";

export default async function SettlementPage() {
  let settlements: any[] = [];
  try {
    settlements = await prisma.dayEndSettlement.findMany({
      include: {
        trip: {
          include: {
            vehicle: true
          }
        },
        deposits: true
      },
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
          <h1 className="text-2xl font-bold text-[#0F172A]">Day-End Settlement</h1>
          <p className="text-sm text-[#64748B] mt-1">Reconcile cash, cheques, and expenses at the end of each salesman route.</p>
        </div>
        <div className="flex gap-3">
          <DemoAlertButton message="Bank Deposits log is currently disabled in the demo environment." className="bg-white border border-[#E2E8F0] hover:bg-gray-50 text-[#0F172A] px-4 py-2 rounded-md text-sm font-semibold shadow-sm transition-all">
            Bank Deposits
          </DemoAlertButton>
          <DemoAlertButton message="Settlement Workflow requires active Van Sales. This feature is locked in the current demo." className="bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-700 hover:to-emerald-600 text-white px-4 py-2 rounded-md text-sm font-semibold shadow-md transition-all active:scale-[0.98]">
            + Start Settlement
          </DemoAlertButton>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm border-l-4 border-l-teal-500">
          <p className="text-sm font-medium text-[#64748B]">Cash Collected Today</p>
          <p className="text-2xl font-bold text-teal-700 mt-2">Rs 0</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm border-l-4 border-l-orange-500">
          <p className="text-sm font-medium text-[#64748B]">Pending Settlements</p>
          <p className="text-2xl font-bold text-orange-600 mt-2">
            {settlements.filter(s => s.status === 'DRAFT' || s.status === 'SUBMITTED').length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm border-l-4 border-l-red-500">
          <p className="text-sm font-medium text-[#64748B]">Total Shortages</p>
          <p className="text-2xl font-bold text-red-600 mt-2">
            Rs {settlements.reduce((sum, s) => sum + s.shortageAmount, 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-gradient-to-br from-indigo-900 to-slate-800 p-6 rounded-xl shadow-md text-white relative overflow-hidden">
          <div className="absolute right-[-20px] top-[-20px] opacity-10">
             <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          </div>
          <p className="text-sm font-medium text-indigo-200">Auto-Reconcile Engine</p>
          <button className="mt-3 text-xs font-bold bg-white text-indigo-900 px-3 py-1.5 rounded hover:bg-gray-100 transition-colors">
            Run Verification
          </button>
        </div>
      </div>

      <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-[#E2E8F0] flex gap-4 bg-gray-50/50 items-center justify-between">
          <h2 className="font-bold text-[#0F172A]">Settlement Register</h2>
          <select className="border border-[#E2E8F0] rounded-md px-3 py-1.5 text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-teal-500">
            <option>All Statuses</option>
            <option>Draft</option>
            <option>Submitted (Pending Approval)</option>
            <option>Approved</option>
            <option>Disputed / Shortage</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] uppercase tracking-wider text-xs">
              <tr>
                <th className="px-6 py-3 font-semibold">Date / Trip</th>
                <th className="px-6 py-3 font-semibold text-right">Expected (Sales)</th>
                <th className="px-6 py-3 font-semibold text-right">Cash In Hand</th>
                <th className="px-6 py-3 font-semibold text-right text-red-600">Expenses</th>
                <th className="px-6 py-3 font-semibold text-center">Variance</th>
                <th className="px-6 py-3 font-semibold text-center">Status</th>
                <th className="px-6 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {settlements.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-[#64748B]">
                    <div className="flex flex-col items-center justify-center">
                       <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                       <p>No day-end settlements processed yet.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                settlements.map(s => (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-bold text-[#0F172A]">{new Date(s.date).toLocaleDateString()}</div>
                      <div className="text-xs text-[#64748B]">
                        Trip: {s.trip?.tripNumber || 'Ad-hoc'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-[#0F172A]">
                      Rs {s.expectedCash.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right font-mono font-semibold text-teal-700">
                      Rs {s.actualCash.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-red-600">
                      Rs {s.expensesAmount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {s.shortageAmount > 0 ? (
                        <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-semibold">
                          Short: {s.shortageAmount}
                        </span>
                      ) : s.excessAmount > 0 ? (
                        <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs font-semibold">
                          Excess: {s.excessAmount}
                        </span>
                      ) : (
                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-semibold">
                          Matched
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold
                        ${s.status === 'APPROVED' ? 'bg-[#10B981]/10 text-[#10B981]' : 
                          s.status === 'SUBMITTED' ? 'bg-orange-100 text-orange-700' :
                          s.status === 'DISPUTED' ? 'bg-red-100 text-red-700' :
                          'bg-blue-100 text-blue-700'}`}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <button className="text-indigo-600 hover:text-indigo-800 font-medium">Review</button>
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
