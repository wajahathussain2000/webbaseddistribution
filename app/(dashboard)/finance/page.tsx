import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function FinancePage() {
  let vouchers: any[] = [];
  let accounts: any[] = [];
  try {
    vouchers = await prisma.journalVoucher.findMany({
      include: {
        entries: {
          include: {
            account: true
          }
        }
      },
      orderBy: { date: 'desc' },
      take: 20
    });
    
    accounts = await prisma.account.findMany({
      where: { parentId: null },
      include: { children: true }
    });
  } catch (err) {
    console.error("Prisma error:", err);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Accounting & Ledgers</h1>
          <p className="text-sm text-[#64748B] mt-1">Manage Chart of Accounts, Journal Vouchers, and Financial Periods.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-[#E2E8F0] hover:bg-gray-50 text-[#0F172A] px-4 py-2 rounded-md text-sm font-semibold shadow-sm transition-all">
            Chart of Accounts
          </button>
          <button className="bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-700 hover:to-emerald-600 text-white px-4 py-2 rounded-md text-sm font-semibold shadow-md transition-all active:scale-[0.98]">
            + Create Voucher
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm border-l-4 border-l-teal-500">
          <p className="text-sm font-medium text-[#64748B]">Active Accounts</p>
          <p className="text-2xl font-bold text-[#0F172A] mt-2">
            {accounts.length} Main
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm border-l-4 border-l-blue-500">
          <p className="text-sm font-medium text-[#64748B]">Cash Book Balance</p>
          <p className="text-2xl font-bold text-blue-700 mt-2">Rs 0</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm border-l-4 border-l-purple-500">
          <p className="text-sm font-medium text-[#64748B]">Bank Balance</p>
          <p className="text-2xl font-bold text-purple-700 mt-2">Rs 0</p>
        </div>
        <div className="bg-gradient-to-br from-indigo-900 to-slate-800 p-6 rounded-xl shadow-md text-white relative overflow-hidden">
          <div className="absolute right-[-20px] top-[-20px] opacity-10">
             <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor"><path d="M3 3v18h18M9 9l3-3 3 3 6-6M9 9v12M15 6v15M21 3v18"/></svg>
          </div>
          <p className="text-sm font-medium text-indigo-200">Financial Reports</p>
          <button className="mt-3 text-xs font-bold bg-white text-indigo-900 px-3 py-1.5 rounded hover:bg-gray-100 transition-colors">
            View P&L Statement
          </button>
        </div>
      </div>

      <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-[#E2E8F0] flex gap-4 bg-gray-50/50 items-center justify-between">
          <h2 className="font-bold text-[#0F172A]">Recent Vouchers (Auto-Posted)</h2>
          <select className="border border-[#E2E8F0] rounded-md px-3 py-1.5 text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-teal-500">
            <option>All Types</option>
            <option>Cash Payment (CPV)</option>
            <option>Cash Receipt (CRV)</option>
            <option>Bank Payment (BPV)</option>
            <option>Journal (JV)</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] uppercase tracking-wider text-xs">
              <tr>
                <th className="px-6 py-3 font-semibold">Date</th>
                <th className="px-6 py-3 font-semibold">Type & Ref</th>
                <th className="px-6 py-3 font-semibold text-center">DR / CR Accounts</th>
                <th className="px-6 py-3 font-semibold text-right">Amount</th>
                <th className="px-6 py-3 font-semibold text-center">Status</th>
                <th className="px-6 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {vouchers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-[#64748B]">
                    <div className="flex flex-col items-center justify-center">
                       <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                       <p>No journal vouchers recorded yet.</p>
                       <p className="text-xs mt-1">Sales, purchases, and day-end settlements will automatically post here.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                vouchers.map(v => {
                  const debitEntries = v.entries.filter((e: any) => e.type === 'DEBIT');
                  const totalDebit = debitEntries.reduce((sum: number, e: any) => sum + e.amount, 0);
                  
                  return (
                    <tr key={v.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-medium text-[#0F172A]">{new Date(v.date).toLocaleDateString()}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-[#0F172A]">{v.voucherType}</div>
                        <div className="text-xs text-[#64748B]">Ref: {v.referenceNumber || '-'}</div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="text-xs font-mono text-[#64748B]">
                          {v.entries.length} entries
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right font-mono font-bold text-[#0F172A]">
                        Rs {totalDebit.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold
                          ${v.status === 'POSTED' ? 'bg-[#10B981]/10 text-[#10B981]' : 
                            v.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                            'bg-orange-100 text-orange-700'}`}
                        >
                          {v.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-3">
                        <button className="text-indigo-600 hover:text-indigo-800 font-medium">View GL</button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
