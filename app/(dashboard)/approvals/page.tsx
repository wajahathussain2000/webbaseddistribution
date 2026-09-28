import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function ApprovalsPage() {
  let pendingRequests: any[] = [];
  
  try {
    pendingRequests = await prisma.approvalRequest.findMany({
      where: { status: 'PENDING' },
      include: { 
        requestedBy: { include: { user: true } },
        assignedTo: { include: { user: true } }
      },
      orderBy: { createdAt: 'asc' }
    });
  } catch (err) {
    console.error("Prisma error:", err);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Workflow & Approvals</h1>
          <p className="text-sm text-[#64748B] mt-1">Review pending requests, set up auto-approval rules, and manage delegations.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-[#E2E8F0] hover:bg-gray-50 text-[#0F172A] px-4 py-2 rounded-md text-sm font-semibold shadow-sm transition-all flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            Approval Rules Engine
          </button>
          <button className="bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-700 hover:to-emerald-600 text-white px-4 py-2 rounded-md text-sm font-semibold shadow-md transition-all active:scale-[0.98]">
            Delegate My Approvals
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-orange-500 to-red-500 p-6 rounded-xl shadow-md text-white">
          <p className="text-sm font-medium text-orange-100">Pending My Approval</p>
          <p className="text-3xl font-bold mt-2">{pendingRequests.length}</p>
          <p className="text-xs text-orange-200 mt-1 font-medium">Requires immediate action</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm">
          <p className="text-sm font-medium text-[#64748B]">Delegated to Others</p>
          <p className="text-2xl font-bold text-[#0F172A] mt-2">0</p>
          <p className="text-xs text-[#64748B] mt-1">While on leave</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm">
          <p className="text-sm font-medium text-[#64748B]">Auto-Approved Today</p>
          <p className="text-2xl font-bold text-teal-600 mt-2">14</p>
          <p className="text-xs text-[#64748B] mt-1">Based on active rules</p>
        </div>
      </div>

      <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-[#E2E8F0] flex gap-4 bg-gray-50/50 items-center justify-between">
          <h2 className="font-bold text-[#0F172A]">Action Required: Approval Queue</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] uppercase tracking-wider text-xs">
              <tr>
                <th className="px-6 py-3 font-semibold">Date Requested</th>
                <th className="px-6 py-3 font-semibold">Requested By</th>
                <th className="px-6 py-3 font-semibold">Type & Record</th>
                <th className="px-6 py-3 font-semibold text-center">Wait Time</th>
                <th className="px-6 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {pendingRequests.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                       <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 13l4 4L19 7" /></svg>
                       <p className="text-[#64748B] font-medium">You are all caught up!</p>
                       <p className="text-xs text-[#94A3B8] mt-1">No pending approvals in your queue.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                pendingRequests.map(req => {
                  // Calculate rough wait time
                  const waitHrs = Math.floor((new Date().getTime() - new Date(req.createdAt).getTime()) / (1000 * 60 * 60));
                  
                  return (
                    <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-[#0F172A]">{new Date(req.createdAt).toLocaleDateString()}</div>
                        <div className="text-xs text-[#64748B]">{new Date(req.createdAt).toLocaleTimeString()}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-[#0F172A]">{req.requestedBy?.user?.name || 'System User'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-semibold tracking-wide border border-gray-200">
                          {req.entityType}
                        </span>
                        <div className="text-xs font-mono text-[#64748B] mt-1">Ref: {req.entityId}</div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`text-xs font-bold ${waitHrs > 24 ? 'text-red-600' : 'text-orange-500'}`}>
                          {waitHrs} hrs
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button className="text-xs font-bold bg-white border border-[#E2E8F0] text-indigo-700 hover:bg-gray-50 px-3 py-1.5 rounded-md transition-colors">
                          View Details
                        </button>
                        <button className="bg-teal-50 text-teal-700 border border-teal-200 hover:bg-teal-100 px-3 py-1.5 rounded-md text-xs font-bold transition-colors">
                          Approve
                        </button>
                        <button className="bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 px-3 py-1.5 rounded-md text-xs font-bold transition-colors">
                          Reject
                        </button>
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
