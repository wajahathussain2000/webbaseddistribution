import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import Link from "next/link";

export default async function BalanceSheetPage() {
  const session = await auth();
  if (!session?.user?.id) return <div>Unauthorized</div>;

  const userTenant = await prisma.tenantUser.findFirst({
    where: { userId: session.user.id }
  });
  if (!userTenant) return <div>No tenant assigned</div>;

  // Fetch all accounts
  const accounts = await prisma.account.findMany({
    where: { tenantId: userTenant.tenantId },
    include: {
      journalEntries: true
    }
  });

  const calculateBalance = (account: any) => {
    return account.journalEntries.reduce((sum: number, entry: any) => {
      if (account.type === "ASSET" || account.type === "EXPENSE") {
        return sum + (entry.type === "DEBIT" ? entry.amount : -entry.amount);
      } else { // LIABILITY, EQUITY, REVENUE
        return sum + (entry.type === "CREDIT" ? entry.amount : -entry.amount);
      }
    }, 0);
  };

  // Group Accounts
  let totalAssets = 0;
  const assets = accounts.filter(a => a.type === "ASSET").map(acc => {
    const bal = calculateBalance(acc);
    totalAssets += bal;
    return { ...acc, balance: bal };
  }).filter(a => a.balance !== 0);

  let totalLiabilities = 0;
  const liabilities = accounts.filter(a => a.type === "LIABILITY").map(acc => {
    const bal = calculateBalance(acc);
    totalLiabilities += bal;
    return { ...acc, balance: bal };
  }).filter(a => a.balance !== 0);

  let totalEquity = 0;
  const equities = accounts.filter(a => a.type === "EQUITY").map(acc => {
    const bal = calculateBalance(acc);
    totalEquity += bal;
    return { ...acc, balance: bal };
  }).filter(a => a.balance !== 0);

  // Calculate Net Income (Revenue - Expenses) which rolls into Equity
  let totalRevenue = 0;
  let totalExpense = 0;
  accounts.forEach(acc => {
    const bal = calculateBalance(acc);
    if (acc.type === "REVENUE") totalRevenue += bal;
    if (acc.type === "EXPENSE") totalExpense += bal;
  });
  const netIncome = totalRevenue - totalExpense;

  const totalLiabilitiesAndEquity = totalLiabilities + totalEquity + netIncome;

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
            <h1 className="text-2xl font-bold text-[#0F172A]">Balance Sheet</h1>
            <p className="text-sm text-[#64748B] mt-1">Snapshot of Assets, Liabilities, and Equity.</p>
          </div>
        </div>
        <button onClick={() => window.print()} className="bg-white border border-[#E2E8F0] px-4 py-2 rounded-md shadow-sm text-sm font-semibold hover:bg-slate-50 transition-colors">
          Print Report
        </button>
      </div>

      <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden p-8">
        <div className="text-center mb-8 pb-8 border-b border-slate-200">
          <h2 className="text-xl font-bold uppercase tracking-widest text-slate-800">Balance Sheet</h2>
          <p className="text-slate-500 text-sm mt-1">As of {new Date().toLocaleDateString()}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Left Side: Assets */}
          <div>
            <h3 className="text-lg font-bold text-slate-800 border-b-2 border-slate-200 pb-2 mb-4">Assets</h3>
            <table className="w-full text-sm">
              <tbody>
                {assets.length > 0 ? assets.map(acc => (
                  <tr key={acc.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                    <td className="py-2.5 px-2">{acc.code} - {acc.name}</td>
                    <td className="py-2.5 px-2 text-right font-mono">Rs {acc.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  </tr>
                )) : (
                  <tr><td colSpan={2} className="py-4 text-slate-400 italic">No assets recorded.</td></tr>
                )}
              </tbody>
              <tfoot>
                <tr className="bg-slate-100 font-bold border-t-2 border-slate-300">
                  <td className="py-3 px-2 text-slate-800 uppercase text-xs tracking-wider">Total Assets</td>
                  <td className="py-3 px-2 text-right font-mono text-slate-900 border-double border-b-4 border-slate-400">
                    Rs {totalAssets.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Right Side: Liabilities & Equity */}
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-bold text-slate-800 border-b-2 border-slate-200 pb-2 mb-4">Liabilities</h3>
              <table className="w-full text-sm">
                <tbody>
                  {liabilities.length > 0 ? liabilities.map(acc => (
                    <tr key={acc.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                      <td className="py-2.5 px-2">{acc.code} - {acc.name}</td>
                      <td className="py-2.5 px-2 text-right font-mono">Rs {acc.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    </tr>
                  )) : (
                    <tr><td colSpan={2} className="py-4 text-slate-400 italic">No liabilities recorded.</td></tr>
                  )}
                </tbody>
                <tfoot>
                  <tr className="bg-slate-50 font-semibold">
                    <td className="py-3 px-2">Total Liabilities</td>
                    <td className="py-3 px-2 text-right font-mono text-slate-700">Rs {totalLiabilities.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-800 border-b-2 border-slate-200 pb-2 mb-4">Equity</h3>
              <table className="w-full text-sm">
                <tbody>
                  {equities.map(acc => (
                    <tr key={acc.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-2.5 px-2">{acc.code} - {acc.name}</td>
                      <td className="py-2.5 px-2 text-right font-mono">Rs {acc.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    </tr>
                  ))}
                  <tr className="border-b border-slate-100 hover:bg-slate-50 text-emerald-700 font-medium">
                    <td className="py-2.5 px-2">Retained Earnings (Net Income)</td>
                    <td className="py-2.5 px-2 text-right font-mono">Rs {netIncome.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr className="bg-slate-50 font-semibold">
                    <td className="py-3 px-2">Total Equity</td>
                    <td className="py-3 px-2 text-right font-mono text-slate-700">Rs {(totalEquity + netIncome).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <table className="w-full text-sm mt-4">
              <tfoot>
                <tr className="bg-slate-100 font-bold border-t-2 border-slate-300">
                  <td className="py-3 px-2 text-slate-800 uppercase text-xs tracking-wider">Total Liab. & Equity</td>
                  <td className="py-3 px-2 text-right font-mono text-slate-900 border-double border-b-4 border-slate-400">
                    Rs {totalLiabilitiesAndEquity.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Balance Check */}
        <div className={`mt-12 text-center p-3 text-sm font-semibold rounded-lg ${Math.abs(totalAssets - totalLiabilitiesAndEquity) < 0.01 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {Math.abs(totalAssets - totalLiabilitiesAndEquity) < 0.01 
            ? "✅ Balance Sheet is Balanced." 
            : `❌ Unbalanced! Difference: Rs ${Math.abs(totalAssets - totalLiabilitiesAndEquity).toLocaleString()}`}
        </div>
      </div>
    </div>
  );
}
