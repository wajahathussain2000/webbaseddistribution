import Link from "next/link";

export default function CreditRecoveryWorkflow() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Workflow: Credit Recovery</h1>
          <p className="text-sm text-[#64748B] mt-1">Manage overdue customer balances, bounced cheques, and legal write-offs.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-[#E2E8F0] hover:bg-gray-50 text-[#0F172A] px-4 py-2 rounded-md text-sm font-semibold shadow-sm transition-all flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            Print Aging Report
          </button>
          <Link href="/finance/receipt">
            <button className="bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-700 hover:to-emerald-600 text-white px-4 py-2 rounded-md text-sm font-semibold shadow-md transition-all active:scale-[0.98]">
              Log Cash Receipt
            </button>
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] p-6">
        <h2 className="text-lg font-bold text-[#0F172A] mb-8">Receivables & Recovery Pipeline</h2>
        
        <div className="relative">
          {/* Connecting Line */}
          <div className="absolute top-1/2 left-4 right-4 h-1 bg-gray-100 -translate-y-1/2 z-0 hidden lg:block"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-3 relative z-10">
            
            {/* Step 1: Aging Analysis */}
            <div className="bg-white border-2 border-indigo-500 p-3 rounded-xl shadow-sm text-center">
               <div className="bg-indigo-100 text-indigo-700 w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 font-bold text-sm">1</div>
               <h3 className="font-bold text-[#0F172A] text-xs uppercase tracking-wider">Aging Report</h3>
               <p className="text-[10px] text-[#64748B] mt-1 line-clamp-2">System flags overdue invoices and generates daily recovery list.</p>
               <button className="mt-3 text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-1.5 rounded w-full border border-indigo-200">View Overdue (12)</button>
            </div>

            {/* Step 2: Auto-Reminders */}
            <div className="bg-white border border-[#E2E8F0] p-3 rounded-xl shadow-sm text-center">
               <div className="bg-orange-100 text-orange-700 w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 font-bold text-sm">2</div>
               <h3 className="font-bold text-[#0F172A] text-xs uppercase tracking-wider">Auto Reminders</h3>
               <p className="text-[10px] text-[#64748B] mt-1 line-clamp-2">WhatsApp / SMS sent automatically before & after due dates.</p>
               <button className="mt-3 text-[10px] font-bold text-orange-700 bg-orange-50 px-2 py-1.5 rounded w-full hover:bg-orange-100">Sent Today (8)</button>
            </div>

            {/* Step 3: Field Recovery */}
            <div className="bg-white border border-[#E2E8F0] p-3 rounded-xl shadow-sm text-center">
               <div className="bg-teal-100 text-teal-700 w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 font-bold text-sm">3</div>
               <h3 className="font-bold text-[#0F172A] text-xs uppercase tracking-wider">Field Recovery</h3>
               <p className="text-[10px] text-[#64748B] mt-1 line-clamp-2">Officer visits, collects cash/cheque, or logs Promise to Pay.</p>
               <button className="mt-3 text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-1.5 rounded w-full hover:bg-teal-100 border border-teal-200">Promises Logged (4)</button>
            </div>

            {/* Step 4: Receipt Matching */}
            <div className="bg-white border border-[#E2E8F0] p-3 rounded-xl shadow-sm text-center">
               <div className="bg-blue-100 text-blue-700 w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 font-bold text-sm">4</div>
               <h3 className="font-bold text-[#0F172A] text-xs uppercase tracking-wider">Receipt Match</h3>
               <p className="text-[10px] text-[#64748B] mt-1 line-clamp-2">Payment matched to specific invoices. WhatsApp receipt sent.</p>
               <button className="mt-3 text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-1.5 rounded w-full hover:bg-blue-100">Pending Match (2)</button>
            </div>

            {/* Step 5: Bounce / Penalty */}
            <div className="bg-white border border-[#E2E8F0] p-3 rounded-xl shadow-sm text-center relative">
               <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">Alert</span>
               <div className="bg-red-100 text-red-700 w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 font-bold text-sm">5</div>
               <h3 className="font-bold text-[#0F172A] text-xs uppercase tracking-wider">Bounce & Block</h3>
               <p className="text-[10px] text-[#64748B] mt-1 line-clamp-2">If cheque bounces, receipt is reversed, penalty added, customer blocked.</p>
               <button className="mt-3 text-[10px] font-bold text-red-700 bg-red-50 px-2 py-1.5 rounded w-full hover:bg-red-100">Bounced (1)</button>
            </div>

            {/* Step 6: Legal / Write-Off */}
            <div className="bg-white border border-[#E2E8F0] p-3 rounded-xl shadow-sm text-center">
               <div className="bg-gray-100 text-gray-700 w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 font-bold text-sm">6</div>
               <h3 className="font-bold text-[#0F172A] text-xs uppercase tracking-wider">Legal / Write-off</h3>
               <p className="text-[10px] text-[#64748B] mt-1 line-clamp-2">Unrecoverable balances go to legal notice or approved write-off.</p>
               <button className="mt-3 text-[10px] font-bold text-gray-700 bg-gray-100 px-2 py-1.5 rounded w-full">Pending Approval</button>
            </div>
            
          </div>
        </div>
      </div>
      
      {/* Detailed Action List */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-[#E2E8F0] flex gap-4 bg-gray-50/50 items-center justify-between">
          <h2 className="font-bold text-[#0F172A]">Action Required: Recovery Queue</h2>
        </div>
        <div className="p-0">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] uppercase tracking-wider text-xs">
              <tr>
                <th className="px-6 py-3 font-semibold">Stage</th>
                <th className="px-6 py-3 font-semibold">Customer Reference</th>
                <th className="px-6 py-3 font-semibold">Details</th>
                <th className="px-6 py-3 font-semibold text-right">Action Needed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              <tr className="hover:bg-gray-50">
                 <td className="px-6 py-4">
                    <span className="bg-teal-100 text-teal-800 px-2 py-1 rounded text-xs font-bold border border-teal-200">3. Promise To Pay</span>
                 </td>
                 <td className="px-6 py-4 font-mono text-[#0F172A]">CUST-414 (Ali Mart)</td>
                 <td className="px-6 py-4 text-[#64748B]">Promise date is today (Rs 25,000).</td>
                 <td className="px-6 py-4 text-right">
                    <button className="text-teal-600 font-bold hover:underline">Dispatch Officer</button>
                 </td>
              </tr>
              <tr className="hover:bg-gray-50">
                 <td className="px-6 py-4">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-bold border border-blue-200">4. Receipt Matching</span>
                 </td>
                 <td className="px-6 py-4 font-mono text-[#0F172A]">REC-2026-081</td>
                 <td className="px-6 py-4 text-[#64748B]">Rs 50,000 bank transfer received from MedPlus.</td>
                 <td className="px-6 py-4 text-right">
                    <button className="text-blue-600 font-bold hover:underline">Match to Invoices</button>
                 </td>
              </tr>
              <tr className="hover:bg-gray-50">
                 <td className="px-6 py-4">
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-bold border border-red-200">5. Cheque Bounce</span>
                 </td>
                 <td className="px-6 py-4 font-mono text-[#0F172A]">CHQ-009912 (City Pharmacy)</td>
                 <td className="px-6 py-4 text-[#64748B]">Cheque returned: Insufficient Funds. Rs 110,000.</td>
                 <td className="px-6 py-4 text-right">
                    <button className="text-red-600 font-bold hover:underline">Reverse & Block</button>
                 </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
