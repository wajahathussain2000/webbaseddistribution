"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSalesInvoice } from "@/app/actions/salesInvoice";

export default function InvoiceForm({ pendingSOs, warehouses, accounts }: { pendingSOs: any[], warehouses: any[], accounts: any[] }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [selectedSoId, setSelectedSoId] = useState("");
  const [warehouseId, setWarehouseId] = useState(warehouses[0]?.id || "");
  const [accountId, setAccountId] = useState(accounts[0]?.id || "");
  const [invoiceNumber, setInvoiceNumber] = useState(`INV-${Math.floor(Math.random() * 10000)}`);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  
  const selectedSO = pendingSOs.find(so => so.id === selectedSoId);

  // Default to full quantity for MVP
  const [deliverData, setDeliverData] = useState<Record<string, number>>({});

  const handleSoSelect = (soId: string) => {
    setSelectedSoId(soId);
    const so = pendingSOs.find(p => p.id === soId);
    if (so) {
      const initialData: Record<string, number> = {};
      so.items.forEach((item: any) => {
        initialData[item.productId] = item.qty;
      });
      setDeliverData(initialData);
    } else {
      setDeliverData({});
    }
  };

  const handleDeliverQtyChange = (productId: string, qty: number) => {
    setDeliverData(prev => ({ ...prev, [productId]: qty }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSoId || !warehouseId || !accountId) {
      alert("Please select an Order, Warehouse, and Payment Account.");
      return;
    }

    if (!selectedSO) return;

    const items = selectedSO.items.map((item: any) => ({
      productId: item.productId,
      uomId: item.uomId,
      qty: deliverData[item.productId] || 0,
      rate: item.rate
    })).filter((i: any) => i.qty > 0);

    if (items.length === 0) {
      alert("Please deliver at least one item.");
      return;
    }

    setIsSubmitting(true);
    try {
      await createSalesInvoice({
        orderId: selectedSoId,
        invoiceNumber,
        date,
        warehouseId,
        accountId,
        items
      });
      router.push("/sales"); 
    } catch (err: any) {
      alert(err.message || "Failed to create Sales Invoice.");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-[#E2E8F0] space-y-6 bg-slate-50">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#0F172A]">Select Pending Sales Order</label>
            <select value={selectedSoId} onChange={e => handleSoSelect(e.target.value)} required className="px-3 py-2 border border-[#E2E8F0] rounded-md text-sm shadow-sm focus:ring-teal-500">
              <option value="">-- Choose a Sales Order --</option>
              {pendingSOs.map(so => (
                <option key={so.id} value={so.id}>{so.orderNumber} - {so.customer.name} (Items: {so.items.length})</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#0F172A]">Dispatch from Warehouse</label>
            <select value={warehouseId} onChange={e => setWarehouseId(e.target.value)} required className="px-3 py-2 border border-[#E2E8F0] rounded-md text-sm shadow-sm">
              <option value="">Select Warehouse...</option>
              {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#0F172A]">Payment Method / GL (For AR/Cash)</label>
            <select value={accountId} onChange={e => setAccountId(e.target.value)} required className="px-3 py-2 border border-[#E2E8F0] rounded-md text-sm shadow-sm">
              <option value="">Select Account...</option>
              {accounts.map(a => <option key={a.id} value={a.id}>{a.code} - {a.name}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#0F172A]">Invoice Number</label>
            <input value={invoiceNumber} onChange={e => setInvoiceNumber(e.target.value)} type="text" required className="px-3 py-2 border border-[#E2E8F0] rounded-md font-mono text-sm bg-white" />
          </div>
        </div>
      </div>

      {selectedSO && (
        <div className="p-6">
          <h2 className="text-lg font-semibold text-[#0F172A] mb-4">Items to Dispatch</h2>
          
          <table className="w-full text-left text-sm mb-6 border-collapse">
            <thead className="bg-[#F8FAFC] border border-[#E2E8F0]">
              <tr>
                <th className="px-4 py-3 font-semibold">Product Name</th>
                <th className="px-4 py-3 font-semibold text-right w-32">Order Qty</th>
                <th className="px-4 py-3 font-semibold text-center w-40">Qty to Deliver</th>
                <th className="px-4 py-3 font-semibold text-right w-32">Rate</th>
                <th className="px-4 py-3 font-semibold text-right w-32">Amount</th>
              </tr>
            </thead>
            <tbody>
              {selectedSO.items.map((item: any) => (
                <tr key={item.id} className="border-b border-[#E2E8F0]">
                  <td className="px-4 py-3 font-medium text-slate-900 border-x border-[#E2E8F0]">
                    {item.product.nameEn}
                    <div className="text-xs text-slate-500 font-mono mt-1">{item.product.code}</div>
                  </td>
                  <td className="px-4 py-3 text-right text-slate-600 font-mono border-x border-[#E2E8F0]">
                    {item.qty}
                  </td>
                  <td className="px-4 py-2 border-x border-[#E2E8F0]">
                    <input 
                      type="number" 
                      min="0" 
                      max={item.qty} 
                      value={deliverData[item.productId] ?? 0} 
                      onChange={e => handleDeliverQtyChange(item.productId, parseFloat(e.target.value) || 0)} 
                      className="w-full px-3 py-2 border border-[#E2E8F0] rounded text-sm text-center font-bold text-teal-700 bg-teal-50 focus:ring-teal-500" 
                    />
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-slate-500 border-x border-[#E2E8F0]">
                    Rs {item.rate.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-slate-800 border-x border-[#E2E8F0]">
                    Rs {((deliverData[item.productId] ?? 0) * item.rate).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedSO && (
        <div className="p-4 border-t border-[#E2E8F0] bg-gray-50 flex justify-end gap-4">
          <button type="submit" disabled={isSubmitting} className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2 rounded-md text-sm font-semibold transition-all disabled:opacity-70">
            {isSubmitting ? "Generating Invoice..." : "Generate Invoice & Dispatch"}
          </button>
        </div>
      )}
      
      {!selectedSO && (
        <div className="p-12 text-center text-slate-500 bg-white">
          <svg className="w-12 h-12 mx-auto text-slate-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p>Select a pending Sales Order from the dropdown to start the dispatch process.</p>
        </div>
      )}
    </form>
  );
}
