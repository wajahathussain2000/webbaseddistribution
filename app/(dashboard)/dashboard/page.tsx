import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import DashboardCharts from "./DashboardCharts";
import { Activity, Package, ShoppingCart, DollarSign } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) return <div>Unauthorized</div>;

  const userTenant = await prisma.tenantUser.findFirst({
    where: { userId: session.user.id }
  });
  if (!userTenant) return <div>No tenant assigned</div>;
  const tenantId = userTenant.tenantId;

  // Real-time Queries
  const today = new Date();
  today.setHours(0,0,0,0);

  // 1. Total Sales Today (Invoices + POS)
  const posSalesToday = await prisma.posTransaction.aggregate({
    where: { tenantId, date: { gte: today }, type: "SALE" },
    _sum: { total: true }
  });
  const invoiceSalesToday = await prisma.salesInvoice.aggregate({
    where: { tenantId, date: { gte: today } },
    _sum: { total: true }
  });
  const totalSalesToday = (posSalesToday._sum.total || 0) + (invoiceSalesToday._sum.total || 0);

  // 2. Pending Orders
  const pendingOrders = await prisma.salesOrder.count({
    where: { tenantId, status: "PENDING" }
  });

  // 3. Low Stock Alerts (Stock <= 10)
  const lowStockCount = await prisma.stockBalance.count({
    where: { warehouse: { tenantId }, qtyAvailable: { lte: 10 } }
  });

  // 4. Monthly Total Sales (for last 7 days chart)
  const last7Days = new Date();
  last7Days.setDate(last7Days.getDate() - 7);
  
  const recentPos = await prisma.posTransaction.findMany({
    where: { tenantId, date: { gte: last7Days }, type: "SALE" },
    select: { date: true, total: true }
  });
  const recentInvoices = await prisma.salesInvoice.findMany({
    where: { tenantId, date: { gte: last7Days } },
    select: { date: true, total: true }
  });

  // Aggregate by Date for Sales Chart
  const salesMap: Record<string, number> = {};
  [...recentPos, ...recentInvoices].forEach(txn => {
    const dStr = txn.date.toISOString().split('T')[0];
    salesMap[dStr] = (salesMap[dStr] || 0) + txn.total;
  });
  
  const salesData = Object.keys(salesMap).sort().map(k => ({
    name: k,
    total: salesMap[k]
  }));

  // Mock Expenses Data for Chart (Just for demo until full expense tracking is filled)
  const expenseData = [
    { name: "Mon", total: 1200 },
    { name: "Tue", total: 2100 },
    { name: "Wed", total: 800 },
    { name: "Thu", total: 1600 },
    { name: "Fri", total: 900 },
    { name: "Sat", total: 3200 },
    { name: "Sun", total: 0 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0F172A]">Dashboard Overview</h1>
        <p className="text-sm text-[#64748B] mt-1">Live data linked with your database.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Stat Card 1 */}
        <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm flex flex-col justify-center">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-teal-600">
              <DollarSign size={20} />
            </div>
            <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2 py-1 rounded-full">+12%</span>
          </div>
          <p className="text-sm font-medium text-[#64748B]">Today's Sales</p>
          <p className="text-2xl font-bold text-[#0F172A] mt-1">Rs {totalSalesToday.toLocaleString()}</p>
        </div>

        {/* Stat Card 2 */}
        <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm flex flex-col justify-center">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <ShoppingCart size={20} />
            </div>
          </div>
          <p className="text-sm font-medium text-[#64748B]">Pending SO</p>
          <p className="text-2xl font-bold text-[#0F172A] mt-1">{pendingOrders}</p>
        </div>

        {/* Stat Card 3 */}
        <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm flex flex-col justify-center">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-600">
              <Package size={20} />
            </div>
            <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded-full">Action needed</span>
          </div>
          <p className="text-sm font-medium text-[#64748B]">Low Stock Items</p>
          <p className="text-2xl font-bold text-[#0F172A] mt-1">{lowStockCount}</p>
        </div>

        {/* Stat Card 4 */}
        <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm flex flex-col justify-center">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Activity size={20} />
            </div>
          </div>
          <p className="text-sm font-medium text-[#64748B]">Total Products</p>
          <p className="text-2xl font-bold text-[#0F172A] mt-1">
            {/* Can query total products dynamically, just showing simple value for now */}
            Active
          </p>
        </div>
      </div>

      <DashboardCharts salesData={salesData} expenseData={expenseData} />
    </div>
  );
}
