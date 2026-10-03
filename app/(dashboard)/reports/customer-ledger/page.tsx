import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export default async function CustomerLedgerPage({
  searchParams,
}: {
  searchParams: { customerId?: string };
}) {
  const session = await auth();
  if (!session?.user?.id) return <div>Unauthorized</div>;

  const userTenant = await prisma.tenantUser.findFirst({
    where: { userId: session.user.id },
  });
  if (!userTenant) return <div>No tenant assigned</div>;

  const customers = await prisma.customer.findMany({
    where: { tenantId: userTenant.tenantId },
  });

  const selectedCustomerId = searchParams.customerId || (customers.length > 0 ? customers[0].id : null);

  let ledgerEntries: any[] = [];
  let runningBalance = 0;

  if (selectedCustomerId) {
    // Fetch all journal entries for this customer (Subledger tracking via costCentreId)
    const entries = await prisma.journalEntry.findMany({
      where: {
        voucher: { tenantId: userTenant.tenantId },
        costCentreId: selectedCustomerId,
      },
      include: {
        voucher: true,
        account: true,
      },
      orderBy: { voucher: { date: 'asc' } },
    });

    // Calculate running balance (Debit increases receivables balance, Credit decreases it)
    ledgerEntries = entries.map((entry) => {
      if (entry.type === "DEBIT") runningBalance += entry.amount;
      if (entry.type === "CREDIT") runningBalance -= entry.amount;
      return { ...entry, runningBalance };
    });
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Customer Ledger (A/R)</h1>
          <p className="text-sm text-[#64748B]">
            Track all financial transactions, invoices, and payments for a specific customer.
          </p>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white p-4 border border-[#E2E8F0] rounded-xl shadow-sm">
        <form className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="text-sm font-semibold text-[#0F172A] block mb-1">Select Customer</label>
            <select
              name="customerId"
              defaultValue={selectedCustomerId || ""}
              className="w-full px-3 py-2 border border-[#E2E8F0] rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
            >
              <option value="">-- Choose a Customer --</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} {c.shopName ? `(${c.shopName})` : ""}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-slate-900 text-white text-sm font-semibold rounded-md hover:bg-slate-800 transition-colors"
          >
            Generate Ledger
          </button>
        </form>
      </div>

      {/* Ledger Table */}
      {selectedCustomerId && (
        <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B]">
              <tr>
                <th className="px-4 py-3 font-semibold">Date</th>
                <th className="px-4 py-3 font-semibold">Voucher #</th>
                <th className="px-4 py-3 font-semibold w-1/3">Particulars / Notes</th>
                <th className="px-4 py-3 font-semibold text-right">Debit (Rs)</th>
                <th className="px-4 py-3 font-semibold text-right">Credit (Rs)</th>
                <th className="px-4 py-3 font-semibold text-right">Balance</th>
              </tr>
            </thead>
            <tbody>
              {ledgerEntries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    No transactions found for this customer.
                  </td>
                </tr>
              ) : (
                ledgerEntries.map((entry) => (
                  <tr key={entry.id} className="border-b border-[#E2E8F0] hover:bg-slate-50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      {new Date(entry.voucher.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-500">
                      {entry.voucher.referenceNumber}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-900">{entry.notes || "-"}</div>
                      <div className="text-xs text-slate-500">
                        Acc: {entry.account?.name || entry.accountId}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-teal-600">
                      {entry.type === "DEBIT" ? entry.amount.toFixed(2) : "-"}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-rose-600">
                      {entry.type === "CREDIT" ? entry.amount.toFixed(2) : "-"}
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-slate-900 bg-slate-50/50">
                      {entry.runningBalance.toFixed(2)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {ledgerEntries.length > 0 && (
              <tfoot className="bg-slate-900 text-white">
                <tr>
                  <td colSpan={3} className="px-4 py-3 text-right font-bold">Closing Balance:</td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-teal-400">
                    {ledgerEntries.filter(e => e.type === "DEBIT").reduce((s, e) => s + e.amount, 0).toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-rose-400">
                    {ledgerEntries.filter(e => e.type === "CREDIT").reduce((s, e) => s + e.amount, 0).toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-white text-lg">
                    Rs {runningBalance.toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      )}
    </div>
  );
}
