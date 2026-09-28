import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function SubscriptionPage() {
  
  // Try to load current tenant (using first for demo purposes)
  let tenant = null;
  try {
    tenant = await prisma.tenant.findFirst();
  } catch (err) {
    console.error(err);
  }

  const currentPlan = tenant?.subscriptionPlan || "STARTER";

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <div className="text-center py-6">
        <h1 className="text-3xl font-extrabold text-[#0F172A] tracking-tight">SaaS Editions & Billing</h1>
        <p className="text-md text-[#64748B] mt-2 max-w-2xl mx-auto">Scale your ERP alongside your business. Upgrade to unlock powerful workflows, AI features, and mobile apps.</p>
      </div>

      {/* Current Subscription Status */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E2E8F0] flex flex-col md:flex-row items-center justify-between gap-6">
         <div>
            <p className="text-sm font-bold text-[#64748B] uppercase tracking-wider">Current Active Plan</p>
            <div className="flex items-center gap-3 mt-2">
               <h2 className="text-3xl font-extrabold text-teal-600">{currentPlan} Edition</h2>
               <span className="bg-green-100 text-green-800 text-xs font-bold px-2.5 py-1 rounded-full border border-green-200">Active</span>
            </div>
            <p className="text-sm text-[#64748B] mt-2">Your subscription is active and auto-renews. No limits reached.</p>
         </div>
         <div className="flex gap-3">
            <button className="bg-white border-2 border-[#E2E8F0] text-[#0F172A] px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors shadow-sm">
               Manage Billing
            </button>
            <button className="bg-[#0F172A] text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-slate-800 transition-colors shadow-sm">
               Add User Licenses
            </button>
         </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        
        {/* Starter Plan */}
        <div className={`bg-white rounded-2xl border-2 p-6 flex flex-col ${currentPlan === 'STARTER' ? 'border-teal-500 shadow-md relative' : 'border-[#E2E8F0] shadow-sm'}`}>
          {currentPlan === 'STARTER' && (
             <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-teal-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
               Current Plan
             </div>
          )}
          <h3 className="text-xl font-bold text-[#0F172A]">Starter</h3>
          <p className="text-sm text-[#64748B] mt-2 h-10">Essential tools for small shops and basic distribution.</p>
          <div className="my-6">
             <span className="text-4xl font-extrabold text-[#0F172A]">$49</span>
             <span className="text-[#64748B] font-medium">/mo</span>
          </div>
          <button className={`w-full py-2.5 rounded-lg text-sm font-bold transition-colors mb-6 ${currentPlan === 'STARTER' ? 'bg-teal-50 text-teal-700 cursor-default' : 'bg-white border-2 border-[#E2E8F0] text-[#0F172A] hover:bg-gray-50'}`}>
            {currentPlan === 'STARTER' ? 'Active' : 'Downgrade'}
          </button>
          <div className="flex-1">
             <ul className="space-y-3 text-sm text-[#475569]">
                <li className="flex items-start gap-2"><svg className="w-5 h-5 text-teal-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg> Inventory (Batch & Expiry)</li>
                <li className="flex items-start gap-2"><svg className="w-5 h-5 text-teal-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg> Purchase & Sales Orders</li>
                <li className="flex items-start gap-2"><svg className="w-5 h-5 text-teal-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg> Retail POS (Pharmacy)</li>
                <li className="flex items-start gap-2"><svg className="w-5 h-5 text-teal-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg> Basic Accounting & Expenses</li>
                <li className="flex items-start gap-2 text-gray-400"><svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg> <s>Mobile Sales App</s></li>
                <li className="flex items-start gap-2 text-gray-400"><svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg> <s>Van Sales & Routes</s></li>
             </ul>
          </div>
        </div>

        {/* Professional Plan */}
        <div className={`bg-gradient-to-b from-[#0F172A] to-slate-900 rounded-2xl border-2 p-6 flex flex-col text-white ${currentPlan === 'PROFESSIONAL' ? 'border-teal-500 shadow-xl relative scale-105' : 'border-slate-800 shadow-md relative'}`}>
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-orange-400 to-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
            Most Popular
          </div>
          {currentPlan === 'PROFESSIONAL' && (
             <div className="absolute -top-3 right-4 bg-teal-500 text-white text-xs font-bold px-2 py-1 rounded shadow-md uppercase tracking-wider">
               Active
             </div>
          )}
          <h3 className="text-xl font-bold">Professional</h3>
          <p className="text-sm text-slate-300 mt-2 h-10">Advanced distribution with mobile apps and fleet management.</p>
          <div className="my-6">
             <span className="text-4xl font-extrabold">$149</span>
             <span className="text-slate-400 font-medium">/mo</span>
          </div>
          <button className={`w-full py-2.5 rounded-lg text-sm font-bold transition-all shadow-md mb-6 ${currentPlan === 'PROFESSIONAL' ? 'bg-teal-600 text-white cursor-default' : 'bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white'}`}>
            {currentPlan === 'PROFESSIONAL' ? 'Active' : 'Upgrade to Pro'}
          </button>
          <div className="flex-1">
             <ul className="space-y-3 text-sm text-slate-200">
                <li className="flex items-start gap-2"><svg className="w-5 h-5 text-teal-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg> <span className="font-bold">Everything in Starter</span></li>
                <li className="flex items-start gap-2"><svg className="w-5 h-5 text-teal-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg> Mobile Apps (Pre-Sell & Driver)</li>
                <li className="flex items-start gap-2"><svg className="w-5 h-5 text-teal-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg> Van Sales & Fleet Routes</li>
                <li className="flex items-start gap-2"><svg className="w-5 h-5 text-teal-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg> Pharmacy & FMCG Packs</li>
                <li className="flex items-start gap-2"><svg className="w-5 h-5 text-teal-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg> HR, Payroll & Commission</li>
                <li className="flex items-start gap-2 text-slate-500"><svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg> <s>Multi-Company Consolidation</s></li>
             </ul>
          </div>
        </div>

        {/* Enterprise Plan */}
        <div className={`bg-white rounded-2xl border-2 p-6 flex flex-col ${currentPlan === 'ENTERPRISE' ? 'border-purple-500 shadow-xl relative' : 'border-[#E2E8F0] shadow-sm'}`}>
          {currentPlan === 'ENTERPRISE' && (
             <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
               Current Plan
             </div>
          )}
          <h3 className="text-xl font-bold text-[#0F172A] flex items-center gap-2">
            Enterprise <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-purple-600"><path d="M12 2l3 6h7l-5 5 2 7-7-4-7 4 2-7-5-5h7z"/></svg>
          </h3>
          <p className="text-sm text-[#64748B] mt-2 h-10">Global controls, AI capabilities, and total automation.</p>
          <div className="my-6">
             <span className="text-4xl font-extrabold text-[#0F172A]">Custom</span>
          </div>
          <button className={`w-full py-2.5 rounded-lg text-sm font-bold transition-all shadow-md mb-6 ${currentPlan === 'ENTERPRISE' ? 'bg-purple-100 text-purple-800 cursor-default' : 'bg-[#0F172A] hover:bg-slate-800 text-white'}`}>
            {currentPlan === 'ENTERPRISE' ? 'Active' : 'Contact Sales'}
          </button>
          <div className="flex-1">
             <ul className="space-y-3 text-sm text-[#475569]">
                <li className="flex items-start gap-2"><svg className="w-5 h-5 text-purple-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg> <span className="font-bold">Everything in Professional</span></li>
                <li className="flex items-start gap-2"><svg className="w-5 h-5 text-purple-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg> Multi-Company / Sub-Distributors</li>
                <li className="flex items-start gap-2"><svg className="w-5 h-5 text-purple-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg> B2B Customer Portal</li>
                <li className="flex items-start gap-2"><svg className="w-5 h-5 text-purple-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg> AI Demand Forecasting</li>
                <li className="flex items-start gap-2"><svg className="w-5 h-5 text-purple-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg> Advanced Webhook Integrations</li>
             </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
