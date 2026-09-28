import Link from "next/link";

export default function OrderToCashWorkflow() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Workflow: Pre-Sell Order to Cash</h1>
          <p className="text-sm text-[#64748B] mt-1">End-to-end sales cycle: From mobile field booking to day-end settlement.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-[#E2E8F0] hover:bg-gray-50 text-[#0F172A] px-4 py-2 rounded-md text-sm font-semibold shadow-sm transition-all flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
            Mobile Agent View
          </button>
          <Link href="/sales/new">
            <button className="bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-700 hover:to-emerald-600 text-white px-4 py-2 rounded-md text-sm font-semibold shadow-md transition-all active:scale-[0.98]">
              Simulate Field Order
            </button>
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] p-6">
        <h2 className="text-lg font-bold text-[#0F172A] mb-8">Live Pre-Sell Fulfillment Pipeline</h2>
        
        <div className="relative">
          {/* Connecting Line */}
          <div className="absolute top-1/2 left-4 right-4 h-1 bg-gray-100 -translate-y-1/2 z-0 hidden lg:block"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-3 relative z-10">
            
            {/* Step 1: Field Booking */}
            <div className="bg-white border-2 border-indigo-500 p-3 rounded-xl shadow-sm text-center">
               <div className="bg-indigo-100 text-indigo-700 w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 font-bold text-sm">1</div>
               <h3 className="font-bold text-[#0F172A] text-xs">Field Booking</h3>
               <p className="text-[10px] text-[#64748B] mt-1 line-clamp-2">Salesman visits shop, AI suggests products, schemes applied.</p>
               <button className="mt-3 text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-1.5 rounded w-full hover:bg-indigo-100">Live Orders (12)</button>
            </div>

            {/* Step 2: Approval */}
            <div className="bg-white border border-[#E2E8F0] p-3 rounded-xl shadow-sm text-center">
               <div className="bg-orange-100 text-orange-700 w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 font-bold text-sm">2</div>
               <h3 className="font-bold text-[#0F172A] text-xs">Credit Approval</h3>
               <p className="text-[10px] text-[#64748B] mt-1 line-clamp-2">If limit crossed, workflow holds order for manager.</p>
               <button className="mt-3 text-[10px] font-bold text-orange-700 bg-orange-50 px-2 py-1.5 rounded w-full hover:bg-orange-100">Pending (3)</button>
            </div>

            {/* Step 3: Warehouse */}
            <div className="bg-white border border-[#E2E8F0] p-3 rounded-xl shadow-sm text-center">
               <div className="bg-teal-100 text-teal-700 w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 font-bold text-sm">3</div>
               <h3 className="font-bold text-[#0F172A] text-xs">Pick & Pack</h3>
               <p className="text-[10px] text-[#64748B] mt-1 line-clamp-2">Print picking list by FEFO/FIFO, pack boxes, loading sheet.</p>
               <button className="mt-3 text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-1.5 rounded w-full hover:bg-teal-100">To Pick (8)</button>
            </div>

            {/* Step 4: Dispatch */}
            <div className="bg-white border border-[#E2E8F0] p-3 rounded-xl shadow-sm text-center">
               <div className="bg-blue-100 text-blue-700 w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 font-bold text-sm">4</div>
               <h3 className="font-bold text-[#0F172A] text-xs">Dispatch</h3>
               <p className="text-[10px] text-[#64748B] mt-1 line-clamp-2">Vehicle assigned. Dispatch SMS sent via API.</p>
               <button className="mt-3 text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-1.5 rounded w-full hover:bg-blue-100">In Transit (5)</button>
            </div>

            {/* Step 5: Delivery */}
            <div className="bg-white border border-[#E2E8F0] p-3 rounded-xl shadow-sm text-center">
               <div className="bg-purple-100 text-purple-700 w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 font-bold text-sm">5</div>
               <h3 className="font-bold text-[#0F172A] text-xs">Proof & Cash</h3>
               <p className="text-[10px] text-[#64748B] mt-1 line-clamp-2">Driver delivers, logs returns, collects payment.</p>
               <button className="mt-3 text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-1.5 rounded w-full hover:bg-purple-100">Review POD (2)</button>
            </div>

            {/* Step 6: Settlement */}
            <div className="bg-white border border-[#E2E8F0] p-3 rounded-xl shadow-sm text-center">
               <div className="bg-green-100 text-green-700 w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 font-bold text-sm">6</div>
               <h3 className="font-bold text-[#0F172A] text-xs">Day-End</h3>
               <p className="text-[10px] text-[#64748B] mt-1 line-clamp-2">Driver settles cash/goods. Ledger & comms update.</p>
               <button className="mt-3 text-[10px] font-bold text-gray-700 bg-gray-100 px-2 py-1.5 rounded w-full">Pending EOD</button>
            </div>
            
          </div>
        </div>
      </div>
      
      {/* Detailed Action List */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-[#E2E8F0] flex gap-4 bg-gray-50/50 items-center justify-between">
          <h2 className="font-bold text-[#0F172A]">Action Required: Order to Cash</h2>
        </div>
        <div className="p-0">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] uppercase tracking-wider text-xs">
              <tr>
                <th className="px-6 py-3 font-semibold">Stage</th>
                <th className="px-6 py-3 font-semibold">Reference</th>
                <th className="px-6 py-3 font-semibold">Details</th>
                <th className="px-6 py-3 font-semibold text-right">Action Needed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              <tr className="hover:bg-gray-50">
                 <td className="px-6 py-4">
                    <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs font-bold">2. Credit Hold</span>
                 </td>
                 <td className="px-6 py-4 font-mono text-[#0F172A]">SO-2026-8812</td>
                 <td className="px-6 py-4 text-[#64748B]">City Pharmacy exceeded credit limit by Rs 40,000.</td>
                 <td className="px-6 py-4 text-right">
                    <button className="text-orange-600 font-bold hover:underline">Approve Override</button>
                 </td>
              </tr>
              <tr className="hover:bg-gray-50">
                 <td className="px-6 py-4">
                    <span className="bg-teal-100 text-teal-800 px-2 py-1 rounded text-xs font-bold">3. Warehouse</span>
                 </td>
                 <td className="px-6 py-4 font-mono text-[#0F172A]">ROUTE-NORTH</td>
                 <td className="px-6 py-4 text-[#64748B]">8 Approved orders ready for bulk picking.</td>
                 <td className="px-6 py-4 text-right">
                    <button className="text-teal-600 font-bold hover:underline">Print Loading Sheet</button>
                 </td>
              </tr>
              <tr className="hover:bg-gray-50">
                 <td className="px-6 py-4">
                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-bold">5. Delivery</span>
                 </td>
                 <td className="px-6 py-4 font-mono text-[#0F172A]">INV-2026-119</td>
                 <td className="px-6 py-4 text-[#64748B]">Driver Ali marked 2 cartons damaged on delivery.</td>
                 <td className="px-6 py-4 text-right">
                    <button className="text-purple-600 font-bold hover:underline">Process Return Claim</button>
                 </td>
              </tr>
              <tr className="hover:bg-gray-50">
                 <td className="px-6 py-4">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-bold">6. Settlement</span>
                 </td>
                 <td className="px-6 py-4 font-mono text-[#0F172A]">TRIP-449</td>
                 <td className="px-6 py-4 text-[#64748B]">Driver Ali returned to depot. Ready for cash count.</td>
                 <td className="px-6 py-4 text-right">
                    <button className="text-green-600 font-bold hover:underline">Perform Day-End</button>
                 </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
