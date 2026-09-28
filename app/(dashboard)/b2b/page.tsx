import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function B2bPortalPage() {
  let b2bUsers: any[] = [];
  
  try {
    b2bUsers = await prisma.b2bUser.findMany({
      include: { customer: true },
      orderBy: { username: 'asc' },
      take: 10
    });
  } catch (err) {
    console.error("Prisma error:", err);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">B2B Customer Portal</h1>
          <p className="text-sm text-[#64748B] mt-1">Manage B2B users, catalogue visibility, and customer online orders.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-[#E2E8F0] hover:bg-gray-50 text-[#0F172A] px-4 py-2 rounded-md text-sm font-semibold shadow-sm transition-all">
            Catalogue Settings
          </button>
          <button className="bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-700 hover:to-emerald-600 text-white px-4 py-2 rounded-md text-sm font-semibold shadow-md transition-all active:scale-[0.98]">
            + Invite Customer
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm border-l-4 border-l-blue-500">
          <p className="text-sm font-medium text-[#64748B]">Active B2B Users</p>
          <p className="text-2xl font-bold text-[#0F172A] mt-2">
            {b2bUsers.length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm border-l-4 border-l-teal-500">
          <p className="text-sm font-medium text-[#64748B]">Orders via Portal</p>
          <p className="text-2xl font-bold text-teal-700 mt-2">0</p>
          <p className="text-xs text-[#64748B] mt-1">This month</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm border-l-4 border-l-orange-500">
          <p className="text-sm font-medium text-[#64748B]">Portal Revenue</p>
          <p className="text-2xl font-bold text-orange-600 mt-2">Rs 0</p>
          <p className="text-xs text-[#64748B] mt-1">This month</p>
        </div>
        <div className="bg-gradient-to-br from-indigo-900 to-slate-800 p-6 rounded-xl shadow-md text-white relative overflow-hidden">
          <div className="absolute right-[-20px] top-[-20px] opacity-10">
             <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
          </div>
          <p className="text-sm font-medium text-indigo-200">WhatsApp Bot (AI)</p>
          <p className="text-xs text-indigo-300 mt-1">Offline</p>
          <button className="mt-3 text-xs font-bold bg-green-500 text-white px-3 py-1.5 rounded hover:bg-green-600 transition-colors">
            Connect Bot
          </button>
        </div>
      </div>

      <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-[#E2E8F0] flex gap-4 bg-gray-50/50 items-center justify-between">
          <h2 className="font-bold text-[#0F172A]">B2B Access Management</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] uppercase tracking-wider text-xs">
              <tr>
                <th className="px-6 py-3 font-semibold">Customer</th>
                <th className="px-6 py-3 font-semibold">Username / Email</th>
                <th className="px-6 py-3 font-semibold">Role</th>
                <th className="px-6 py-3 font-semibold text-center">Status</th>
                <th className="px-6 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {b2bUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-[#64748B]">
                    <div className="flex flex-col items-center justify-center">
                       <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4v16m8-8H4" /></svg>
                       <p>No customers have portal access yet.</p>
                       <button className="mt-2 text-teal-600 font-semibold hover:underline">Invite your first customer</button>
                    </div>
                  </td>
                </tr>
              ) : (
                b2bUsers.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-bold text-[#0F172A]">{user.customer?.name || 'Unknown Customer'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-[#0F172A]">{user.username}</div>
                      <div className="text-xs text-[#64748B]">{user.email || 'No email'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-mono font-bold border border-blue-200">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold
                        ${user.isActive ? 'bg-[#10B981]/10 text-[#10B981]' : 'bg-red-100 text-red-700'}`}
                      >
                        {user.isActive ? 'ACTIVE' : 'LOCKED'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <button className="text-indigo-600 hover:text-indigo-800 font-medium">Reset Pass</button>
                      <button className="text-red-600 hover:text-red-800 font-medium">Revoke</button>
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
