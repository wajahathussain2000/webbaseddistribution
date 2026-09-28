import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function ProductsPage() {
  // Fetch products, categories, and brands to display.
  // Assuming a single tenant architecture for the demo.
  let products = [];
  try {
    products = await prisma.product.findMany({
      include: { category: true, brand: true, baseUom: true },
      take: 50,
    });
  } catch (err) {
    console.error("Prisma query failed. You may need to run npx prisma generate", err);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Product Master</h1>
          <p className="text-sm text-[#64748B] mt-1">Manage all your Pharmacy and FMCG items in one place.</p>
        </div>
        <Link href="/products/new" className="bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-700 hover:to-emerald-600 text-white px-4 py-2 rounded-md text-sm font-semibold shadow-md transition-all active:scale-[0.98]">
          + Add Product
        </Link>
      </div>

      <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-[#E2E8F0] flex gap-4 bg-gray-50/50">
          <div className="flex-1 max-w-md relative">
            <input 
              type="text" 
              placeholder="Search products by code, name, or generic..." 
              className="w-full pl-10 pr-4 py-2 border border-[#E2E8F0] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-[#0F172A]"
            />
            <div className="absolute left-3 top-2.5 text-[#64748B]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          <select className="border border-[#E2E8F0] rounded-md px-3 py-2 text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-teal-500">
            <option value="">All Types</option>
            <option value="PHARMACY">Pharmacy</option>
            <option value="FMCG">FMCG</option>
          </select>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] uppercase tracking-wider text-xs">
              <tr>
                <th className="px-6 py-3 font-semibold">Code</th>
                <th className="px-6 py-3 font-semibold">Product Name</th>
                <th className="px-6 py-3 font-semibold">Type</th>
                <th className="px-6 py-3 font-semibold">Category</th>
                <th className="px-6 py-3 font-semibold">Base UOM</th>
                <th className="px-6 py-3 font-semibold text-right">Trade Price</th>
                <th className="px-6 py-3 font-semibold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-[#64748B]">
                    No products found. Start by adding a new product.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-teal-50/50 transition-colors cursor-pointer group">
                    <td className="px-6 py-4 font-mono text-[#0F172A]">{product.code}</td>
                    <td className="px-6 py-4 font-medium text-teal-800 group-hover:underline">
                      {product.nameEn}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${product.type === 'PHARMACY' ? 'bg-teal-100 text-teal-800' : 'bg-orange-100 text-orange-800'}`}>
                        {product.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[#64748B]">{product.category?.name || '-'}</td>
                    <td className="px-6 py-4 text-[#64748B]">{product.baseUom?.code || '-'}</td>
                    <td className="px-6 py-4 text-right font-mono text-[#0F172A]">{product.tradePrice.toFixed(2)}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${product.isActive ? 'bg-[#10B981]/10 text-[#10B981]' : 'bg-[#EF4444]/10 text-[#EF4444]'}`}>
                        {product.isActive ? 'Active' : 'Inactive'}
                      </span>
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
