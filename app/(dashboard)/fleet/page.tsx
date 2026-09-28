import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function FleetPage() {
  let vehicles: any[] = [];
  let drivers: any[] = [];
  try {
    vehicles = await prisma.deliveryVehicle.findMany({
      include: {
        _count: {
          select: { trips: true, maintenances: true, fuelLogs: true }
        }
      },
      orderBy: { plateNumber: 'asc' },
      take: 20
    });
    
    drivers = await prisma.driver.findMany({
      orderBy: { name: 'asc' },
      take: 20
    });
  } catch (err) {
    console.error("Prisma error:", err);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Vehicle & Fleet Management</h1>
          <p className="text-sm text-[#64748B] mt-1">Manage vehicles, drivers, fuel logs, and maintenance schedules.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-[#E2E8F0] hover:bg-gray-50 text-[#0F172A] px-4 py-2 rounded-md text-sm font-semibold shadow-sm transition-all">
            Driver Roster
          </button>
          <button className="bg-white border border-[#E2E8F0] hover:bg-gray-50 text-[#0F172A] px-4 py-2 rounded-md text-sm font-semibold shadow-sm transition-all">
            Fuel Logs
          </button>
          <button className="bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-700 hover:to-emerald-600 text-white px-4 py-2 rounded-md text-sm font-semibold shadow-md transition-all active:scale-[0.98]">
            + Add Vehicle
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm border-l-4 border-l-teal-500">
          <p className="text-sm font-medium text-[#64748B]">Total Vehicles</p>
          <p className="text-2xl font-bold text-[#0F172A] mt-2">{vehicles.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm border-l-4 border-l-orange-500">
          <p className="text-sm font-medium text-[#64748B]">In Maintenance</p>
          <p className="text-2xl font-bold text-orange-600 mt-2">
            {vehicles.filter(v => v.status === 'MAINTENANCE').length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm border-l-4 border-l-blue-500">
          <p className="text-sm font-medium text-[#64748B]">Active Drivers</p>
          <p className="text-2xl font-bold text-blue-600 mt-2">
            {drivers.filter(d => d.status === 'ACTIVE').length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm border-l-4 border-l-red-500">
          <p className="text-sm font-medium text-[#64748B]">Document Alerts</p>
          <p className="text-2xl font-bold text-red-600 mt-2">0</p>
          <p className="text-xs text-[#64748B] mt-1">Expiring within 30 days</p>
        </div>
      </div>

      <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-[#E2E8F0] bg-gray-50/50 flex justify-between items-center">
          <h2 className="font-bold text-[#0F172A]">Fleet Roster</h2>
          <select className="border border-[#E2E8F0] rounded-md px-3 py-1.5 text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-teal-500">
            <option>All Vehicles</option>
            <option>Owned</option>
            <option>Hired</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] uppercase tracking-wider text-xs">
              <tr>
                <th className="px-6 py-3 font-semibold">Vehicle</th>
                <th className="px-6 py-3 font-semibold">Capacity</th>
                <th className="px-6 py-3 font-semibold text-center">Ownership</th>
                <th className="px-6 py-3 font-semibold text-center">Stats (YTD)</th>
                <th className="px-6 py-3 font-semibold text-center">Status</th>
                <th className="px-6 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {vehicles.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-[#64748B]">
                    <p>No vehicles registered in fleet.</p>
                  </td>
                </tr>
              ) : (
                vehicles.map(vehicle => (
                  <tr key={vehicle.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-bold font-mono text-[#0F172A]">{vehicle.plateNumber}</div>
                      <div className="text-xs text-[#64748B]">{vehicle.make} {vehicle.model}</div>
                    </td>
                    <td className="px-6 py-4 text-xs text-[#0F172A]">
                      <div>{vehicle.capacityWeight ? `${vehicle.capacityWeight} kg` : 'N/A weight'}</div>
                      <div className="text-[#64748B]">{vehicle.capacityVolume ? `${vehicle.capacityVolume} CBM` : ''}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2 py-1 rounded text-xs font-semibold
                        ${vehicle.ownership === 'OWNED' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-200 text-gray-700'}`}>
                        {vehicle.ownership}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center text-xs text-[#64748B]">
                      {vehicle._count?.trips || 0} Trips <br/>
                      {vehicle._count?.maintenances || 0} Repairs
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold
                        ${vehicle.status === 'AVAILABLE' ? 'bg-[#10B981]/10 text-[#10B981]' : 
                          vehicle.status === 'MAINTENANCE' ? 'bg-orange-100 text-orange-700' :
                          'bg-blue-100 text-blue-700'}`}
                      >
                        {vehicle.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <button className="text-teal-600 hover:text-teal-800 font-medium">Log Fuel</button>
                      <button className="text-indigo-600 hover:text-indigo-800 font-medium">Profile</button>
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
