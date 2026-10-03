import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import Link from "next/link";

export default async function TrialBalancePage() {
  const session = await auth();
  if (!session?.user?.id) return <div>Unauthorized</div>;

  const userTenant = await prisma.tenantUser.findFirst({
    where: { userId: session.user.id },
  });
  if (!userTenant) return <div>No tenant assigned</div>;

  // Fetch all accounts
  const accounts = await prisma.account.findMany({
    where: { tenantId: userTenant.tenantId },
    orderBy: { type: 'asc' }
  });

  // Fetch all journal entries for this tenant
  const entries = await prisma.journalEntry.findMany({
    where: { voucher: { tenantId: userTenant.tenantId } },
  });

  // Aggregate
  let totalDebit = 0;
  let totalCredit = 0;

  const tbData = accounts.map(acc => {
    const accEntries = entries.filter(e => e.accountId === acc.id);
    const debitSum = accEntries.filter(e => e.type === "DEBIT").reduce((s, e) => s + e.amount, 0);
    const creditSum = accEntries.filter(e => e.type === "CREDIT").reduce((s, e) => s + e.amount, 0);
    
    // Balance depends on account type. ASSET/EXPENSE are Debit natural. LIABILITY/EQUITY/REVENUE are Credit natural.
    let balance = 0;
    if (acc.type === "ASSET" || acc.type === "EXPENSE") {
      balance = debitSum - creditSum;
    } else {
      balance = creditSum - debitSum;
    }

    totalDebit += debitSum;
    totalCredit += creditSum;

    return { ...acc, debitSum, creditSum, balance };
  }).filter(acc => acc.debitSum > 0 || acc.creditSum > 0 || acc.balance !== 0); // Hide empty accounts

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center border-b border-[#E2E8F0] pb-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Trial Balance</h1>
          <p className="text-sm text-[#64748B]">Real-time summary of all general ledger accounts.</p>
        </div>
      </div>

      <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B]">
            <tr>
              <th className="px-4 py-3 font-semibold">Account Code</th>
              <th className="px-4 py-3 font-semibold">Account Name</th>
              <th className="px-4 py-3 font-semibold">Type</th>
              <th className="px-4 py-3 font-semibold text-right">Debit (Rs)</th>
              <th className="px-4 py-3 font-semibold text-right">Credit (Rs)</th>
              <th className="px-4 py-3 font-semibold text-right">Closing Balance</th>
            </tr>
          </thead>
          <tbody>
            {tbData.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500">No transactions recorded yet.</td>
              </tr>
            ) : (
              tbData.map((acc) => (
                <tr key={acc.id} className="border-b border-[#E2E8F0] hover:bg-slate-50">
                  <td className="px-4 py-3 font-mono text-slate-500">{acc.code}</td>
                  <td className="px-4 py-3 font-medium text-slate-900">{acc.name}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded font-medium">{acc.type}</span>
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-teal-600">{acc.debitSum > 0 ? acc.debitSum.toFixed(2) : "-"}</td>
                  <td className="px-4 py-3 text-right font-mono text-rose-600">{acc.creditSum > 0 ? acc.creditSum.toFixed(2) : "-"}</td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-slate-900">{acc.balance.toFixed(2)}</td>
                </tr>
              ))
            )}
          </tbody>
          {tbData.length > 0 && (
            <tfoot className="bg-slate-900 text-white">
              <tr>
                <td colSpan={3} className="px-4 py-3 text-right font-bold uppercase tracking-wider text-xs">Grand Totals:</td>
                <td className="px-4 py-3 text-right font-mono font-bold text-teal-400">{totalDebit.toFixed(2)}</td>
                <td className="px-4 py-3 text-right font-mono font-bold text-rose-400">{totalCredit.toFixed(2)}</td>
                <td className="px-4 py-3 text-right font-mono font-bold text-white">
                  {totalDebit.toFixed(2) === totalCredit.toFixed(2) ? "TALLIED" : "MISMATCH"}
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}
