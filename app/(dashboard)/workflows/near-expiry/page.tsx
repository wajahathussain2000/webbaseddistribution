import Link from "next/link";

export default function NearExpiryWorkflow() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Workflow: Near-Expiry Management</h1>
          <p className="text-sm text-[#64748B] mt-1">Pharmacy/FMCG stock protection: From early alerts to liquidation and destruction.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-[#E2E8F0] hover:bg-gray-50 text-[#0F172A] px-4 py-2 rounded-md text-sm font-semibold shadow-sm transition-all flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            Alert Settings
          </button>
          <Link href="/inventory">
            <button className="bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-700 hover:to-emerald-600 text-white px-4 py-2 rounded-md text-sm font-semibold shadow-md transition-all active:scale-[0.98]">
              View Batch Inventory
            </button>
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] p-6">
        <h2 className="text-lg font-bold text-[#0F172A] mb-8">Stock Lifespan & Liquidation Pipeline</h2>
        
        <div className="relative">
          {/* Connecting Line */}
          <div className="absolute top-1/2 left-4 right-4 h-1 bg-gray-100 -translate-y-1/2 z-0 hidden lg:block"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 relative z-10">
            
            {/* Step 1: Early Alerts */}
            <div className="bg-white border-2 border-indigo-500 p-4 rounded-xl shadow-sm text-center">
               <div className="bg-indigo-100 text-indigo-700 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-sm">1</div>
               <h3 className="font-bold text-[#0F172A] text-xs uppercase tracking-wider">Early Alerts</h3>
               <p className="text-[11px] text-[#64748B] mt-1 line-clamp-2">System flags stock at 180, 90, and 60 days before expiry.</p>
               <button className="mt-3 text-[11px] font-bold text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded w-full border border-indigo-200">Alerts (24)</button>
            </div>

            {/* Step 2: AI Suggestions */}
            <div className="bg-white border border-[#E2E8F0] p-4 rounded-xl shadow-sm text-center relative">
               <span className="absolute -top-2 -right-2 bg-purple-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">AI</span>
               <div className="bg-purple-100 text-purple-700 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-sm">2</div>
               <h3 className="font-bold text-[#0F172A] text-xs uppercase tracking-wider">AI Strategy</h3>
               <p className="text-[11px] text-[#64748B] mt-1 line-clamp-2">Suggests promotion schemes or transfers to fast-selling branches.</p>
               <button className="mt-3 text-[11px] font-bold text-purple-700 bg-purple-50 px-3 py-1.5 rounded w-full hover:bg-purple-100">Review Plan (5)</button>
            </div>

            {/* Step 3: Push Sales (FEFO) */}
            <div className="bg-white border border-[#E2E8F0] p-4 rounded-xl shadow-sm text-center">
               <div className="bg-teal-100 text-teal-700 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-sm">3</div>
               <h3 className="font-bold text-[#0F172A] text-xs uppercase tracking-wider">Push Sales</h3>
               <p className="text-[11px] text-[#64748B] mt-1 line-clamp-2">Sales team pushes stock with schemes. System enforces FEFO.</p>
               <button className="mt-3 text-[11px] font-bold text-teal-700 bg-teal-50 px-3 py-1.5 rounded w-full hover:bg-teal-100 border border-teal-200">Active Promos (3)</button>
            </div>

            {/* Step 4: Cut-off Quarantine */}
            <div className="bg-white border border-[#E2E8F0] p-4 rounded-xl shadow-sm text-center">
               <div className="bg-orange-100 text-orange-700 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-sm">4</div>
               <h3 className="font-bold text-[#0F172A] text-xs uppercase tracking-wider">Quarantine</h3>
               <p className="text-[11px] text-[#64748B] mt-1 line-clamp-2">Unsold items move to near-expiry store. Return claim prepared.</p>
               <button className="mt-3 text-[11px] font-bold text-orange-700 bg-orange-50 px-3 py-1.5 rounded w-full hover:bg-orange-100 border border-orange-200">Pending Return (1)</button>
            </div>

            {/* Step 5: Auto-Block & Destroy */}
            <div className="bg-white border border-[#E2E8F0] p-4 rounded-xl shadow-sm text-center relative">
               <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">Hold</span>
               <div className="bg-red-100 text-red-700 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-sm">5</div>
               <h3 className="font-bold text-[#0F172A] text-xs uppercase tracking-wider">Block & Destroy</h3>
               <p className="text-[11px] text-[#64748B] mt-1 line-clamp-2">Expired stock blocked from sale instantly. Destroyed with record.</p>
               <button className="mt-3 text-[11px] font-bold text-red-700 bg-red-50 px-3 py-1.5 rounded w-full hover:bg-red-100 border border-red-200">Blocked (2)</button>
            </div>
            
          </div>
        </div>
      </div>
      
      {/* Detailed Action List */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-[#E2E8F0] flex gap-4 bg-gray-50/50 items-center justify-between">
          <h2 className="font-bold text-[#0F172A]">Action Required: Stock Preservation</h2>
        </div>
        <div className="p-0">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] uppercase tracking-wider text-xs">
              <tr>
                <th className="px-6 py-3 font-semibold">Stage</th>
                <th className="px-6 py-3 font-semibold">Product / Batch</th>
                <th className="px-6 py-3 font-semibold">Details</th>
                <th className="px-6 py-3 font-semibold text-right">Action Needed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              <tr className="hover:bg-gray-50">
                 <td className="px-6 py-4">
                    <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-xs font-bold border border-indigo-200">1. Early Alert (90 Days)</span>
                 </td>
                 <td className="px-6 py-4 font-mono text-[#0F172A]">Panadol (BATCH-90A)</td>
                 <td className="px-6 py-4 text-[#64748B]">200 boxes expiring in 88 days.</td>
                 <td className="px-6 py-4 text-right">
                    <button className="text-indigo-600 font-bold hover:underline">View AI Options</button>
                 </td>
              </tr>
              <tr className="hover:bg-gray-50">
                 <td className="px-6 py-4">
                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-bold border border-purple-200">2. AI Strategy</span>
                 </td>
                 <td className="px-6 py-4 font-mono text-[#0F172A]">Centrum (BATCH-11Z)</td>
                 <td className="px-6 py-4 text-[#64748B]">AI suggests 10+2 scheme to liquidate before cut-off.</td>
                 <td className="px-6 py-4 text-right">
                    <button className="text-purple-600 font-bold hover:underline">Apply Scheme</button>
                 </td>
              </tr>
              <tr className="hover:bg-gray-50">
                 <td className="px-6 py-4">
                    <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs font-bold border border-orange-200">4. Quarantine</span>
                 </td>
                 <td className="px-6 py-4 font-mono text-[#0F172A]">Disprin (BATCH-22B)</td>
                 <td className="px-6 py-4 text-[#64748B]">Hit 30-day cut-off limit. Cannot be sold to trade.</td>
                 <td className="px-6 py-4 text-right">
                    <button className="text-orange-600 font-bold hover:underline">Move to Near-Expiry Store</button>
                 </td>
              </tr>
              <tr className="hover:bg-gray-50">
                 <td className="px-6 py-4">
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-bold border border-red-200">5. Block & Destroy</span>
                 </td>
                 <td className="px-6 py-4 font-mono text-[#0F172A]">Syrup (BATCH-99X)</td>
                 <td className="px-6 py-4 text-[#64748B]">Expired yesterday. Automatically blocked at POS.</td>
                 <td className="px-6 py-4 text-right">
                    <button className="text-red-600 font-bold hover:underline">Log Destruction</button>
                 </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
