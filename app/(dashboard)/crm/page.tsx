import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function CrmPage() {
  let tickets: any[] = [];
  let followUps: any[] = [];
  
  try {
    tickets = await prisma.customerTicket.findMany({
      include: { customer: true },
      orderBy: { date: 'desc' },
      take: 10
    });
    followUps = await prisma.customerFollowUp.findMany({
      include: { customer: true, employee: true },
      where: { status: 'PENDING' },
      orderBy: { dueDate: 'asc' },
      take: 5
    });
  } catch (err) {
    console.error("Prisma error:", err);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">CRM & Engagement</h1>
          <p className="text-sm text-[#64748B] mt-1">Track complaints, follow-ups, contracts, and customer loyalty.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-[#E2E8F0] hover:bg-gray-50 text-[#0F172A] px-4 py-2 rounded-md text-sm font-semibold shadow-sm transition-all">
            Loyalty Program
          </button>
          <button className="bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-700 hover:to-emerald-600 text-white px-4 py-2 rounded-md text-sm font-semibold shadow-md transition-all active:scale-[0.98]">
            + Log Ticket
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm border-l-4 border-l-red-500">
          <p className="text-sm font-medium text-[#64748B]">Open Complaints</p>
          <p className="text-2xl font-bold text-red-600 mt-2">
            {tickets.filter(t => t.type === 'COMPLAINT' && t.status !== 'CLOSED' && t.status !== 'RESOLVED').length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm border-l-4 border-l-orange-500">
          <p className="text-sm font-medium text-[#64748B]">Pending Follow-Ups</p>
          <p className="text-2xl font-bold text-orange-600 mt-2">
            {followUps.length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm border-l-4 border-l-teal-500">
          <p className="text-sm font-medium text-[#64748B]">Gold Tier Customers</p>
          <p className="text-2xl font-bold text-teal-700 mt-2">0</p>
        </div>
        <div className="bg-gradient-to-br from-indigo-900 to-slate-800 p-6 rounded-xl shadow-md text-white relative overflow-hidden">
          <div className="absolute right-[-20px] top-[-20px] opacity-10">
             <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
          </div>
          <p className="text-sm font-medium text-indigo-200">Churn AI Predictor</p>
          <button className="mt-3 text-xs font-bold bg-white text-indigo-900 px-3 py-1.5 rounded hover:bg-gray-100 transition-colors">
            View At-Risk Clients
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Tickets */}
        <div className="col-span-1 lg:col-span-2 bg-white border border-[#E2E8F0] rounded-xl shadow-sm flex flex-col overflow-hidden">
          <div className="p-4 border-b border-[#E2E8F0] flex gap-4 bg-gray-50/50 items-center justify-between">
            <h2 className="font-bold text-[#0F172A]">Customer Tickets</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] uppercase tracking-wider text-xs">
                <tr>
                  <th className="px-6 py-3 font-semibold">Date & Customer</th>
                  <th className="px-6 py-3 font-semibold">Type</th>
                  <th className="px-6 py-3 font-semibold">Priority</th>
                  <th className="px-6 py-3 font-semibold text-center">Status</th>
                  <th className="px-6 py-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {tickets.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-[#64748B]">
                      <p>No customer tickets logged.</p>
                    </td>
                  </tr>
                ) : (
                  tickets.map(ticket => (
                    <tr key={ticket.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-bold text-[#0F172A]">{ticket.customer?.name || 'Unknown'}</div>
                        <div className="text-xs text-[#64748B]">{new Date(ticket.date).toLocaleDateString()}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                          {ticket.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                         <span className={`text-xs font-bold ${ticket.priority === 'HIGH' || ticket.priority === 'URGENT' ? 'text-red-600' : 'text-blue-600'}`}>
                           {ticket.priority}
                         </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold
                          ${ticket.status === 'RESOLVED' || ticket.status === 'CLOSED' ? 'bg-[#10B981]/10 text-[#10B981]' : 
                            'bg-orange-100 text-orange-700'}`}
                        >
                          {ticket.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-teal-600 hover:text-teal-800 font-medium">Resolve</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Col: Follow-ups */}
        <div className="col-span-1 space-y-6">
          <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-[#E2E8F0] bg-gray-50/50">
              <h2 className="font-bold text-[#0F172A]">My Follow-Ups</h2>
            </div>
            <div className="p-4">
              {followUps.length === 0 ? (
                 <p className="text-sm text-[#64748B] text-center py-4">No pending follow-ups.</p>
              ) : (
                <ul className="space-y-4">
                  {followUps.map(fu => (
                    <li key={fu.id} className="flex justify-between items-center text-sm border-b pb-2">
                      <div>
                        <p className="font-semibold text-[#0F172A]">{fu.customer?.name || 'Unknown'}</p>
                        <p className="text-xs text-[#64748B]">Due: {new Date(fu.dueDate).toLocaleDateString()} • {fu.type}</p>
                      </div>
                      <button className="text-xs bg-teal-50 text-teal-700 px-2 py-1 rounded hover:bg-teal-100 font-medium">Done</button>
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
