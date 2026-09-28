import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function ClaimsPage() {
  let claims: any[] = [];
  try {
    claims = await prisma.companyClaim.findMany({
      include: {
        supplier: true,
        items: true,
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
          <h1 className="text-2xl font-bold text-[#0F172A]">Company Claims & Returns</h1>
          <p className="text-sm text-[#64748B] mt-1">Manage expiry, damage, breakage claims, and destruction records.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-[#E2E8F0] hover:bg-gray-50 text-[#0F172A] px-4 py-2 rounded-md text-sm font-semibold shadow-sm transition-all">
            Destruction Records
          </button>
          <button className="bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-700 hover:to-emerald-600 text-white px-4 py-2 rounded-md text-sm font-semibold shadow-md transition-all active:scale-[0.98]">
            + Raise Claim
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm border-l-4 border-l-blue-500">
          <p className="text-sm font-medium text-[#64748B]">Draft Claims</p>
          <p className="text-2xl font-bold text-[#0F172A] mt-2">
            {claims.filter(c => c.status === 'DRAFT').length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm border-l-4 border-l-orange-500">
          <p className="text-sm font-medium text-[#64748B]">Pending with Company</p>
          <p className="text-2xl font-bold text-orange-600 mt-2">
            {claims.filter(c => c.status === 'SUBMITTED').length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm border-l-4 border-l-teal-500">
          <p className="text-sm font-medium text-[#64748B]">Settled Value (MTD)</p>
          <p className="text-2xl font-bold text-teal-700 mt-2">Rs 0</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm border-l-4 border-l-red-500">
          <p className="text-sm font-medium text-[#64748B]">Rejected Claims</p>
          <p className="text-2xl font-bold text-red-600 mt-2">
            {claims.filter(c => c.status === 'REJECTED').length}
          </p>
        </div>
      </div>

      <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-[#E2E8F0] flex gap-4 bg-gray-50/50 items-center justify-between">
          <h2 className="font-bold text-[#0F172A]">Claim Register</h2>
          <select className="border border-[#E2E8F0] rounded-md px-3 py-1.5 text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-teal-500">
            <option>All Types</option>
            <option>Expiry</option>
            <option>Damage</option>
            <option>Scheme / Rate Diff</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] uppercase tracking-wider text-xs">
              <tr>
                <th className="px-6 py-3 font-semibold">Claim # / Date</th>
                <th className="px-6 py-3 font-semibold">Principal / Supplier</th>
                <th className="px-6 py-3 font-semibold">Type</th>
                <th className="px-6 py-3 font-semibold text-right">Claim Value</th>
                <th className="px-6 py-3 font-semibold text-center">Status</th>
                <th className="px-6 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {claims.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-[#64748B]">
                    <p>No claims raised yet.</p>
                  </td>
                </tr>
              ) : (
                claims.map(claim => (
                  <tr key={claim.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-mono font-medium text-[#0F172A]">{claim.claimNumber}</div>
                      <div className="text-xs text-[#64748B]">{new Date(claim.date).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-[#0F172A]">
                      {claim.supplier?.name}
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-semibold">
                        {claim.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-mono font-bold text-[#0F172A]">
                      Rs {claim.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold
                        ${claim.status === 'SETTLED' ? 'bg-[#10B981]/10 text-[#10B981]' : 
                          claim.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                          claim.status === 'APPROVED' ? 'bg-blue-100 text-blue-700' :
                          'bg-orange-100 text-orange-700'}`}
                      >
                        {claim.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <button className="text-teal-600 hover:text-teal-800 font-medium">View</button>
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
