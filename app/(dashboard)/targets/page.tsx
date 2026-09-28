import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function TargetsPage() {
  let targets: any[] = [];
  try {
    targets = await prisma.salesTarget.findMany({
      include: {
        employee: true
      },
      orderBy: { month: 'desc' },
      take: 20
    });
  } catch (err) {
    console.error("Prisma error:", err);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Targets & Commission</h1>
          <p className="text-sm text-[#64748B] mt-1">Set sales goals, configure commission rules, and process incentives.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-[#E2E8F0] hover:bg-gray-50 text-[#0F172A] px-4 py-2 rounded-md text-sm font-semibold shadow-sm transition-all">
            Commission Rules
          </button>
          <button className="bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-700 hover:to-emerald-600 text-white px-4 py-2 rounded-md text-sm font-semibold shadow-md transition-all active:scale-[0.98]">
            + Assign Target
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm border-l-4 border-l-blue-500">
          <p className="text-sm font-medium text-[#64748B]">Active Targets</p>
          <p className="text-2xl font-bold text-[#0F172A] mt-2">
            {targets.filter(t => t.status === 'ACTIVE').length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm border-l-4 border-l-teal-500">
          <p className="text-sm font-medium text-[#64748B]">Achieved Value</p>
          <p className="text-2xl font-bold text-teal-700 mt-2">
            Rs {targets.reduce((sum, t) => sum + t.achievedValue, 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm border-l-4 border-l-orange-500">
          <p className="text-sm font-medium text-[#64748B]">Expected Payout</p>
          <p className="text-2xl font-bold text-orange-600 mt-2">Rs 0</p>
        </div>
        <div className="bg-gradient-to-br from-indigo-900 to-slate-800 p-6 rounded-xl shadow-md text-white relative overflow-hidden">
          <div className="absolute right-[-20px] top-[-20px] opacity-10">
             <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          </div>
          <p className="text-sm font-medium text-indigo-200">What-If Simulator</p>
          <button className="mt-3 text-xs font-bold bg-white text-indigo-900 px-3 py-1.5 rounded hover:bg-gray-100 transition-colors">
            Calculate Expected
          </button>
        </div>
      </div>

      <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-[#E2E8F0] flex gap-4 bg-gray-50/50 items-center justify-between">
          <h2 className="font-bold text-[#0F172A]">Sales Team Targets</h2>
          <select className="border border-[#E2E8F0] rounded-md px-3 py-1.5 text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-teal-500">
            <option>Current Month</option>
            <option>Previous Month</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] uppercase tracking-wider text-xs">
              <tr>
                <th className="px-6 py-3 font-semibold">Salesman</th>
                <th className="px-6 py-3 font-semibold">Target Type</th>
                <th className="px-6 py-3 font-semibold text-right">Target Value</th>
                <th className="px-6 py-3 font-semibold text-right">Achieved</th>
                <th className="px-6 py-3 font-semibold text-center">Progress</th>
                <th className="px-6 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {targets.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-[#64748B]">
                    <div className="flex flex-col items-center justify-center">
                       <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                       <p>No targets assigned for this period.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                targets.map(t => {
                  const percent = t.targetValue > 0 ? (t.achievedValue / t.targetValue) * 100 : 0;
                  return (
                    <tr key={t.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-bold text-[#0F172A]">{t.employee?.name || 'Unknown'}</div>
                        <div className="text-xs text-[#64748B]">Month: {t.month}/{t.year}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-semibold">
                          {t.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-mono text-[#0F172A]">
                        Rs {t.targetValue.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-right font-mono font-semibold text-teal-700">
                        Rs {t.achievedValue.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className={`h-2.5 rounded-full ${percent >= 100 ? 'bg-teal-500' : 'bg-blue-500'}`} style={{ width: `${Math.min(percent, 100)}%` }}></div>
                        </div>
                        <div className="text-xs text-center mt-1 text-[#64748B]">{percent.toFixed(1)}%</div>
                      </td>
                      <td className="px-6 py-4 text-right space-x-3">
                        <button className="text-teal-600 hover:text-teal-800 font-medium">Edit</button>
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
