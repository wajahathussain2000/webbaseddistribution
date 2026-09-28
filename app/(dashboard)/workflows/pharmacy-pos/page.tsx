import Link from "next/link";

export default function PharmacyPOSWorkflow() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Workflow: Pharmacy POS Shift</h1>
          <p className="text-sm text-[#64748B] mt-1">Retail counter operations with strict FEFO, Rx compliance, and shift settlement.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-[#E2E8F0] hover:bg-gray-50 text-[#0F172A] px-4 py-2 rounded-md text-sm font-semibold shadow-sm transition-all flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            Shift History
          </button>
          <Link href="/pharmacy/pos">
            <button className="bg-gradient-to-r from-red-600 to-pink-500 hover:from-red-700 hover:to-pink-600 text-white px-4 py-2 rounded-md text-sm font-semibold shadow-md transition-all active:scale-[0.98]">
              Open POS Register
            </button>
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] p-6">
        <h2 className="text-lg font-bold text-[#0F172A] mb-8">Live Shift Pipeline: Counter 2</h2>
        
        <div className="relative">
          {/* Connecting Line */}
          <div className="absolute top-1/2 left-4 right-4 h-1 bg-gray-100 -translate-y-1/2 z-0 hidden lg:block"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-3 relative z-10">
            
            {/* Step 1: Open Shift */}
            <div className="bg-white border-2 border-red-500 p-3 rounded-xl shadow-sm text-center">
               <div className="bg-red-100 text-red-700 w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 font-bold text-sm">1</div>
               <h3 className="font-bold text-[#0F172A] text-xs uppercase tracking-wider">Open Shift</h3>
               <p className="text-[10px] text-[#64748B] mt-1 line-clamp-2">Cashier counts opening float in drawer.</p>
               <button className="mt-3 text-[10px] font-bold text-red-700 bg-red-50 px-2 py-1.5 rounded w-full border border-red-200">Active (Started 8:00 AM)</button>
            </div>

            {/* Step 2: Scan & FEFO */}
            <div className="bg-white border border-[#E2E8F0] p-3 rounded-xl shadow-sm text-center">
               <div className="bg-teal-100 text-teal-700 w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 font-bold text-sm">2</div>
               <h3 className="font-bold text-[#0F172A] text-xs uppercase tracking-wider">Scan & FEFO</h3>
               <p className="text-[10px] text-[#64748B] mt-1 line-clamp-2">Barcode scanned; system auto-picks nearest expiry batch.</p>
               <button className="mt-3 text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-1.5 rounded w-full hover:bg-teal-100">Live Scans</button>
            </div>

            {/* Step 3: Rx Verification */}
            <div className="bg-white border border-[#E2E8F0] p-3 rounded-xl shadow-sm text-center relative">
               <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">Wait</span>
               <div className="bg-orange-100 text-orange-700 w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 font-bold text-sm">3</div>
               <h3 className="font-bold text-[#0F172A] text-xs uppercase tracking-wider">Rx Auth</h3>
               <p className="text-[10px] text-[#64748B] mt-1 line-clamp-2">Controlled drug flagged. Pharmacist approval required.</p>
               <button className="mt-3 text-[10px] font-bold text-orange-700 bg-orange-50 px-2 py-1.5 rounded w-full hover:bg-orange-100">Pending (1)</button>
            </div>

            {/* Step 4: Substitution */}
            <div className="bg-white border border-[#E2E8F0] p-3 rounded-xl shadow-sm text-center">
               <div className="bg-purple-100 text-purple-700 w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 font-bold text-sm">4</div>
               <h3 className="font-bold text-[#0F172A] text-xs uppercase tracking-wider">Substitute</h3>
               <p className="text-[10px] text-[#64748B] mt-1 line-clamp-2">If out of stock, suggest matching generic instantly.</p>
               <button className="mt-3 text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-1.5 rounded w-full hover:bg-purple-100">Suggested (3)</button>
            </div>

            {/* Step 5: Payment & Tax */}
            <div className="bg-white border border-[#E2E8F0] p-3 rounded-xl shadow-sm text-center">
               <div className="bg-blue-100 text-blue-700 w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 font-bold text-sm">5</div>
               <h3 className="font-bold text-[#0F172A] text-xs uppercase tracking-wider">Payment</h3>
               <p className="text-[10px] text-[#64748B] mt-1 line-clamp-2">Split payment taken, receipt printed, tax synced.</p>
               <button className="mt-3 text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-1.5 rounded w-full hover:bg-blue-100">Paid Invoices (42)</button>
            </div>

            {/* Step 6: Shift Close */}
            <div className="bg-white border border-[#E2E8F0] p-3 rounded-xl shadow-sm text-center">
               <div className="bg-gray-100 text-gray-700 w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 font-bold text-sm">6</div>
               <h3 className="font-bold text-[#0F172A] text-xs uppercase tracking-wider">Shift Close</h3>
               <p className="text-[10px] text-[#64748B] mt-1 line-clamp-2">Blind count cash, manager audits discrepancies.</p>
               <button className="mt-3 text-[10px] font-bold text-gray-700 bg-gray-100 px-2 py-1.5 rounded w-full">Close at 4:00 PM</button>
            </div>
            
          </div>
        </div>
      </div>
      
      {/* Detailed Action List */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-[#E2E8F0] flex gap-4 bg-gray-50/50 items-center justify-between">
          <h2 className="font-bold text-[#0F172A]">Action Required: POS Counters</h2>
        </div>
        <div className="p-0">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] uppercase tracking-wider text-xs">
              <tr>
                <th className="px-6 py-3 font-semibold">Stage</th>
                <th className="px-6 py-3 font-semibold">Counter</th>
                <th className="px-6 py-3 font-semibold">Details</th>
                <th className="px-6 py-3 font-semibold text-right">Action Needed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              <tr className="hover:bg-gray-50">
                 <td className="px-6 py-4">
                    <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs font-bold border border-orange-200">3. Rx Override</span>
                 </td>
                 <td className="px-6 py-4 font-mono text-[#0F172A]">C2 (Sarah)</td>
                 <td className="px-6 py-4 text-[#64748B]">Xanax 0.5mg scanned. Pharmacist PIN required.</td>
                 <td className="px-6 py-4 text-right">
                    <button className="text-orange-600 font-bold hover:underline">Verify Rx & Approve</button>
                 </td>
              </tr>
              <tr className="hover:bg-gray-50">
                 <td className="px-6 py-4">
                    <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-bold border border-gray-200">6. Shift Audit</span>
                 </td>
                 <td className="px-6 py-4 font-mono text-[#0F172A]">C1 (Usman)</td>
                 <td className="px-6 py-4 text-[#64748B]">Shift closed. Shortage of Rs 150 against system.</td>
                 <td className="px-6 py-4 text-right">
                    <button className="text-red-600 font-bold hover:underline">Approve Variance</button>
                 </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
