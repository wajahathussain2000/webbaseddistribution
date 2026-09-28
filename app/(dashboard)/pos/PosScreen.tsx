"use client";

import React, { useState } from "react";
import { useMockData, FMCG_PRODUCTS } from "@/app/context/MockDataContext";

export default function PosScreen({ products }: { products: any[] }) {
  const { salesOrders, saveSOs } = useMockData();
  const [posSearch, setPosSearch] = useState("");
  const [activePosOrder, setActivePosOrder] = useState<any>(null);
  const [posPaymentMode, setPosPaymentMode] = useState("Cash");

  const pendingPosOrders = salesOrders.filter((o: any) => 
    o.status === 'Pending POS' && 
    (o.soNumber.toLowerCase().includes(posSearch.toLowerCase()) || o.customer.name.toLowerCase().includes(posSearch.toLowerCase()))
  );

  const processPos = () => {
    if (!activePosOrder) return;
    const invNum = 'INV-' + Math.floor(1000 + Math.random() * 9000);
    const updated = salesOrders.map((o: any) => o.soNumber === activePosOrder.soNumber ? {
      ...o, status: 'Invoiced', invoiceNumber: invNum, paymentMethod: posPaymentMode
    } : o);
    saveSOs(updated);
    alert(`Invoice ${invNum} generated successfully!`);
    setActivePosOrder(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
      <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 space-y-4">
        <h3 className="font-bold text-[#0F172A] border-b pb-2">Pending Orders ({pendingPosOrders.length})</h3>
        <input 
          type="text" 
          placeholder="Search SO# or Customer..." 
          value={posSearch} 
          onChange={e => setPosSearch(e.target.value)} 
          className="w-full border border-slate-200 p-2.5 rounded-lg text-sm text-[#0F172A] focus:ring-2 focus:ring-sky-500 outline-none transition" 
        />
        <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
          {pendingPosOrders.map((o: any) => (
            <div 
              key={o.soNumber} 
              onClick={() => setActivePosOrder(o)} 
              className={`p-3 border rounded-lg hover:bg-slate-50 cursor-pointer transition ${activePosOrder?.soNumber === o.soNumber ? 'border-sky-500 bg-sky-50' : 'border-slate-200'}`}
            >
              <div className="flex justify-between font-bold text-sm text-[#0F172A]">
                <span>{o.soNumber}</span>
                <span className="text-emerald-600">$ {o.netAmount.toFixed(2)}</span>
              </div>
              <p className="text-xs text-[#64748B] truncate mt-1">{o.customer.name}</p>
            </div>
          ))}
          {pendingPosOrders.length === 0 && <p className="text-sm text-center text-slate-400 py-6">No pending orders found.</p>}
        </div>
      </div>
      
      <div className="lg:col-span-2 bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex flex-col h-full min-h-[500px]">
        <h3 className="font-bold text-[#0F172A] border-b pb-2 mb-4">
          Checkout: {activePosOrder ? activePosOrder.soNumber : 'No Order Selected'}
        </h3>
        
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-slate-50 border-b text-[#64748B] text-xs uppercase tracking-wider">
              <tr>
                <th className="p-3">Item</th>
                <th className="p-3">Qty</th>
                <th className="p-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {activePosOrder?.items.map((it: any) => (
                <tr key={it.id} className="border-b text-[#0F172A]">
                  <td className="p-3 font-medium">{FMCG_PRODUCTS.find(p => p.id === it.sku)?.name || it.sku}</td>
                  <td className="p-3">{it.qty} {it.uom}</td>
                  <td className="p-3 text-right font-bold">$ {it.total.toFixed(2)}</td>
                </tr>
              ))}
              {!activePosOrder && (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-[#64748B]">Select an order from the list to begin checkout.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {activePosOrder && (
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div>
              <label className="block text-xs font-semibold text-[#64748B] mb-2 uppercase tracking-wide">Payment Method</label>
              <select 
                value={posPaymentMode} 
                onChange={e => setPosPaymentMode(e.target.value)} 
                className="w-full border border-slate-300 p-2.5 rounded-lg text-sm text-[#0F172A] bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                <option>Cash</option>
                <option>Credit Term (30 Days)</option>
                <option>Digital QR / Wallet</option>
                <option>Credit Card</option>
              </select>
            </div>
            <div className="text-right text-sm space-y-2 text-[#0F172A]">
              <div className="flex justify-between items-center">
                <span className="text-[#64748B]">Subtotal:</span>
                <span className="font-semibold">$ {activePosOrder.grossAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#64748B]">Discounts:</span>
                <span className="font-semibold text-emerald-600">-$ {activePosOrder.discountAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#64748B]">Tax:</span>
                <span className="font-semibold">$ {activePosOrder.taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center border-t border-slate-200 pt-2 mt-2">
                <span className="font-bold text-lg">Grand Total:</span>
                <span className="font-bold text-xl text-emerald-600">$ {activePosOrder.netAmount.toFixed(2)}</span>
              </div>
              <button 
                onClick={processPos} 
                className="w-full mt-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors shadow-sm"
              >
                Complete Payment & Print Invoice
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
