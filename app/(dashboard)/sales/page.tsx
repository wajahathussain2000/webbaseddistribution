"use client";

import React, { useState, useEffect } from "react";
import { useMockData, FMCG_PRODUCTS, CUSTOMERS } from "@/app/context/MockDataContext";

export default function OrderManagementPage() {
  const { salesOrders, saveSOs } = useMockData();

  const [soForm, setSoForm] = useState({
    customerId: '', salesman: 'Alex Vance (Rep-101)', orderType: 'General Trade (GT)',
    route: '', deliveryDate: '', notes: ''
  });
  const [soItems, setSoItems] = useState<any[]>([]);

  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setSoForm(prev => ({ ...prev, deliveryDate: tomorrow.toISOString().split('T')[0] }));
    addSoLineItem();
  }, []);

  const handleCustomerSelect = (id: string) => {
    const c = CUSTOMERS.find(x => x.id === id);
    setSoForm({ ...soForm, customerId: id, route: c?.route || '' });
  };

  const addSoLineItem = (preset: any = null) => {
    const id = Date.now() + Math.random().toString();
    setSoItems(prev => [...prev, preset ? { ...preset, id } : { id, sku: '', uom: 'Case', qty: 1, price: 0, disc: 0, total: 0 }]);
  };

  const updateSoItem = (id: string, field: string, val: any) => {
    setSoItems(prev => prev.map(it => {
      if (it.id === id) {
        const updated = { ...it, [field]: val };
        if (field === 'sku') {
          const prod = FMCG_PRODUCTS.find(p => p.id === val);
          updated.price = prod ? (updated.uom === 'Case' ? prod.price : prod.price / 10) : 0;
        }
        if (field === 'uom') {
          const prod = FMCG_PRODUCTS.find(p => p.id === updated.sku);
          updated.price = prod ? (val === 'Case' ? prod.price : prod.price / 10) : 0;
        }
        
        const gross = updated.qty * updated.price;
        updated.total = gross - (gross * (updated.disc / 100));
        return updated;
      }
      return it;
    }));
  };

  const soGross = soItems.reduce((acc, it) => acc + (it.qty * it.price), 0);
  const soDiscount = soItems.reduce((acc, it) => acc + ((it.qty * it.price) * (it.disc / 100)), 0);
  const soTax = (soGross - soDiscount) * 0.10; // 10% GST
  const soNet = soGross - soDiscount + soTax;

  const handleSaveSO = () => {
    if (!soForm.customerId) return alert("Select a customer!");
    if (soItems.length === 0 || !soItems[0].sku) return alert("Add line items!");

    const c = CUSTOMERS.find(x => x.id === soForm.customerId);
    const newSO = {
      soNumber: 'SO-' + Math.floor(1000 + Math.random() * 9000),
      customer: c,
      ...soForm,
      items: soItems.filter(i => i.sku),
      grossAmount: soGross,
      discountAmount: soDiscount,
      taxAmount: soTax,
      netAmount: soNet,
      status: 'Pending POS',
      invoiceNumber: null, paymentMethod: null, vehicle: null, rider: null, podDetails: null
    };

    saveSOs([...salesOrders, newSO]);
    alert(`Sales Order ${newSO.soNumber} created successfully!`);
    setSoItems([]);
    addSoLineItem();
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold text-[#0F172A]">Order Management</h1>
        <p className="text-sm text-[#64748B]">Create new sales orders for field delivery.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 space-y-4">
          <h3 className="font-bold text-[#0F172A] border-b pb-2">Order Information</h3>
          <div>
            <label className="block text-xs font-semibold text-[#64748B] mb-1">Select Customer</label>
            <select value={soForm.customerId} onChange={e => handleCustomerSelect(e.target.value)} className="w-full border p-2 rounded text-sm text-[#0F172A]">
              <option value="">-- Choose Customer --</option>
              {CUSTOMERS.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-semibold text-[#64748B] mb-1">Sales Rep</label>
              <select className="w-full border p-2 rounded text-sm text-[#0F172A]"><option>Alex Vance</option><option>Sarah Jenkins</option></select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#64748B] mb-1">Type</label>
              <select className="w-full border p-2 rounded text-sm text-[#0F172A]"><option>GT</option><option>MT</option></select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#64748B] mb-1">Target Date</label>
            <input type="date" value={soForm.deliveryDate} onChange={e => setSoForm({...soForm, deliveryDate: e.target.value})} className="w-full border p-2 rounded text-sm text-[#0F172A]" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#64748B] mb-1">Notes</label>
            <textarea rows={2} value={soForm.notes} onChange={e => setSoForm({...soForm, notes: e.target.value})} className="w-full border p-2 rounded text-sm text-[#0F172A]" />
          </div>
        </div>

        <div className="lg:col-span-2 bg-white p-5 rounded-xl shadow-sm border border-slate-200 space-y-4">
          <div className="flex justify-between items-center border-b pb-2">
            <h3 className="font-bold text-[#0F172A]">Product Line Items</h3>
            <button onClick={() => addSoLineItem()} className="px-3 py-1.5 bg-sky-50 text-sky-700 hover:bg-sky-100 text-xs rounded-md font-bold transition">
              + Add Product
            </button>
          </div>
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-slate-50 border-b text-[#64748B] text-xs uppercase tracking-wider">
              <tr><th className="p-3">Product</th><th className="p-3">UOM</th><th className="p-3">Qty</th><th className="p-3">Price</th><th className="p-3">Disc %</th><th className="p-3 text-right">Total</th><th className="p-3"></th></tr>
            </thead>
            <tbody>
              {soItems.map(it => (
                <tr key={it.id} className="border-b text-[#0F172A]">
                  <td className="p-2">
                    <select value={it.sku} onChange={e => updateSoItem(it.id, 'sku', e.target.value)} className="w-full border border-slate-200 p-1.5 rounded text-sm">
                      <option value="">Select Item</option>
                      {FMCG_PRODUCTS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  </td>
                  <td className="p-2">
                    <select value={it.uom} onChange={e => updateSoItem(it.id, 'uom', e.target.value)} className="border border-slate-200 p-1.5 rounded text-sm"><option>Case</option><option>Piece</option></select>
                  </td>
                  <td className="p-2"><input type="number" min="1" value={it.qty} onChange={e => updateSoItem(it.id, 'qty', parseFloat(e.target.value)||0)} className="w-16 border border-slate-200 p-1.5 rounded text-sm text-center" /></td>
                  <td className="p-2"><input type="number" step="0.01" value={it.price} onChange={e => updateSoItem(it.id, 'price', parseFloat(e.target.value)||0)} className="w-20 border border-slate-200 p-1.5 rounded text-sm" /></td>
                  <td className="p-2"><input type="number" value={it.disc} onChange={e => updateSoItem(it.id, 'disc', parseFloat(e.target.value)||0)} className="w-16 border border-slate-200 p-1.5 rounded text-sm text-center" /></td>
                  <td className="p-2 font-bold text-right">$ {it.total.toFixed(2)}</td>
                  <td className="p-2 text-rose-500 cursor-pointer text-center font-bold" onClick={() => setSoItems(soItems.filter(x => x.id !== it.id))}>X</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 flex flex-col items-end text-sm space-y-2 mt-4 text-[#0F172A]">
            <div className="flex w-64 justify-between"><span>Gross Total:</span><span className="font-semibold">$ {soGross.toFixed(2)}</span></div>
            <div className="flex w-64 justify-between text-emerald-600"><span>Discount:</span><span className="font-semibold">- $ {soDiscount.toFixed(2)}</span></div>
            <div className="flex w-64 justify-between"><span>Estimated Tax (10%):</span><span className="font-semibold">$ {soTax.toFixed(2)}</span></div>
            <div className="flex w-64 justify-between border-t pt-2 mt-1 font-bold text-base text-sky-700"><span>Net Payable:</span><span>$ {soNet.toFixed(2)}</span></div>
          </div>
          <div className="flex justify-end pt-4">
            <button onClick={handleSaveSO} className="px-6 py-2.5 bg-[#0F172A] hover:bg-slate-800 text-white rounded-md font-semibold text-sm transition shadow-sm">
              Create Sales Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
