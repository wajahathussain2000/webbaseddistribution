"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createPurchaseReturn } from "@/app/actions/returns";

export default function PurchaseReturnForm({ suppliers, warehouses, products, accounts }: { suppliers: any[], warehouses: any[], products: any[], accounts: any[] }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [supplierId, setSupplierId] = useState(suppliers[0]?.id || "");
  const [warehouseId, setWarehouseId] = useState(warehouses[0]?.id || "");
  const [accountId, setAccountId] = useState(accounts.find(a => a.type === "LIABILITY")?.id || "");
  const [returnNumber, setReturnNumber] = useState(`PR-${Math.floor(Math.random() * 10000)}`);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [reason, setReason] = useState("");
  
  const [items, setItems] = useState([{ productId: "", uomId: "uom-id-placeholder", qty: 1, amount: 0, reason: "" }]);

  const addItem = () => setItems([...items, { productId: "", uomId: "uom-id-placeholder", qty: 1, amount: 0, reason: "" }]);
  const removeItem = (index: number) => items.length > 1 && setItems(items.filter((_, i) => i !== index));

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplierId || !warehouseId || !accountId || items.some(i => !i.productId || i.qty <= 0)) {
      alert("Please fill all required fields properly.");
      return;
    }
    setIsSubmitting(true);
    try {
      await createPurchaseReturn({ supplierId, returnNumber, date, warehouseId, accountId, reason, items });
      router.push("/purchase");
    } catch (err: any) {
      alert(err.message || "Failed to process return.");
      setIsSubmitting(false);
    }
  };

  const totalReturnAmount = items.reduce((sum, item) => sum + item.amount, 0);

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-[#E2E8F0] space-y-6 bg-slate-50">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#0F172A]">Supplier / Vendor</label>
            <select value={supplierId} onChange={e => setSupplierId(e.target.value)} required className="px-3 py-2 border border-[#E2E8F0] rounded-md text-sm">
              <option value="">Select...</option>
              {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#0F172A]">Deduct Stock From</label>
            <select value={warehouseId} onChange={e => setWarehouseId(e.target.value)} required className="px-3 py-2 border border-[#E2E8F0] rounded-md text-sm">
              <option value="">Select...</option>
              {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#0F172A]">Debit Account (AP/Cash)</label>
            <select value={accountId} onChange={e => setAccountId(e.target.value)} required className="px-3 py-2 border border-[#E2E8F0] rounded-md text-sm">
              <option value="">Select...</option>
              {accounts.map(a => <option key={a.id} value={a.id}>{a.code} - {a.name}</option>)}
            </select>
            <p className="text-xs text-slate-500">Select Accounts Payable to reduce liability.</p>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#0F172A]">Debit Note #</label>
            <input value={returnNumber} onChange={e => setReturnNumber(e.target.value)} type="text" required className="px-3 py-2 border border-[#E2E8F0] rounded-md font-mono text-sm bg-white" />
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-[#0F172A]">Returned Items</h2>
          <button type="button" onClick={addItem} className="text-sm font-medium text-teal-600 hover:text-teal-800 bg-teal-50 px-3 py-1.5 rounded-md">+ Add Item</button>
        </div>
        
        <table className="w-full text-left text-sm mb-6 border-collapse">
          <thead className="bg-[#F8FAFC] border border-[#E2E8F0]">
            <tr>
              <th className="px-4 py-3 font-semibold w-1/3">Product</th>
              <th className="px-4 py-3 font-semibold w-24">Qty</th>
              <th className="px-4 py-3 font-semibold w-32">Total Debit Amount</th>
              <th className="px-4 py-3 font-semibold w-1/4">Reason (Optional)</th>
              <th className="px-4 py-3 font-semibold w-12"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index} className="border-b border-[#E2E8F0]">
                <td className="p-2 border-x border-[#E2E8F0]">
                  <select value={item.productId} onChange={e => updateItem(index, 'productId', e.target.value)} required className="w-full px-2 py-1.5 border border-[#E2E8F0] rounded text-sm">
                    <option value="">Select Product...</option>
                    {products.map(p => <option key={p.id} value={p.id}>{p.code} - {p.nameEn}</option>)}
                  </select>
                </td>
                <td className="p-2 border-x border-[#E2E8F0]">
                  <input type="number" min="1" value={item.qty} onChange={e => updateItem(index, 'qty', parseFloat(e.target.value) || 0)} required className="w-full px-2 py-1.5 border border-[#E2E8F0] rounded text-sm text-center" />
                </td>
                <td className="p-2 border-x border-[#E2E8F0]">
                  <input type="number" min="0" step="0.01" value={item.amount} onChange={e => updateItem(index, 'amount', parseFloat(e.target.value) || 0)} required className="w-full px-2 py-1.5 border border-[#E2E8F0] rounded font-mono text-sm text-right" />
                </td>
                <td className="p-2 border-x border-[#E2E8F0]">
                  <input type="text" value={item.reason} onChange={e => updateItem(index, 'reason', e.target.value)} placeholder="Defective, Expired..." className="w-full px-2 py-1.5 border border-[#E2E8F0] rounded text-sm" />
                </td>
                <td className="p-2 border-r border-[#E2E8F0] text-center">
                  <button type="button" onClick={() => removeItem(index)} className="text-red-500 hover:text-red-700">✕</button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-slate-50">
            <tr>
              <td colSpan={2} className="px-4 py-3 text-right font-semibold">Total Supplier Debit:</td>
              <td className="px-4 py-3 text-right font-mono font-bold text-teal-600 text-lg border-x border-[#E2E8F0]">
                Rs {totalReturnAmount.toFixed(2)}
              </td>
              <td colSpan={2}></td>
            </tr>
          </tfoot>
        </table>
        
        <div className="w-1/2">
          <label className="text-sm font-semibold text-[#0F172A] block mb-1">General Notes</label>
          <textarea value={reason} onChange={e => setReason(e.target.value)} rows={2} className="w-full px-3 py-2 border border-[#E2E8F0] rounded-md text-sm" />
        </div>
      </div>

      <div className="p-4 border-t border-[#E2E8F0] bg-gray-50 flex justify-end gap-4">
        <button type="submit" disabled={isSubmitting} className="bg-rose-600 hover:bg-rose-700 text-white px-6 py-2 rounded-md text-sm font-semibold transition-all disabled:opacity-70">
          {isSubmitting ? "Processing..." : "Confirm Purchase Return"}
        </button>
      </div>
    </form>
  );
}
