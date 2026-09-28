import Link from "next/link";

export default function PurchaseToPaymentWorkflow() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Workflow: Purchase to Payment</h1>
          <p className="text-sm text-[#64748B] mt-1">End-to-end procurement cycle: Reorder suggestions to final supplier settlement.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/purchase/new">
            <button className="bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-700 hover:to-emerald-600 text-white px-4 py-2 rounded-md text-sm font-semibold shadow-md transition-all active:scale-[0.98]">
              Start New Procurement
            </button>
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] p-6">
        <h2 className="text-lg font-bold text-[#0F172A] mb-8">Active Procurement Pipeline</h2>
        
        <div className="relative">
          {/* Connecting Line */}
          <div className="absolute top-1/2 left-4 right-4 h-1 bg-gray-100 -translate-y-1/2 z-0 hidden lg:block"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 relative z-10">
            
            {/* Step 1: AI Suggestion & PO */}
            <div className="bg-white border-2 border-teal-500 p-4 rounded-xl shadow-sm text-center">
               <div className="bg-teal-100 text-teal-700 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3 font-bold">1</div>
               <h3 className="font-bold text-[#0F172A] text-sm">Create PO</h3>
               <p className="text-xs text-[#64748B] mt-1">AI Smart Reorder suggests 14 items below threshold.</p>
               <button className="mt-4 text-xs font-bold text-teal-700 bg-teal-50 px-3 py-1.5 rounded-md hover:bg-teal-100 w-full">Draft POs (3)</button>
            </div>

            {/* Step 2: Approval */}
            <div className="bg-white border border-[#E2E8F0] p-4 rounded-xl shadow-sm text-center">
               <div className="bg-orange-100 text-orange-700 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3 font-bold">2</div>
               <h3 className="font-bold text-[#0F172A] text-sm">Manager Approval</h3>
               <p className="text-xs text-[#64748B] mt-1">POs above $500 require GM sign-off before dispatch.</p>
               <button className="mt-4 text-xs font-bold text-orange-700 bg-orange-50 px-3 py-1.5 rounded-md hover:bg-orange-100 w-full">Pending (1)</button>
            </div>

            {/* Step 3: GRN & Expiry */}
            <div className="bg-white border border-[#E2E8F0] p-4 rounded-xl shadow-sm text-center">
               <div className="bg-purple-100 text-purple-700 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3 font-bold">3</div>
               <h3 className="font-bold text-[#0F172A] text-sm">Goods Receipt (GRN)</h3>
               <p className="text-xs text-[#64748B] mt-1">Storekeeper enters batches, expiries, and checks quantities.</p>
               <button className="mt-4 text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1.5 rounded-md hover:bg-purple-100 w-full">In Transit (4)</button>
            </div>

            {/* Step 4: 3-Way Match & Invoice */}
            <div className="bg-white border border-[#E2E8F0] p-4 rounded-xl shadow-sm text-center opacity-50">
               <div className="bg-gray-100 text-gray-700 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3 font-bold">4</div>
               <h3 className="font-bold text-[#0F172A] text-sm">3-Way Match</h3>
               <p className="text-xs text-[#64748B] mt-1">System automatically verifies PO vs GRN vs Invoice.</p>
               <button className="mt-4 text-xs font-bold text-gray-600 bg-gray-100 px-3 py-1.5 rounded-md w-full" disabled>Ready (0)</button>
            </div>

            {/* Step 5: Payment */}
            <div className="bg-white border border-[#E2E8F0] p-4 rounded-xl shadow-sm text-center">
               <div className="bg-blue-100 text-blue-700 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3 font-bold">5</div>
               <h3 className="font-bold text-[#0F172A] text-sm">Settle Payment</h3>
               <p className="text-xs text-[#64748B] mt-1">Accountant processes payment & deducts withholding tax.</p>
               <button className="mt-4 text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1.5 rounded-md hover:bg-blue-100 w-full">Due Invoices (2)</button>
            </div>
            
          </div>
        </div>
      </div>
      
      {/* Detailed Action List */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-[#E2E8F0] flex gap-4 bg-gray-50/50 items-center justify-between">
          <h2 className="font-bold text-[#0F172A]">Pending Actions in Cycle</h2>
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
                    <span className="bg-teal-100 text-teal-800 px-2 py-1 rounded text-xs font-bold">1. Draft PO</span>
                 </td>
                 <td className="px-6 py-4 font-mono text-[#0F172A]">AI-SUGGEST-09</td>
                 <td className="px-6 py-4 text-[#64748B]">Panadol Extra (200 boxes) below reorder level.</td>
                 <td className="px-6 py-4 text-right">
                    <button className="text-teal-600 font-bold hover:underline">Review & Convert to PO</button>
                 </td>
              </tr>
              <tr className="hover:bg-gray-50">
                 <td className="px-6 py-4">
                    <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs font-bold">2. Approval</span>
                 </td>
                 <td className="px-6 py-4 font-mono text-[#0F172A]">PO-2026-0041</td>
                 <td className="px-6 py-4 text-[#64748B]">Order value Rs 150,000 exceeds auto-approve limit.</td>
                 <td className="px-6 py-4 text-right">
                    <button className="text-orange-600 font-bold hover:underline">Manager Sign-off</button>
                 </td>
              </tr>
              <tr className="hover:bg-gray-50">
                 <td className="px-6 py-4">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-bold">5. Payment</span>
                 </td>
                 <td className="px-6 py-4 font-mono text-[#0F172A]">INV-SUP-992</td>
                 <td className="px-6 py-4 text-[#64748B]">Matched with GRN-881. Due for payment today.</td>
                 <td className="px-6 py-4 text-right">
                    <button className="text-blue-600 font-bold hover:underline">Schedule Payment</button>
                 </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
