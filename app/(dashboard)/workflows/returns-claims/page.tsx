import Link from "next/link";

export default function ReturnsClaimsWorkflow() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Workflow: Returns & Company Claims</h1>
          <p className="text-sm text-[#64748B] mt-1">Manage reverse logistics from customer returns to final vendor settlement.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-[#E2E8F0] hover:bg-gray-50 text-[#0F172A] px-4 py-2 rounded-md text-sm font-semibold shadow-sm transition-all flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            Destruction Logs
          </button>
          <button className="bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-700 hover:to-emerald-600 text-white px-4 py-2 rounded-md text-sm font-semibold shadow-md transition-all active:scale-[0.98]">
            Log New Return
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] p-6">
        <h2 className="text-lg font-bold text-[#0F172A] mb-8">Reverse Logistics Pipeline</h2>
        
        <div className="relative">
          {/* Connecting Line */}
          <div className="absolute top-1/2 left-4 right-4 h-1 bg-gray-100 -translate-y-1/2 z-0 hidden lg:block"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-3 relative z-10">
            
            {/* Step 1: Customer Return */}
            <div className="bg-white border-2 border-red-500 p-3 rounded-xl shadow-sm text-center">
               <div className="bg-red-100 text-red-700 w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 font-bold text-sm">1</div>
               <h3 className="font-bold text-[#0F172A] text-xs uppercase tracking-wider">Customer Return</h3>
               <p className="text-[10px] text-[#64748B] mt-1 line-clamp-2">Shop logs expired/damaged goods with photo proof.</p>
               <button className="mt-3 text-[10px] font-bold text-red-700 bg-red-50 px-2 py-1.5 rounded w-full border border-red-200">Pending Log (2)</button>
            </div>

            {/* Step 2: Approval & Credit */}
            <div className="bg-white border border-[#E2E8F0] p-3 rounded-xl shadow-sm text-center">
               <div className="bg-orange-100 text-orange-700 w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 font-bold text-sm">2</div>
               <h3 className="font-bold text-[#0F172A] text-xs uppercase tracking-wider">Approve & Credit</h3>
               <p className="text-[10px] text-[#64748B] mt-1 line-clamp-2">Manager approves return per policy. Customer gets credit note.</p>
               <button className="mt-3 text-[10px] font-bold text-orange-700 bg-orange-50 px-2 py-1.5 rounded w-full hover:bg-orange-100">To Approve (5)</button>
            </div>

            {/* Step 3: Warehouse Segregation */}
            <div className="bg-white border border-[#E2E8F0] p-3 rounded-xl shadow-sm text-center">
               <div className="bg-gray-100 text-gray-700 w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 font-bold text-sm">3</div>
               <h3 className="font-bold text-[#0F172A] text-xs uppercase tracking-wider">Segregate</h3>
               <p className="text-[10px] text-[#64748B] mt-1 line-clamp-2">Store accumulates items by company and claim type.</p>
               <button className="mt-3 text-[10px] font-bold text-gray-700 bg-gray-100 px-2 py-1.5 rounded w-full hover:bg-gray-200 border border-gray-300">In Damage WH (142)</button>
            </div>

            {/* Step 4: Company Claim */}
            <div className="bg-white border border-[#E2E8F0] p-3 rounded-xl shadow-sm text-center relative">
               <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">Action</span>
               <div className="bg-blue-100 text-blue-700 w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 font-bold text-sm">4</div>
               <h3 className="font-bold text-[#0F172A] text-xs uppercase tracking-wider">File Claim</h3>
               <p className="text-[10px] text-[#64748B] mt-1 line-clamp-2">Accountant batches claims to manufacturer with documents.</p>
               <button className="mt-3 text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-1.5 rounded w-full hover:bg-blue-100">Draft Claims (3)</button>
            </div>

            {/* Step 5: Vendor Settlement */}
            <div className="bg-white border border-[#E2E8F0] p-3 rounded-xl shadow-sm text-center">
               <div className="bg-teal-100 text-teal-700 w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 font-bold text-sm">5</div>
               <h3 className="font-bold text-[#0F172A] text-xs uppercase tracking-wider">Vendor Settlement</h3>
               <p className="text-[10px] text-[#64748B] mt-1 line-clamp-2">Company issues replacement or credit note. Reconciled.</p>
               <button className="mt-3 text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-1.5 rounded w-full hover:bg-teal-100">Pending Vendor (7)</button>
            </div>

            {/* Step 6: Destruction */}
            <div className="bg-white border border-[#E2E8F0] p-3 rounded-xl shadow-sm text-center">
               <div className="bg-purple-100 text-purple-700 w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 font-bold text-sm">6</div>
               <h3 className="font-bold text-[#0F172A] text-xs uppercase tracking-wider">Destruction</h3>
               <p className="text-[10px] text-[#64748B] mt-1 line-clamp-2">Unclaimable items destroyed; loss posted to accounts.</p>
               <button className="mt-3 text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-1.5 rounded w-full hover:bg-purple-100">To Destroy (1)</button>
            </div>
            
          </div>
        </div>
      </div>
      
      {/* Detailed Action List */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-[#E2E8F0] flex gap-4 bg-gray-50/50 items-center justify-between">
          <h2 className="font-bold text-[#0F172A]">Action Required: Reverse Logistics</h2>
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
                    <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs font-bold border border-orange-200">2. Customer Credit</span>
                 </td>
                 <td className="px-6 py-4 font-mono text-[#0F172A]">RET-2026-901</td>
                 <td className="px-6 py-4 text-[#64748B]">Shop reported 3 broken syrup bottles.</td>
                 <td className="px-6 py-4 text-right">
                    <button className="text-orange-600 font-bold hover:underline">Issue Credit Note</button>
                 </td>
              </tr>
              <tr className="hover:bg-gray-50">
                 <td className="px-6 py-4">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-bold border border-blue-200">4. File Claim</span>
                 </td>
                 <td className="px-6 py-4 font-mono text-[#0F172A]">BATCH-GSK-08</td>
                 <td className="px-6 py-4 text-[#64748B]">Damage WH accumulated Rs 45,000 of GSK goods.</td>
                 <td className="px-6 py-4 text-right">
                    <button className="text-blue-600 font-bold hover:underline">Generate Claim PDF</button>
                 </td>
              </tr>
              <tr className="hover:bg-gray-50">
                 <td className="px-6 py-4">
                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-bold border border-purple-200">6. Destruction</span>
                 </td>
                 <td className="px-6 py-4 font-mono text-[#0F172A]">DEST-004</td>
                 <td className="px-6 py-4 text-[#64748B]">Expired batch of paracetamol rejected by vendor.</td>
                 <td className="px-6 py-4 text-right">
                    <button className="text-purple-600 font-bold hover:underline">Log Destruction</button>
                 </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
