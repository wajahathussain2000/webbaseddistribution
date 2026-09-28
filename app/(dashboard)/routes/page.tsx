import { prisma } from "@/lib/prisma";
import Link from "next/link";
import DemoAlertButton from "@/app/components/DemoAlertButton";

export default async function RoutesPage() {
  let routes: any[] = [];
  let territories: any[] = [];
  try {
    routes = await prisma.route.findMany({
      include: {
        territory: true,
        _count: {
          select: { salesCustomers: true, deliveryCustomers: true }
        }
      },
      orderBy: { name: 'asc' },
      take: 20
    });
    
    territories = await prisma.territory.findMany({
      where: { parentId: null },
      include: { children: true }
    });
  } catch (err) {
    console.error("Prisma error:", err);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Routes & Territories</h1>
          <p className="text-sm text-[#64748B] mt-1">Manage geographic hierarchy, salesman assignments, and journey plans.</p>
        </div>
        <div className="flex gap-3">
          <DemoAlertButton message="Territory Tree visualizer is currently disabled in the demo environment." className="bg-white border border-[#E2E8F0] hover:bg-gray-50 text-[#0F172A] px-4 py-2 rounded-md text-sm font-semibold shadow-sm transition-all">
            Territory Tree
          </DemoAlertButton>
          <Link href="/routes/new" className="bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-700 hover:to-emerald-600 text-white px-4 py-2 rounded-md text-sm font-semibold shadow-md transition-all active:scale-[0.98]">
            + Create Route
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm border-l-4 border-l-blue-500">
          <p className="text-sm font-medium text-[#64748B]">Total Territories</p>
          <p className="text-2xl font-bold text-[#0F172A] mt-2">{territories.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm border-l-4 border-l-teal-500">
          <p className="text-sm font-medium text-[#64748B]">Active Routes</p>
          <p className="text-2xl font-bold text-teal-700 mt-2">{routes.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm border-l-4 border-l-orange-500">
          <p className="text-sm font-medium text-[#64748B]">Unassigned Shops</p>
          <p className="text-2xl font-bold text-orange-600 mt-2">0</p>
        </div>
        <div className="bg-gradient-to-br from-indigo-900 to-slate-800 p-6 rounded-xl shadow-md text-white relative overflow-hidden">
          <div className="absolute right-[-20px] top-[-20px] opacity-10">
             <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          </div>
          <p className="text-sm font-medium text-indigo-200">AI Route Rebalancing</p>
          <button className="mt-3 text-xs font-bold bg-white text-indigo-900 px-3 py-1.5 rounded hover:bg-gray-100 transition-colors">
            Optimize Coverage
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Col: Today's Journey Plans */}
        <div className="col-span-1 bg-white border border-[#E2E8F0] rounded-xl shadow-sm flex flex-col">
           <div className="p-4 border-b border-[#E2E8F0] bg-gray-50/50">
             <h2 className="font-bold text-[#0F172A]">Today's Journey Plans (JP)</h2>
           </div>
           <div className="p-4 flex-1 flex items-center justify-center text-center">
             <div className="text-[#64748B]">
               <svg className="w-12 h-12 mx-auto text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
               <p className="text-sm">No Journey Plans scheduled for today.</p>
               <button className="mt-2 text-sm text-teal-600 font-semibold hover:underline">Generate Daily JP</button>
             </div>
           </div>
        </div>

        {/* Right Col: Route Master List */}
        <div className="col-span-1 md:col-span-2 bg-white border border-[#E2E8F0] rounded-xl shadow-sm flex flex-col overflow-hidden">
          <div className="p-4 border-b border-[#E2E8F0] bg-gray-50/50 flex justify-between items-center">
            <h2 className="font-bold text-[#0F172A]">Route Master</h2>
            <div className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
              Map View
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] uppercase tracking-wider text-xs">
                <tr>
                  <th className="px-6 py-3 font-semibold">Route Code & Name</th>
                  <th className="px-6 py-3 font-semibold">Territory</th>
                  <th className="px-6 py-3 font-semibold text-center">Visit Days</th>
                  <th className="px-6 py-3 font-semibold text-center">Shops</th>
                  <th className="px-6 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {routes.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-[#64748B]">
                      <p>No routes created.</p>
                    </td>
                  </tr>
                ) : (
                  routes.map(route => (
                    <tr key={route.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-bold text-[#0F172A]">{route.name}</div>
                        <div className="text-xs text-[#64748B]">Code: {route.code || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 text-[#64748B]">
                        {route.territory?.name || 'Unassigned'}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-mono">
                          {route.visitDays || '[]'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center text-xs font-semibold text-[#0F172A]">
                        {route._count?.salesCustomers || 0}
                      </td>
                      <td className="px-6 py-4 text-right space-x-3">
                        <Link href={`/routes/${route.id}/edit`} className="text-teal-600 hover:text-teal-800 font-medium">Edit</Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
