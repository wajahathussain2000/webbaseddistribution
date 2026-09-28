import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function EnterprisePage() {
  let branches: any[] = [];
  let subDistributors: any[] = [];
  
  try {
    branches = await prisma.branch.findMany({
      orderBy: { name: 'asc' }
    });
    subDistributors = await prisma.subDistributor.findMany({
      orderBy: { name: 'asc' }
    });
  } catch (err) {
    console.error("Prisma error:", err);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Enterprise & Multi-Branch</h1>
          <p className="text-sm text-[#64748B] mt-1">Manage global head-office controls, branches, and sub-distributors.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-[#E2E8F0] hover:bg-gray-50 text-[#0F172A] px-4 py-2 rounded-md text-sm font-semibold shadow-sm transition-all">
            Consolidated Reports
          </button>
          <button className="bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-700 hover:to-emerald-600 text-white px-4 py-2 rounded-md text-sm font-semibold shadow-md transition-all active:scale-[0.98]">
            + Add Branch / Entity
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm border-l-4 border-l-blue-500">
          <p className="text-sm font-medium text-[#64748B]">Active Branches</p>
          <p className="text-2xl font-bold text-[#0F172A] mt-2">
            {branches.length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm border-l-4 border-l-purple-500">
          <p className="text-sm font-medium text-[#64748B]">Sub-Distributors</p>
          <p className="text-2xl font-bold text-[#0F172A] mt-2">
            {subDistributors.length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm border-l-4 border-l-orange-500">
          <p className="text-sm font-medium text-[#64748B]">Inter-Branch Transfers</p>
          <p className="text-2xl font-bold text-orange-600 mt-2">0</p>
          <p className="text-xs text-[#64748B] mt-1">Pending receipt</p>
        </div>
        <div className="bg-gradient-to-br from-indigo-900 to-slate-800 p-6 rounded-xl shadow-md text-white relative overflow-hidden">
          <div className="absolute right-[-20px] top-[-20px] opacity-10">
             <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z"/></svg>
          </div>
          <p className="text-sm font-medium text-indigo-200">Global Head Office</p>
          <p className="text-xs text-indigo-300 mt-1">Multi-currency & taxes enabled</p>
          <button className="mt-3 text-xs font-bold bg-white text-indigo-900 px-3 py-1.5 rounded hover:bg-gray-100 transition-colors">
            Global Settings
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Branch Network */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-[#E2E8F0] flex gap-4 bg-gray-50/50 items-center justify-between">
            <h2 className="font-bold text-[#0F172A]">Company Branch Network</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] uppercase tracking-wider text-xs">
                <tr>
                  <th className="px-6 py-3 font-semibold">Branch Name</th>
                  <th className="px-6 py-3 font-semibold">Location</th>
                  <th className="px-6 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {branches.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-6 text-center text-[#64748B]">No branches found.</td>
                  </tr>
                ) : (
                  branches.map(b => (
                    <tr key={b.id} className="hover:bg-gray-50">
                      <td className="px-6 py-3 font-bold text-[#0F172A]">{b.name}</td>
                      <td className="px-6 py-3 text-[#64748B]">{b.location || 'HQ'}</td>
                      <td className="px-6 py-3 text-right">
                        <button className="text-teal-600 font-medium hover:underline">Manage</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sub-Distributors */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-[#E2E8F0] flex gap-4 bg-gray-50/50 items-center justify-between">
            <h2 className="font-bold text-[#0F172A]">Franchises & Sub-Distributors</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] uppercase tracking-wider text-xs">
                <tr>
                  <th className="px-6 py-3 font-semibold">Name</th>
                  <th className="px-6 py-3 font-semibold">Region</th>
                  <th className="px-6 py-3 font-semibold text-right">Access</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {subDistributors.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-6 text-center text-[#64748B]">No sub-distributors registered.</td>
                  </tr>
                ) : (
                  subDistributors.map(sub => (
                    <tr key={sub.id} className="hover:bg-gray-50">
                      <td className="px-6 py-3 font-bold text-[#0F172A]">{sub.name}</td>
                      <td className="px-6 py-3 text-[#64748B]">{sub.region}</td>
                      <td className="px-6 py-3 text-right">
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">Portal Live</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
