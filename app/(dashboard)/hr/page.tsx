import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function HRPage() {
  let employees: any[] = [];
  try {
    employees = await prisma.employee.findMany({
      include: {
        _count: {
          select: { attendances: true, leaveRequests: true }
        }
      },
      orderBy: { name: 'asc' },
      take: 20
    });
  } catch (err) {
    console.error("Prisma error:", err);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Personnel & Payroll</h1>
          <p className="text-sm text-[#64748B] mt-1">Manage staff, attendance, leaves, advances, and payroll processing.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-[#E2E8F0] hover:bg-gray-50 text-[#0F172A] px-4 py-2 rounded-md text-sm font-semibold shadow-sm transition-all">
            Payroll Processing
          </button>
          <button className="bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-700 hover:to-emerald-600 text-white px-4 py-2 rounded-md text-sm font-semibold shadow-md transition-all active:scale-[0.98]">
            + Add Employee
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm border-l-4 border-l-blue-500">
          <p className="text-sm font-medium text-[#64748B]">Total Staff</p>
          <p className="text-2xl font-bold text-[#0F172A] mt-2">
            {employees.length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm border-l-4 border-l-teal-500">
          <p className="text-sm font-medium text-[#64748B]">Present Today</p>
          <p className="text-2xl font-bold text-teal-700 mt-2">0</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm border-l-4 border-l-orange-500">
          <p className="text-sm font-medium text-[#64748B]">Pending Leaves</p>
          <p className="text-2xl font-bold text-orange-600 mt-2">0</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm border-l-4 border-l-red-500">
          <p className="text-sm font-medium text-[#64748B]">Active Advances</p>
          <p className="text-2xl font-bold text-red-600 mt-2">0</p>
        </div>
      </div>

      <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-[#E2E8F0] flex gap-4 bg-gray-50/50 items-center justify-between">
          <h2 className="font-bold text-[#0F172A]">Employee Directory</h2>
          <select className="border border-[#E2E8F0] rounded-md px-3 py-1.5 text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-teal-500">
            <option>All Departments</option>
            <option>Sales</option>
            <option>Delivery</option>
            <option>Warehouse</option>
            <option>Finance</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] uppercase tracking-wider text-xs">
              <tr>
                <th className="px-6 py-3 font-semibold">Employee</th>
                <th className="px-6 py-3 font-semibold">Department & Role</th>
                <th className="px-6 py-3 font-semibold text-center">Base Salary</th>
                <th className="px-6 py-3 font-semibold text-center">Status</th>
                <th className="px-6 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {employees.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-[#64748B]">
                    <div className="flex flex-col items-center justify-center">
                       <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                       <p>No employees registered yet.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                employees.map(emp => (
                  <tr key={emp.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-bold text-[#0F172A]">{emp.name}</div>
                      <div className="text-xs text-[#64748B]">{emp.phone || 'No phone'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-[#0F172A]">{emp.department}</div>
                      <div className="text-xs text-[#64748B]">{emp.designation}</div>
                    </td>
                    <td className="px-6 py-4 text-center font-mono text-[#0F172A]">
                      Rs {emp.baseSalary.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold
                        ${emp.status === 'ACTIVE' ? 'bg-[#10B981]/10 text-[#10B981]' : 
                          emp.status === 'ON_LEAVE' ? 'bg-orange-100 text-orange-700' :
                          'bg-red-100 text-red-700'}`}
                      >
                        {emp.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <button className="text-teal-600 hover:text-teal-800 font-medium">Ledger</button>
                      <button className="text-indigo-600 hover:text-indigo-800 font-medium">Profile</button>
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
