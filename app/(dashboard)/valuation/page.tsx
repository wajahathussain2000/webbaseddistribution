import { prisma } from "@/lib/prisma";

export default async function CostLayersReportPage() {
  let layers: any[] = [];
  try {
    layers = await prisma.costLayer.findMany({
      include: {
        product: true,
        batch: true,
        warehouse: true
      },
      orderBy: { date: 'desc' },
      take: 50
    });
  } catch (e) {
    console.error("Prisma error:", e);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Cost Layers & Valuation</h1>
          <p className="text-sm text-[#64748B] mt-1">Track purchase layers used for FIFO, LIFO, and FEFO calculations.</p>
        </div>
      </div>

      <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] uppercase tracking-wider text-xs">
              <tr>
                <th className="px-6 py-3 font-semibold">Date</th>
                <th className="px-6 py-3 font-semibold">Product</th>
                <th className="px-6 py-3 font-semibold">Method</th>
                <th className="px-6 py-3 font-semibold">Batch</th>
                <th className="px-6 py-3 font-semibold">Source Doc</th>
                <th className="px-6 py-3 font-semibold text-right">Orig. Qty</th>
                <th className="px-6 py-3 font-semibold text-right text-teal-700">Rem. Qty</th>
                <th className="px-6 py-3 font-semibold text-right">Unit Cost</th>
                <th className="px-6 py-3 font-semibold text-right">Total Val.</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {layers.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-10 text-center text-[#64748B]">
                    <div className="flex flex-col items-center justify-center">
                      <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p>No Cost Layers found yet.</p>
                      <p className="text-xs mt-1">Cost layers are automatically created when you receive a Purchase Order (GRN).</p>
                    </div>
                  </td>
                </tr>
              ) : (
                layers.map((layer) => (
                  <tr key={layer.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-[#0F172A]">{new Date(layer.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 font-medium text-[#0F172A]">{layer.product?.nameEn}</td>
                    <td className="px-6 py-4 text-xs font-semibold text-indigo-700">
                      <span className="bg-indigo-100 px-2 py-1 rounded-md">{layer.product?.valuationMethod || 'FIFO'}</span>
                    </td>
                    <td className="px-6 py-4 text-[#64748B]">{layer.batch?.batchNumber || '-'}</td>
                    <td className="px-6 py-4 font-mono text-sm text-[#0F172A]">{layer.documentId}</td>
                    <td className="px-6 py-4 text-right">{layer.qtyOriginal}</td>
                    <td className="px-6 py-4 text-right font-bold text-teal-700">{layer.qtyRemaining}</td>
                    <td className="px-6 py-4 text-right font-mono text-[#0F172A]">Rs {layer.unitCost.toFixed(2)}</td>
                    <td className="px-6 py-4 text-right font-mono font-bold text-[#0F172A]">Rs {layer.totalCost.toFixed(2)}</td>
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
