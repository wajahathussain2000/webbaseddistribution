import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import Link from "next/link";

export default async function ProfitAndLossPage() {
  const session = await auth();
  if (!session?.user?.id) return <div>Unauthorized</div>;

  const userTenant = await prisma.tenantUser.findFirst({
    where: { userId: session.user.id }
  });
  if (!userTenant) return <div>No tenant assigned</div>;

  // Fetch all accounts
  const accounts = await prisma.account.findMany({
    where: { tenantId: userTenant.tenantId, type: { in: ["REVENUE", "EXPENSE"] } },
    include: {
      journalEntries: true
    }
  });

  const revenueAccounts = accounts.filter(a => a.type === "REVENUE");
  const expenseAccounts = accounts.filter(a => a.type === "EXPENSE");

  const calculateBalance = (account: any) => {
    return account.journalEntries.reduce((sum: number, entry: any) => {
      // For Revenue: Credit increases balance, Debit decreases
      // For Expense: Debit increases balance, Credit decreases
      if (account.type === "REVENUE") {
        return sum + (entry.type === "CREDIT" ? entry.amount : -entry.amount);
      } else {
        return sum + (entry.type === "DEBIT" ? entry.amount : -entry.amount);
      }
    }, 0);
  };

  let totalRevenue = 0;
  const revenues = revenueAccounts.map(acc => {
    const bal = calculateBalance(acc);
    totalRevenue += bal;
    return { ...acc, balance: bal };
  }).filter(a => a.balance !== 0);

  let totalExpense = 0;
  const expenses = expenseAccounts.map(acc => {
    const bal = calculateBalance(acc);
    totalExpense += bal;
    return { ...acc, balance: bal };
  }).filter(a => a.balance !== 0);

  const netProfit = totalRevenue - totalExpense;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-end">
        <div className="flex items-center gap-4">
          <Link href="/reports" className="text-[#64748B] hover:text-[#0F172A] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[#0F172A]">Profit & Loss Statement</h1>
            <p className="text-sm text-[#64748B] mt-1">Income and Expenses summary.</p>
          </div>
        </div>
        <button onClick={() => window.print()} className="bg-white border border-[#E2E8F0] px-4 py-2 rounded-md shadow-sm text-sm font-semibold hover:bg-slate-50 transition-colors">
          Print Report
        </button>
      </div>

      <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden p-8">
        <div className="text-center mb-8 pb-8 border-b border-slate-200">
          <h2 className="text-xl font-bold uppercase tracking-widest text-slate-800">Profit & Loss</h2>
          <p className="text-slate-500 text-sm mt-1">For the current period</p>
        </div>

        <div className="space-y-8">
          {/* Revenue Section */}
          <div>
            <h3 className="text-lg font-bold text-teal-700 border-b-2 border-teal-100 pb-2 mb-4">Revenue (Income)</h3>
            <table className="w-full text-sm">
              <tbody>
                {revenues.length > 0 ? revenues.map(acc => (
                  <tr key={acc.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                    <td className="py-2.5 px-2">{acc.code} - {acc.name}</td>
                    <td className="py-2.5 px-2 text-right font-mono">Rs {acc.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  </tr>
                )) : (
                  <tr><td colSpan={2} className="py-4 text-slate-400 italic">No revenue recorded yet.</td></tr>
                )}
              </tbody>
              <tfoot>
                <tr className="bg-teal-50 font-semibold">
                  <td className="py-3 px-2">Total Revenue</td>
                  <td className="py-3 px-2 text-right font-mono text-teal-800">Rs {totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Expenses Section */}
          <div>
            <h3 className="text-lg font-bold text-rose-700 border-b-2 border-rose-100 pb-2 mb-4">Expenses (COGS & Operating)</h3>
            <table className="w-full text-sm">
              <tbody>
                {expenses.length > 0 ? expenses.map(acc => (
                  <tr key={acc.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                    <td className="py-2.5 px-2">{acc.code} - {acc.name}</td>
                    <td className="py-2.5 px-2 text-right font-mono">Rs {acc.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  </tr>
                )) : (
                  <tr><td colSpan={2} className="py-4 text-slate-400 italic">No expenses recorded yet.</td></tr>
                )}
              </tbody>
              <tfoot>
                <tr className="bg-rose-50 font-semibold">
                  <td className="py-3 px-2">Total Expenses</td>
                  <td className="py-3 px-2 text-right font-mono text-rose-800">Rs {totalExpense.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Net Profit */}
          <div className={`mt-8 p-4 rounded-lg flex justify-between items-center text-xl font-bold ${netProfit >= 0 ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
            <span>Net {netProfit >= 0 ? 'Profit' : 'Loss'}</span>
            <span className="font-mono border-b-4 border-white/30 pb-1">Rs {Math.abs(netProfit).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
