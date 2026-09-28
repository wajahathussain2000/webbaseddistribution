import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function CompliancePage() {
  let calendar: any[] = [];
  let rules: any[] = [];
  let licences: any[] = [];
  
  try {
    calendar = await prisma.complianceCalendar.findMany({
      orderBy: { dueDate: 'asc' },
      take: 10
    });
    rules = await prisma.taxRule.findMany();
    licences = await prisma.companyLicence.findMany();
  } catch (err) {
    console.error("Prisma error:", err);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Tax & Compliance</h1>
          <p className="text-sm text-[#64748B] mt-1">Manage e-Invoicing, Tax Rules, and Company Licences securely.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-[#E2E8F0] hover:bg-gray-50 text-[#0F172A] px-4 py-2 rounded-md text-sm font-semibold shadow-sm transition-all">
            Tax Engine Rules
          </button>
          <button className="bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-700 hover:to-emerald-600 text-white px-4 py-2 rounded-md text-sm font-semibold shadow-md transition-all active:scale-[0.98]">
            + Add Reminder
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm border-l-4 border-l-teal-500">
          <p className="text-sm font-medium text-[#64748B]">Active Tax Rules</p>
          <p className="text-2xl font-bold text-[#0F172A] mt-2">
            {rules.length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm border-l-4 border-l-orange-500">
          <p className="text-sm font-medium text-[#64748B]">Pending Tax Invoices</p>
          <p className="text-2xl font-bold text-orange-600 mt-2">0</p>
          <p className="text-xs text-[#64748B] mt-1">Ready for Authority sync</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm border-l-4 border-l-red-500">
          <p className="text-sm font-medium text-[#64748B]">Upcoming Deadlines</p>
          <p className="text-2xl font-bold text-red-600 mt-2">
            {calendar.filter(c => c.status === 'PENDING').length}
          </p>
        </div>
        <div className="bg-gradient-to-br from-indigo-900 to-slate-800 p-6 rounded-xl shadow-md text-white relative overflow-hidden">
          <div className="absolute right-[-20px] top-[-20px] opacity-10">
             <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <p className="text-sm font-medium text-indigo-200">Audit-Ready Logs</p>
          <button className="mt-3 text-xs font-bold bg-white text-indigo-900 px-3 py-1.5 rounded hover:bg-gray-100 transition-colors">
            Generate Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column: Licences & Rules */}
        <div className="col-span-1 space-y-6">
          <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-[#E2E8F0] bg-gray-50/50">
              <h2 className="font-bold text-[#0F172A]">Company Licences</h2>
            </div>
            <div className="p-4">
              {licences.length === 0 ? (
                 <p className="text-sm text-[#64748B] text-center py-4">No licences registered.</p>
              ) : (
                <ul className="space-y-4">
                  {licences.map(lic => (
                    <li key={lic.id} className="flex justify-between items-center text-sm border-b pb-2">
                      <div>
                        <p className="font-semibold text-[#0F172A]">{lic.type}</p>
                        <p className="text-xs text-[#64748B]">Exp: {new Date(lic.expiryDate).toLocaleDateString()}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${lic.status === 'ACTIVE' ? 'bg-teal-100 text-teal-700' : 'bg-red-100 text-red-700'}`}>
                        {lic.status}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Compliance Calendar */}
        <div className="col-span-1 md:col-span-2 bg-white border border-[#E2E8F0] rounded-xl shadow-sm flex flex-col overflow-hidden">
          <div className="p-4 border-b border-[#E2E8F0] flex gap-4 bg-gray-50/50 items-center justify-between">
            <h2 className="font-bold text-[#0F172A]">Compliance Calendar</h2>
            <div className="flex gap-2">
              <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-bold">Overdue: 0</span>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] uppercase tracking-wider text-xs">
                <tr>
                  <th className="px-6 py-3 font-semibold">Due Date</th>
                  <th className="px-6 py-3 font-semibold">Task / Title</th>
                  <th className="px-6 py-3 font-semibold">Type</th>
                  <th className="px-6 py-3 font-semibold text-center">Status</th>
                  <th className="px-6 py-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {calendar.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-[#64748B]">
                      <p>No compliance deadlines scheduled.</p>
                    </td>
                  </tr>
                ) : (
                  calendar.map(item => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-bold text-[#0F172A]">{new Date(item.dueDate).toLocaleDateString()}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-[#0F172A]">{item.title}</div>
                        <div className="text-xs text-[#64748B]">{item.notes || '-'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                          {item.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold
                          ${item.status === 'COMPLETED' ? 'bg-[#10B981]/10 text-[#10B981]' : 
                            'bg-orange-100 text-orange-700'}`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-teal-600 hover:text-teal-800 font-medium">Mark Done</button>
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
