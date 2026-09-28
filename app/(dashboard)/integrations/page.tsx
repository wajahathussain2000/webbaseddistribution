import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function IntegrationsPage() {
  let webhooks: any[] = [];
  let devices: any[] = [];
  
  try {
    webhooks = await prisma.webhookEndpoint.findMany({
      orderBy: { url: 'asc' }
    });
    devices = await prisma.hardwareDevice.findMany({
      include: { branch: true },
      orderBy: { name: 'asc' }
    });
  } catch (err) {
    console.error("Prisma error:", err);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Integrations & Hardware</h1>
          <p className="text-sm text-[#64748B] mt-1">Connect your ERP to weighing scales, printers, IoT sensors, and external APIs.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-[#E2E8F0] hover:bg-gray-50 text-[#0F172A] px-4 py-2 rounded-md text-sm font-semibold shadow-sm transition-all flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
            API Keys
          </button>
          <button className="bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-700 hover:to-emerald-600 text-white px-4 py-2 rounded-md text-sm font-semibold shadow-md transition-all active:scale-[0.98]">
            + Add Device
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Hardware Devices */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-[#E2E8F0] flex gap-4 bg-gray-50/50 items-center justify-between">
            <h2 className="font-bold text-[#0F172A] flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"/><rect x="9" y="9" width="6" height="6"/></svg>
              Connected Hardware
            </h2>
          </div>
          <div className="p-4">
            {devices.length === 0 ? (
               <div className="text-center py-8">
                 <p className="text-sm text-[#64748B]">No hardware devices connected.</p>
                 <p className="text-xs text-[#94A3B8] mt-1">Connect printers, barcode scanners, weighing scales, and biometric devices.</p>
               </div>
            ) : (
              <ul className="space-y-3">
                {devices.map(device => (
                  <li key={device.id} className="flex justify-between items-center p-3 border border-gray-100 rounded-lg hover:border-teal-200 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="bg-teal-50 text-teal-700 p-2 rounded">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-[#0F172A]">{device.name}</p>
                        <p className="text-xs text-[#64748B] font-mono">{device.identifier} • {device.type}</p>
                      </div>
                    </div>
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">Online</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Software Integrations */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-[#E2E8F0] flex gap-4 bg-gray-50/50 items-center justify-between">
            <h2 className="font-bold text-[#0F172A] flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500"><path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/></svg>
              Software & API Integrations
            </h2>
          </div>
          <div className="p-4 space-y-4">
             {/* WhatsApp API Card */}
             <div className="flex justify-between items-center p-4 border border-gray-100 rounded-xl hover:shadow-sm transition-all">
                <div className="flex items-center gap-4">
                   <div className="bg-green-500 text-white p-3 rounded-xl shadow-sm">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                   </div>
                   <div>
                     <p className="font-bold text-[#0F172A]">WhatsApp Business API</p>
                     <p className="text-xs text-[#64748B]">Auto-send invoices & delivery updates</p>
                   </div>
                </div>
                <button className="text-xs font-bold bg-gray-100 text-gray-700 px-3 py-1.5 rounded-md hover:bg-gray-200">Configure</button>
             </div>

             {/* Stripe Payment Gateway */}
             <div className="flex justify-between items-center p-4 border border-gray-100 rounded-xl hover:shadow-sm transition-all">
                <div className="flex items-center gap-4">
                   <div className="bg-indigo-600 text-white p-3 rounded-xl shadow-sm">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
                   </div>
                   <div>
                     <p className="font-bold text-[#0F172A]">Payment Gateway</p>
                     <p className="text-xs text-[#64748B]">Process B2B cards & bank transfers</p>
                   </div>
                </div>
                <button className="text-xs font-bold bg-gray-100 text-gray-700 px-3 py-1.5 rounded-md hover:bg-gray-200">Configure</button>
             </div>
             
             {/* E-Commerce Sync */}
             <div className="flex justify-between items-center p-4 border border-gray-100 rounded-xl hover:shadow-sm transition-all">
                <div className="flex items-center gap-4">
                   <div className="bg-orange-500 text-white p-3 rounded-xl shadow-sm">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                   </div>
                   <div>
                     <p className="font-bold text-[#0F172A]">Shopify / WooCommerce</p>
                     <p className="text-xs text-[#64748B]">Sync inventory levels to your webstore</p>
                   </div>
                </div>
                <button className="text-xs font-bold bg-teal-50 text-teal-700 px-3 py-1.5 rounded-md hover:bg-teal-100 border border-teal-200">Connected</button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
