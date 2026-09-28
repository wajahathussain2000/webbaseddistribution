"use client";

import React, { useState } from "react";
import { useMockData, FMCG_PRODUCTS, LOGISTICS } from "@/app/context/MockDataContext";

export default function DeliveryDispatchPage() {
  const { salesOrders, saveSOs } = useMockData();
  const [activeTab, setActiveTab] = useState<'dispatch' | 'pod'>('dispatch');
  const [activePodOrder, setActivePodOrder] = useState<any>(null);

  const assignDispatch = (soNum: string, vehicle: string, rider: string) => {
    const updated = salesOrders.map((o: any) => o.soNumber === soNum ? {
      ...o, status: 'Out for Delivery', vehicle, rider
    } : o);
    saveSOs(updated);
    alert(`Order dispatched for delivery!`);
  };

  const finalizePod = (soNum: string, returnReason: string, podNotes: string, acceptedQtys: any) => {
    const order = salesOrders.find((o: any) => o.soNumber === soNum);
    if (!order) return;

    let hasReturns = false;
    const newItems = order.items.map((it: any, idx: number) => {
      const acc = acceptedQtys[idx] ?? it.qty;
      const ret = it.qty - acc;
      if (ret > 0) hasReturns = true;
      return { ...it, qtyDelivered: acc, qtyReturned: ret };
    });

    const updated = salesOrders.map((o: any) => o.soNumber === soNum ? {
      ...o,
      status: hasReturns ? 'Partially Returned' : 'Delivered',
      items: newItems,
      podDetails: { returnReason, podNotes, timestamp: new Date().toISOString() }
    } : o);
    
    saveSOs(updated);
    alert(`POD Recorded for ${order.invoiceNumber}!`);
    setActivePodOrder(null);
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Delivery & Dispatch</h1>
          <p className="text-sm text-[#64748B]">Manage fleet allocation and proof of delivery.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setActiveTab('dispatch')}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition ${activeTab === 'dispatch' ? 'bg-[#0F172A] text-white' : 'bg-white text-[#64748B] border hover:bg-slate-50'}`}
          >
            Dispatch Fleet
          </button>
          <button 
            onClick={() => setActiveTab('pod')}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition ${activeTab === 'pod' ? 'bg-[#0F172A] text-white' : 'bg-white text-[#64748B] border hover:bg-slate-50'}`}
          >
            POD & Returns
          </button>
        </div>
      </div>

      {activeTab === 'dispatch' && (
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 space-y-4">
          <h3 className="font-bold text-[#0F172A] border-b pb-2">Ready For Dispatch Allocation</h3>
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-slate-50 border-b text-[#64748B] text-xs uppercase tracking-wider">
              <tr>
                <th className="p-3">Invoice / SO</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Assign Vehicle</th>
                <th className="p-3">Assign Rider</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {salesOrders.filter((o: any) => o.status === 'Invoiced').map((o: any) => (
                <tr key={o.soNumber} className="border-b text-[#0F172A]">
                  <td className="p-3 font-bold">{o.invoiceNumber}</td>
                  <td className="p-3">{o.customer.name}</td>
                  <td className="p-3">
                    <select id={`v-${o.soNumber}`} className="w-full border border-slate-200 p-2 rounded-lg bg-white text-sm">
                      {LOGISTICS.vehicles.map(v => <option key={v}>{v}</option>)}
                    </select>
                  </td>
                  <td className="p-3">
                    <select id={`r-${o.soNumber}`} className="w-full border border-slate-200 p-2 rounded-lg bg-white text-sm">
                      {LOGISTICS.riders.map(r => <option key={r}>{r}</option>)}
                    </select>
                  </td>
                  <td className="p-3 text-right">
                    <button 
                      onClick={() => {
                        const veh = (document.getElementById(`v-${o.soNumber}`) as HTMLSelectElement).value;
                        const rid = (document.getElementById(`r-${o.soNumber}`) as HTMLSelectElement).value;
                        assignDispatch(o.soNumber, veh, rid);
                      }} 
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md font-semibold text-xs shadow-sm transition"
                    >
                      Dispatch
                    </button>
                  </td>
                </tr>
              ))}
              {salesOrders.filter((o: any) => o.status === 'Invoiced').length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-[#64748B]">No invoiced orders waiting for dispatch.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'pod' && (
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 space-y-4">
          <h3 className="font-bold text-[#0F172A] border-b pb-2">Proof of Delivery (POD) Check-in</h3>
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-slate-50 border-b text-[#64748B] text-xs uppercase tracking-wider">
              <tr>
                <th className="p-3">Invoice Ref</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Logistics</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Status</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {salesOrders.filter((o: any) => ['Out for Delivery', 'Delivered', 'Partially Returned'].includes(o.status)).map((o: any) => (
                <tr key={o.soNumber} className="border-b hover:bg-slate-50 text-[#0F172A]">
                  <td className="p-3 font-bold">{o.invoiceNumber}</td>
                  <td className="p-3">{o.customer.name}</td>
                  <td className="p-3">
                    <p className="font-medium text-xs">{o.vehicle}</p>
                    <p className="text-[#64748B] text-xs mt-0.5">{o.rider}</p>
                  </td>
                  <td className="p-3 font-bold">$ {o.netAmount.toFixed(2)}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 text-[10px] uppercase font-bold rounded-full ${o.status === 'Out for Delivery' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    {o.status === 'Out for Delivery' ? (
                      <button 
                        onClick={() => setActivePodOrder(o)} 
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-md font-semibold text-xs shadow-sm"
                      >
                        Confirm POD
                      </button>
                    ) : (
                      <span className="text-[#64748B] text-xs font-semibold mr-2">Recorded</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* POD Modal */}
      {activePodOrder && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full flex flex-col overflow-hidden">
            <div className="p-5 bg-white border-b flex justify-between items-center">
              <h3 className="font-bold text-lg text-[#0F172A]">POD Confirmation: {activePodOrder.invoiceNumber}</h3>
              <button onClick={() => setActivePodOrder(null)} className="text-slate-400 hover:text-slate-600 transition">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            <div className="p-6 space-y-4 text-sm bg-slate-50">
              <div className="bg-white rounded-lg border p-4">
                <table className="w-full text-left">
                  <thead className="border-b text-[#64748B] text-xs uppercase">
                    <tr>
                      <th className="pb-2">Item</th>
                      <th className="pb-2 text-center">Invoiced</th>
                      <th className="pb-2 text-center">Accepted</th>
                      <th className="pb-2 text-center">Returned</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activePodOrder.items.map((it:any, idx:number) => (
                      <tr key={idx} className="border-b last:border-0 text-[#0F172A]">
                        <td className="py-3 font-medium">{FMCG_PRODUCTS.find(p=>p.id===it.sku)?.name || it.sku}</td>
                        <td className="py-3 text-center text-slate-500 font-semibold">{it.qty}</td>
                        <td className="py-3 text-center">
                          <input 
                            type="number" 
                            id={`pod-acc-${idx}`} 
                            defaultValue={it.qty} 
                            max={it.qty} 
                            min={0}
                            className="w-16 border p-1.5 rounded-md text-center font-bold text-emerald-600 focus:ring-2 focus:ring-emerald-500 outline-none" 
                            onChange={(e)=>{
                              const acc = parseInt(e.target.value)||0;
                              (document.getElementById(`pod-ret-${idx}`) as HTMLInputElement).value = String(it.qty - acc);
                            }} 
                          />
                        </td>
                        <td className="py-3 text-center">
                          <input 
                            type="number" 
                            id={`pod-ret-${idx}`} 
                            defaultValue={0} 
                            readOnly 
                            className="w-16 border border-slate-100 bg-slate-100 p-1.5 rounded-md text-center font-bold text-rose-500" 
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="font-semibold block mb-1 text-[#0F172A]">Return Reason</label>
                  <select id="pod-reason" className="w-full border border-slate-300 p-2.5 rounded-lg text-sm bg-white text-[#0F172A]"><option>None</option><option>Damaged in Transit</option><option>Near Expiry</option><option>Quantity Mismatch</option></select>
                </div>
                <div>
                  <label className="font-semibold block mb-1 text-[#0F172A]">Driver Notes</label>
                  <input type="text" id="pod-notes" placeholder="Optional comments..." className="w-full border border-slate-300 p-2.5 rounded-lg text-sm bg-white text-[#0F172A]" />
                </div>
              </div>
            </div>
            <div className="p-5 bg-white border-t flex justify-end gap-3">
              <button onClick={() => setActivePodOrder(null)} className="px-5 py-2.5 border border-slate-300 text-slate-600 hover:bg-slate-50 rounded-lg font-semibold text-sm transition">Cancel</button>
              <button onClick={() => {
                const accQtys = activePodOrder.items.map((_:any, i:number) => parseInt((document.getElementById(`pod-acc-${i}`) as HTMLInputElement).value)||0);
                const reason = (document.getElementById('pod-reason') as HTMLSelectElement).value;
                const notes = (document.getElementById('pod-notes') as HTMLInputElement).value;
                finalizePod(activePodOrder.soNumber, reason, notes, accQtys);
              }} className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-sm shadow-sm transition">Finalize Delivery POD</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
