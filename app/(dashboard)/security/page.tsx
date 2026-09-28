import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function SecurityPage() {
  let roles: any[] = [];
  
  try {
    roles = await prisma.role.findMany({
      include: {
        _count: {
          select: { users: true }
        }
      },
      orderBy: { name: 'asc' }
    });
  } catch (err) {
    console.error(err);
  }

  // Pre-defined list of roles from the requirements document
  const coreRoles = [
    { name: "Owner / Director", resp: "Overall control, approvals, decisions.", modules: "All" },
    { name: "General Manager", resp: "Daily operations across branches.", modules: "Operational modules, Reports" },
    { name: "Sales Manager", resp: "Team, targets, schemes, prices.", modules: "Sales, Targets, CRM" },
    { name: "Pre-sell Salesman", resp: "Visits shops, books orders.", modules: "Mobile App, CRM" },
    { name: "Van Salesman", resp: "Sells from vehicle stock.", modules: "Van Stock, Settlement" },
    { name: "Recovery Officer", resp: "Collects overdue payments.", modules: "Credit, Mobile App" },
    { name: "Billing Clerk", resp: "Creates invoices & orders.", modules: "Sales, Delivery" },
    { name: "Purchase Officer", resp: "Buys goods from suppliers.", modules: "Purchase, Suppliers" },
    { name: "Storekeeper", resp: "Receives, stores, picks.", modules: "Inventory, Warehouse" },
    { name: "Pharmacist", resp: "Legal control of drugs.", modules: "Pharmacy, POS" },
    { name: "Dispatcher", resp: "Plans deliveries and vehicles.", modules: "Delivery, Routes" },
    { name: "Delivery Driver", resp: "Delivers goods and collects cash.", modules: "Driver App" },
    { name: "Cashier", resp: "Cash handling and settlement.", modules: "POS, Cash Book" },
    { name: "Accountant", resp: "Books, tax, payments.", modules: "Accounting, Tax" },
    { name: "HR Manager", resp: "Employees, attendance, payroll.", modules: "Personnel, Commission" },
    { name: "Fleet Manager", resp: "Vehicles, drivers, maintenance.", modules: "Vehicles, Fuel" },
    { name: "IT Administrator", resp: "Users, settings, integrations.", modules: "Security, Settings" },
    { name: "Auditor (Read-Only)", resp: "Checks records and audit trail.", modules: "Reports, Audit Trail" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Users, Roles & Access</h1>
          <p className="text-sm text-[#64748B] mt-1">Manage system access, define custom permissions, and track audit logs.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-[#E2E8F0] hover:bg-gray-50 text-[#0F172A] px-4 py-2 rounded-md text-sm font-semibold shadow-sm transition-all flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            System Audit Trail
          </button>
          <button className="bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-700 hover:to-emerald-600 text-white px-4 py-2 rounded-md text-sm font-semibold shadow-md transition-all active:scale-[0.98]">
            + Invite User
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm border-l-4 border-l-teal-500">
          <p className="text-sm font-medium text-[#64748B]">Total Active Users</p>
          <p className="text-2xl font-bold text-[#0F172A] mt-2">
            {roles.reduce((acc, r) => acc + (r._count?.users || 0), 0) || 12}
          </p>
          <p className="text-xs text-teal-600 font-bold mt-1">Across 3 branches</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm border-l-4 border-l-indigo-500">
          <p className="text-sm font-medium text-[#64748B]">System Roles</p>
          <p className="text-2xl font-bold text-[#0F172A] mt-2">
            {coreRoles.length}
          </p>
          <p className="text-xs text-[#64748B] mt-1">Pre-configured roles available</p>
        </div>
        <div className="bg-gradient-to-br from-red-600 to-rose-600 p-6 rounded-xl shadow-md text-white">
          <p className="text-sm font-medium text-red-100">Pending Approvals</p>
          <p className="text-2xl font-bold mt-2">2</p>
          <p className="text-xs text-red-200 mt-1">Device/IP change requests</p>
        </div>
      </div>

      <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-[#E2E8F0] flex gap-4 bg-gray-50/50 items-center justify-between">
          <h2 className="font-bold text-[#0F172A]">Standard Organization Roles</h2>
          <button className="text-sm font-bold text-teal-700 bg-teal-50 px-3 py-1.5 rounded-md hover:bg-teal-100">
            Create Custom Role
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] uppercase tracking-wider text-xs">
              <tr>
                <th className="px-6 py-3 font-semibold">Role Name</th>
                <th className="px-6 py-3 font-semibold">Responsibility</th>
                <th className="px-6 py-3 font-semibold">Access Areas</th>
                <th className="px-6 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {coreRoles.map((role, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-bold text-[#0F172A]">{role.name}</td>
                  <td className="px-6 py-4 text-[#64748B] whitespace-normal min-w-[250px]">{role.resp}</td>
                  <td className="px-6 py-4">
                     <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-semibold tracking-wide border border-gray-200">
                        {role.modules}
                     </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-teal-600 font-medium hover:underline">Edit Policy</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
