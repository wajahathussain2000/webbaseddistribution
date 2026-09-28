import Link from "next/link";

export default function VanSalesWorkflow() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Workflow: FMCG Van Sales</h1>
          <p className="text-sm text-[#64748B] mt-1">End-to-end direct store delivery (DSD): Morning load-out to day-end settlement.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-[#E2E8F0] hover:bg-gray-50 text-[#0F172A] px-4 py-2 rounded-md text-sm font-semibold shadow-sm transition-all flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            Bluetooth Printer Config
          </button>
          <Link href="/fmcg/van-load">
            <button className="bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-700 hover:to-emerald-600 text-white px-4 py-2 rounded-md text-sm font-semibold shadow-md transition-all active:scale-[0.98]">
              New Morning Load-Out
            </button>
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] p-6">
        <h2 className="text-lg font-bold text-[#0F172A] mb-8">Active Van Sales Pipeline</h2>
        
        <div className="relative">
          {/* Connecting Line */}
          <div className="absolute top-1/2 left-4 right-4 h-1 bg-gray-100 -translate-y-1/2 z-0 hidden lg:block"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 relative z-10">
            
            {/* Step 1: Morning Load-Out */}
            <div className="bg-white border-2 border-indigo-500 p-4 rounded-xl shadow-sm text-center">
               <div className="bg-indigo-100 text-indigo-700 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-sm">1</div>
               <h3 className="font-bold text-[#0F172A] text-xs uppercase tracking-wider">Morning Load</h3>
               <p className="text-[11px] text-[#64748B] mt-1 line-clamp-2">Warehouse issues stock to van based on history.</p>
               <button className="mt-3 text-[11px] font-bold text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded w-full hover:bg-indigo-100">Prepare Load (2)</button>
            </div>

            {/* Step 2: Field Sales */}
            <div className="bg-white border border-[#E2E8F0] p-4 rounded-xl shadow-sm text-center">
               <div className="bg-teal-100 text-teal-700 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-sm">2</div>
               <h3 className="font-bold text-[#0F172A] text-xs uppercase tracking-wider">Field Sales</h3>
               <p className="text-[11px] text-[#64748B] mt-1 line-clamp-2">Direct sales from van, thermal printing, instant cash.</p>
               <button className="mt-3 text-[11px] font-bold text-teal-700 bg-teal-50 px-3 py-1.5 rounded w-full hover:bg-teal-100">Vans En Route (5)</button>
            </div>

            {/* Step 3: Top-Up Request */}
            <div className="bg-white border border-[#E2E8F0] p-4 rounded-xl shadow-sm text-center relative">
               <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">Alert</span>
               <div className="bg-orange-100 text-orange-700 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-sm">3</div>
               <h3 className="font-bold text-[#0F172A] text-xs uppercase tracking-wider">Stock Top-Up</h3>
               <p className="text-[11px] text-[#64748B] mt-1 line-clamp-2">Salesman requests emergency stock reload mid-route.</p>
               <button className="mt-3 text-[11px] font-bold text-orange-700 bg-orange-50 px-3 py-1.5 rounded w-full hover:bg-orange-100 border border-orange-200">Pending Request (1)</button>
            </div>

            {/* Step 4: Day-End Return */}
            <div className="bg-white border border-[#E2E8F0] p-4 rounded-xl shadow-sm text-center">
               <div className="bg-blue-100 text-blue-700 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-sm">4</div>
               <h3 className="font-bold text-[#0F172A] text-xs uppercase tracking-wider">Day-End Return</h3>
               <p className="text-[11px] text-[#64748B] mt-1 line-clamp-2">Count unsold goods, log daily expenses & fuel.</p>
               <button className="mt-3 text-[11px] font-bold text-blue-700 bg-blue-50 px-3 py-1.5 rounded w-full hover:bg-blue-100">Ready to Settle (3)</button>
            </div>

            {/* Step 5: Variance Audit */}
            <div className="bg-white border border-[#E2E8F0] p-4 rounded-xl shadow-sm text-center">
               <div className="bg-red-100 text-red-700 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-sm">5</div>
               <h3 className="font-bold text-[#0F172A] text-xs uppercase tracking-wider">Variance Audit</h3>
               <p className="text-[11px] text-[#64748B] mt-1 line-clamp-2">Manager approves cash shortages or stock excesses.</p>
               <button className="mt-3 text-[11px] font-bold text-gray-700 bg-gray-100 px-3 py-1.5 rounded w-full border border-gray-200">Pending Review (0)</button>
            </div>
            
          </div>
        </div>
      </div>
      
      {/* Detailed Action List */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-[#E2E8F0] flex gap-4 bg-gray-50/50 items-center justify-between">
          <h2 className="font-bold text-[#0F172A]">Van Sales Control Center</h2>
        </div>
        <div className="p-0">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] uppercase tracking-wider text-xs">
              <tr>
                <th className="px-6 py-3 font-semibold">Stage</th>
                <th className="px-6 py-3 font-semibold">Van / Salesman</th>
                <th className="px-6 py-3 font-semibold">Details</th>
                <th className="px-6 py-3 font-semibold text-right">Action Needed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              <tr className="hover:bg-gray-50">
                 <td className="px-6 py-4">
                    <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-xs font-bold border border-indigo-200">1. Morning Load</span>
                 </td>
                 <td className="px-6 py-4 font-mono text-[#0F172A]">VAN-04 (Hassan)</td>
                 <td className="px-6 py-4 text-[#64748B]">Load-out request generated for Route 9.</td>
                 <td className="px-6 py-4 text-right">
                    <button className="text-indigo-600 font-bold hover:underline">Issue Stock</button>
                 </td>
              </tr>
              <tr className="hover:bg-gray-50">
                 <td className="px-6 py-4">
                    <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs font-bold border border-orange-200">3. Top-Up Request</span>
                 </td>
                 <td className="px-6 py-4 font-mono text-[#0F172A]">VAN-01 (Ahmed)</td>
                 <td className="px-6 py-4 text-[#64748B]">Requested 10 cartons of Soap mid-route.</td>
                 <td className="px-6 py-4 text-right">
                    <button className="text-orange-600 font-bold hover:underline">Approve & Dispatch</button>
                 </td>
              </tr>
              <tr className="hover:bg-gray-50">
                 <td className="px-6 py-4">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-bold border border-blue-200">4. Day-End Return</span>
                 </td>
                 <td className="px-6 py-4 font-mono text-[#0F172A]">VAN-02 (Tariq)</td>
                 <td className="px-6 py-4 text-[#64748B]">Arrived at depot. Declared Rs 120,500 cash.</td>
                 <td className="px-6 py-4 text-right">
                    <button className="text-blue-600 font-bold hover:underline">Verify Cash & Stock</button>
                 </td>
              </tr>
              <tr className="hover:bg-gray-50 opacity-60">
                 <td className="px-6 py-4">
                    <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-bold border border-gray-200">5. Variance Audit</span>
                 </td>
                 <td className="px-6 py-4 font-mono text-[#0F172A]">VAN-09 (Bilal)</td>
                 <td className="px-6 py-4 text-[#64748B]">Shortage of Rs 400. Deducted from comms.</td>
                 <td className="px-6 py-4 text-right">
                    <span className="text-gray-500 font-bold">Resolved</span>
                 </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
