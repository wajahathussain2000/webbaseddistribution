import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import CompanyProfileForm from "./CompanyProfileForm";
import TaxesAndDiscountsForm from "./TaxesAndDiscountsForm";

export default async function SetupPage() {
  const session = await auth();
  if (!session?.user?.id) return <div>Unauthorized</div>;

  const userTenant = await prisma.tenantUser.findFirst({
    where: { userId: session.user.id },
    include: { tenant: true }
  });
  
  if (!userTenant) return <div>No tenant assigned</div>;
  const tenant = userTenant.tenant;

  const rawSettings = await prisma.systemSetting.findMany({
    where: { tenantId: tenant.id }
  });
  const settings = rawSettings.reduce((acc, curr) => ({ ...acc, [curr.key]: curr.value }), {} as Record<string, string>);
  
  const checklist = [
    { name: "Company & branches", desc: "Names, addresses, tax numbers, licences, logos.", ready: true },
    { name: "Products", desc: "Codes, names, categories, units, prices, tax, batch rules.", ready: true },
    { name: "Opening stock", desc: "Item, batch, expiry, quantity, cost, warehouse.", ready: false },
    { name: "Customers", desc: "Details, routes, credit limits, price lists, opening balances.", ready: true },
    { name: "Suppliers & principals", desc: "Details, terms, opening balances.", ready: true },
    { name: "Employees", desc: "Details, salary structure, commission rules, advances.", ready: false },
    { name: "Vehicles & drivers", desc: "Vehicle data, documents, driver licences.", ready: false },
    { name: "Routes & territories", desc: "Route list, customer mapping, visit days.", ready: true },
    { name: "Price lists & schemes", desc: "Active schemes, discount groups, special rates.", ready: true },
    { name: "Chart of accounts", desc: "Account list, opening trial balance, bank accounts.", ready: false },
    { name: "Pending cheques (PDC)", desc: "Cheque details, dates, banks.", ready: false },
    { name: "Users & roles", desc: "List of users, roles and branch access.", ready: true },
    { name: "Print formats", desc: "Approved invoice, challan, receipt and voucher layouts.", ready: false },
  ];

  const docPrefixes = [
    { doc: "Purchase Requisition", prefix: "PR" },
    { doc: "Purchase Order", prefix: "PO" },
    { doc: "Goods Received Note", prefix: "GRN" },
    { doc: "Purchase Invoice", prefix: "PI" },
    { doc: "Purchase Return", prefix: "PRT" },
    { doc: "Quotation", prefix: "QT" },
    { doc: "Sales Order", prefix: "SO" },
    { doc: "Sales Invoice", prefix: "INV" },
    { doc: "Sales Return", prefix: "SR" },
    { doc: "Delivery Challan", prefix: "DC" },
    { doc: "Receipt Voucher", prefix: "RV" },
    { doc: "Expense Voucher", prefix: "EV" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Company Setup & Go-Live</h1>
          <p className="text-sm text-[#64748B] mt-1">Manage global document sequences and track your implementation progress.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-[#E2E8F0] hover:bg-gray-50 text-[#0F172A] px-4 py-2 rounded-md text-sm font-semibold shadow-sm transition-all flex items-center gap-2">
             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
             Import Master Data (Excel)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <CompanyProfileForm tenant={tenant} />
        <TaxesAndDiscountsForm settings={settings} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Go-Live Checklist */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-[#E2E8F0] flex gap-4 bg-gray-50/50 items-center justify-between">
             <div className="flex items-center gap-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-teal-600"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                <h2 className="font-bold text-[#0F172A]">Go-Live Data Checklist</h2>
             </div>
             <span className="bg-teal-100 text-teal-700 font-bold px-2 py-0.5 rounded text-xs">{checklist.filter(c => c.ready).length} / {checklist.length} Complete</span>
          </div>
          <div className="p-0 overflow-y-auto max-h-[500px]">
            <table className="w-full text-left text-sm">
              <tbody className="divide-y divide-[#E2E8F0]">
                {checklist.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-4 py-3 w-12 text-center">
                       <input 
                         type="checkbox" 
                         checked={item.ready} 
                         readOnly
                         className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500 cursor-pointer"
                       />
                    </td>
                    <td className="px-4 py-3">
                       <p className={`font-bold text-[#0F172A] ${item.ready ? 'line-through text-gray-400' : ''}`}>{item.name}</p>
                       <p className="text-xs text-[#64748B] mt-0.5">{item.desc}</p>
                    </td>
                    <td className="px-4 py-3 text-right">
                       {!item.ready && (
                          <button className="text-xs font-semibold text-teal-600 opacity-0 group-hover:opacity-100 transition-opacity">Upload</button>
                       )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Document Numbering Sequence */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-[#E2E8F0] flex gap-4 bg-gray-50/50 items-center justify-between">
             <div className="flex items-center gap-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-indigo-600"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                <h2 className="font-bold text-[#0F172A]">Document Prefixes</h2>
             </div>
             <p className="text-xs text-[#64748B]">Format: PREFIX-BRANCH-YEAR-NUM</p>
          </div>
          <div className="p-4">
            <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-3 mb-4 flex items-center justify-between">
               <span className="text-xs text-indigo-800 font-medium">Live Example Preview:</span>
               <span className="text-sm font-mono font-bold text-indigo-900 bg-white px-2 py-1 rounded shadow-sm border border-indigo-100">INV-LHR-26-000125</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 overflow-y-auto max-h-[400px] pr-2">
               {docPrefixes.map((doc, idx) => (
                  <div key={idx} className="flex flex-col">
                     <label className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-1">{doc.doc}</label>
                     <input 
                        type="text" 
                        defaultValue={doc.prefix}
                        className="bg-white border border-[#E2E8F0] text-[#0F172A] px-3 py-2 rounded-md text-sm font-mono font-bold focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" 
                     />
                  </div>
               ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
