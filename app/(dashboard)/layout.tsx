import Link from "next/link";
import { ReactNode } from "react";
import { 
  LayoutDashboard, ShoppingCart, MonitorSmartphone, Users, RefreshCcw, Map, DollarSign,
  PackageSearch, Truck, ShieldCheck, Database, Receipt, FileText, Activity, 
  Settings, Server, Archive, CreditCard, Stethoscope, Store, Lock, GitMerge, CheckSquare, BrainCircuit, Box, HeartHandshake, Briefcase, Target, PieChart, Users2, BarChart
} from "lucide-react";

const navLinkClass = "flex items-center px-3 py-2 text-sm font-medium rounded-md text-[#64748B] hover:text-teal-700 hover:bg-teal-50 gap-3";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-[#E2E8F0] flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-[#E2E8F0]">
          <div className="w-8 h-8 bg-gradient-to-br from-teal-600 to-emerald-500 rounded flex items-center justify-center text-white font-bold mr-3 shadow-sm border border-teal-500/30">
            E
          </div>
          <span className="text-[#0F172A] font-bold text-lg">ERP SaaS</span>
        </div>
        
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          <Link href="/dashboard" className={navLinkClass}>
            <LayoutDashboard size={18} /> Dashboard
          </Link>
          
          <div className="pt-4 pb-1">
            <p className="px-3 text-xs font-semibold text-[#64748B] uppercase tracking-wider">
              Sales & CRM
            </p>
          </div>
          <Link href="/sales" className={navLinkClass}>
            <ShoppingCart size={18} /> Order Management
          </Link>
          <Link href="/sales/invoices/new" className={navLinkClass}>
            <FileText size={18} /> Sales Invoices (DC)
          </Link>
          <Link href="/pos" className={navLinkClass}>
            <MonitorSmartphone size={18} /> Retail POS
          </Link>
          <Link href="/customers" className={navLinkClass}>
            <Users size={18} /> Customer Dashboard
          </Link>
          <Link href="/sales/returns/new" className={navLinkClass}>
            <RefreshCcw size={18} /> Sales Returns (CN)
          </Link>
          <Link href="/recovery" className={navLinkClass}>
            <RefreshCcw size={18} /> Credit & Recovery
          </Link>
          <Link href="/routes" className={navLinkClass}>
            <Map size={18} /> Routes & Territory
          </Link>
          <Link href="/settlement" className={navLinkClass}>
            <DollarSign size={18} /> Day-End Settlement
          </Link>

          <div className="pt-4 pb-1">
            <p className="px-3 text-xs font-semibold text-[#64748B] uppercase tracking-wider">
              Stock & Purchase
            </p>
          </div>
          <Link href="/purchase" className={navLinkClass}>
            <PackageSearch size={18} /> Purchase Orders
          </Link>
          <Link href="/delivery" className={navLinkClass}>
            <Truck size={18} /> Delivery & Dispatch
          </Link>
          <Link href="/fleet" className={navLinkClass}>
            <Settings size={18} /> Fleet Management
          </Link>
          <Link href="/schemes" className={navLinkClass}>
            <Target size={18} /> Pricing & Schemes
          </Link>
          <Link href="/suppliers" className={navLinkClass}>
            <HeartHandshake size={18} /> Suppliers & Vendors
          </Link>
          <Link href="/claims" className={navLinkClass}>
            <RefreshCcw size={18} /> Returns & Claims
          </Link>
          <Link href="/purchase/returns/new" className={navLinkClass}>
            <RefreshCcw size={18} /> Purchase Returns (DN)
          </Link>
          <Link href="/inventory" className={navLinkClass}>
            <Box size={18} /> Inventory & Warehouse
          </Link>
          <Link href="/warehouse" className={navLinkClass}>
            <Database size={18} /> Warehouse Operations
          </Link>
          <Link href="/warehouse/grn/new" className={navLinkClass}>
            <PackageSearch size={18} /> Goods Receipt Note
          </Link>
          <Link href="/inventory/adjustments/new" className={navLinkClass}>
            <RefreshCcw size={18} /> Stock Adjustments
          </Link>
          <Link href="/valuation" className={navLinkClass}>
            <PieChart size={18} /> Stock Valuation (Costing)
          </Link>
          
          <div className="pt-4 pb-1">
            <p className="px-3 text-xs font-semibold text-[#64748B] uppercase tracking-wider">
              Logistics
            </p>
          </div>
          <Link href="/deliveries" className={navLinkClass}>
            <Map size={18} /> Deliveries & Routes
          </Link>
          <Link href="/vehicles" className={navLinkClass}>
            <Truck size={18} /> Fleet Management
          </Link>

          <div className="pt-4 pb-1">
            <p className="px-3 text-xs font-semibold text-[#64748B] uppercase tracking-wider">
              Finance & HR
            </p>
          </div>
          <Link href="/finance" className={navLinkClass}>
            <FileText size={18} /> Accounting & Ledgers
          </Link>
          <Link href="/finance/vouchers/new" className={navLinkClass}>
            <DollarSign size={18} /> Receipt & Payment Vouchers
          </Link>
          <Link href="/expenses" className={navLinkClass}>
            <Receipt size={18} /> Expense Management
          </Link>
          <Link href="/hr" className={navLinkClass}>
            <Briefcase size={18} /> Personnel & Payroll
          </Link>
          <Link href="/crm" className={navLinkClass}>
            <Users2 size={18} /> CRM & Engagement
          </Link>
          <Link href="/b2b" className={navLinkClass}>
            <Server size={18} /> B2B Portal
          </Link>
          <Link href="/targets" className={navLinkClass}>
            <Target size={18} /> Targets & Commission
          </Link>
          <Link href="/reports" className={navLinkClass}>
            <Activity size={18} /> Reports & Analytics
          </Link>
          <Link href="/reports/profit-loss" className={navLinkClass}>
            <PieChart size={18} /> Profit & Loss
          </Link>
          <Link href="/reports/balance-sheet" className={navLinkClass}>
            <BarChart size={18} /> Balance Sheet
          </Link>
          <Link href="/reports/trial-balance" className={navLinkClass}>
            <Activity size={18} /> Trial Balance
          </Link>
          <Link href="/reports/customer-ledger" className={navLinkClass}>
            <Users size={18} /> Customer Ledger
          </Link>
          <Link href="/approvals" className={navLinkClass}>
            <CheckSquare size={18} /> Workflow Approvals
          </Link>
          <Link href="/ai" className={navLinkClass}>
            <BrainCircuit size={18} /> AI Command Center
          </Link>

          <div className="pt-4 pb-1">
            <p className="px-3 text-xs font-semibold text-[#64748B] uppercase tracking-wider">
              Foundation
            </p>
          </div>
          <Link href="/products" className={navLinkClass}>
            <Box size={18} /> Product Master
          </Link>
          <Link href="/setup" className={navLinkClass}>
            <Settings size={18} /> Company Setup
          </Link>
          <Link href="/enterprise" className={navLinkClass}>
            <Store size={18} /> Multi-Branch / Enterprise
          </Link>
          <Link href="/documents" className={navLinkClass}>
            <Archive size={18} /> Archive & Documents
          </Link>
          <Link href="/subscription" className={navLinkClass}>
            <CreditCard size={18} /> Billing & Subscription
          </Link>
          <Link href="/compliance" className={navLinkClass}>
            <ShieldCheck size={18} /> Tax & Compliance
          </Link>
          <Link href="/integrations" className={navLinkClass}>
            <GitMerge size={18} /> Integrations & API
          </Link>
          <Link href="/pharmacy" className={navLinkClass}>
            <Stethoscope size={18} /> Pharmacy Tools
          </Link>
          <Link href="/fmcg" className={navLinkClass}>
            <Store size={18} /> FMCG Trade
          </Link>
          <Link href="/users" className={navLinkClass}>
            <Lock size={18} /> Users & Roles
          </Link>

          <div className="pt-4 pb-1">
            <p className="px-3 text-xs font-semibold text-[#64748B] uppercase tracking-wider">
              Core Workflows
            </p>
          </div>
          <Link href="/workflows/purchase-to-payment" className={navLinkClass}>
            <RefreshCcw size={18} /> Purchase to Payment
          </Link>
          <Link href="/workflows/order-to-cash" className={navLinkClass}>
            <DollarSign size={18} /> Pre-Sell Order to Cash
          </Link>
          <Link href="/workflows/van-sales" className={navLinkClass}>
            <Truck size={18} /> FMCG Van Sales
          </Link>
          <Link href="/workflows/pharmacy-pos" className={navLinkClass}>
            <MonitorSmartphone size={18} /> Pharmacy POS Shift
          </Link>
          <Link href="/workflows/returns-claims" className={navLinkClass}>
            <RefreshCcw size={18} /> Returns & Company Claims
          </Link>
          <Link href="/workflows/credit-recovery" className={navLinkClass}>
            <DollarSign size={18} /> Credit Recovery
          </Link>
          <Link href="/workflows/near-expiry" className={navLinkClass}>
            <Archive size={18} /> Near-Expiry Handling
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto flex flex-col">
        <header className="h-16 bg-white border-b border-[#E2E8F0] flex items-center px-8 justify-end">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#E2E8F0] rounded-full"></div>
            <span className="text-sm font-medium text-[#0F172A]">Admin User</span>
          </div>
        </header>
        <div className="flex-1 p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
