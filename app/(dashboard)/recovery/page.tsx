import { prisma } from "@/lib/prisma";
import Link from "next/link";
import AddReceiptModal from "@/app/components/AddReceiptModal";

export default async function RecoveryPage() {
  let receipts: any[] = [];
  try {
    receipts = await prisma.customerReceipt.findMany({
      include: {
        customer: true,
      },
      orderBy: { date: 'desc' },
      take: 20
    });
  } catch (err) {
    console.error("Prisma error:", err);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Credit & Recovery</h1>
          <p className="text-sm text-[#64748B] mt-1">Manage collections, PDCs, bad debts, and promise-to-pay tracking.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-[#E2E8F0] hover:bg-gray-50 text-[#0F172A] px-4 py-2 rounded-md text-sm font-semibold shadow-sm transition-all">
            PDC Register
          </button>
          <AddReceiptModal />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm border-l-4 border-l-teal-500">
          <p className="text-sm font-medium text-[#64748B]">Collections Today</p>
          <p className="text-2xl font-bold text-teal-700 mt-2">Rs 0</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm border-l-4 border-l-blue-500">
          <p className="text-sm font-medium text-[#64748B]">Upcoming PDCs</p>
          <p className="text-2xl font-bold text-blue-600 mt-2">0</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm border-l-4 border-l-orange-500">
          <p className="text-sm font-medium text-[#64748B]">Promises Broken</p>
          <p className="text-2xl font-bold text-orange-600 mt-2">0</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm border-l-4 border-l-red-500">
          <p className="text-sm font-medium text-[#64748B]">Bounced Cheques</p>
          <p className="text-2xl font-bold text-red-600 mt-2">0</p>
        </div>
      </div>

      <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-[#E2E8F0] bg-gray-50/50 flex justify-between items-center">
          <h2 className="font-bold text-[#0F172A]">Recent Receipts & Collections</h2>
          <select className="border border-[#E2E8F0] rounded-md px-3 py-1.5 text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-teal-500">
            <option>All Methods</option>
            <option>Cash</option>
            <option>Cheque (PDC)</option>
            <option>Transfer</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] uppercase tracking-wider text-xs">
              <tr>
                <th className="px-6 py-3 font-semibold">Receipt #</th>
                <th className="px-6 py-3 font-semibold">Date</th>
                <th className="px-6 py-3 font-semibold">Customer</th>
                <th className="px-6 py-3 font-semibold">Method</th>
                <th className="px-6 py-3 font-semibold text-right">Amount</th>
                <th className="px-6 py-3 font-semibold text-center">Status</th>
                <th className="px-6 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {receipts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-[#64748B]">
                    <p>No collections found yet.</p>
                  </td>
                </tr>
              ) : (
                receipts.map(receipt => (
                  <tr key={receipt.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-mono text-sm text-[#0F172A]">{receipt.receiptNumber}</td>
                    <td className="px-6 py-4 text-[#64748B]">{new Date(receipt.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 font-semibold text-[#0F172A]">{receipt.customer?.name}</td>
                    <td className="px-6 py-4">
                      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-semibold">
                        {receipt.paymentMethod}
                      </span>
                      {receipt.reference && <span className="ml-2 text-xs text-[#64748B]">({receipt.reference})</span>}
                    </td>
                    <td className="px-6 py-4 text-right font-mono font-bold text-teal-700">
                      Rs {receipt.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold
                        ${receipt.status === 'CLEARED' ? 'bg-[#10B981]/10 text-[#10B981]' : 
                          receipt.status === 'BOUNCED' ? 'bg-red-100 text-red-700' :
                          'bg-orange-100 text-orange-700'}`}
                      >
                        {receipt.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <button className="text-teal-600 hover:text-teal-800 font-medium">Allocate</button>
                      <button className="text-indigo-600 hover:text-indigo-800 font-medium">Print</button>
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
