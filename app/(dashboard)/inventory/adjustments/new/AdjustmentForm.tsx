"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createStockAdjustment } from "@/app/actions/inventory";

export default function AdjustmentForm({ warehouses, products, accounts }: { warehouses: any[], products: any[], accounts: any[] }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [warehouseId, setWarehouseId] = useState(warehouses[0]?.id || "");
  const [type, setType] = useState<"ADDITION" | "DEDUCTION">("DEDUCTION");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [adjustNumber, setAdjustNumber] = useState(`ADJ-${Math.floor(Math.random() * 10000)}`);
  const [offsetAccountId, setOffsetAccountId] = useState("");
  const [notes, setNotes] = useState("");
  
  const [items, setItems] = useState([{ productId: "", qty: 1, unitCost: 0 }]);

  const addItem = () => setItems([...items, { productId: "", qty: 1, unitCost: 0 }]);
  const removeItem = (index: number) => items.length > 1 && setItems(items.filter((_, i) => i !== index));

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items];
    if (field === "productId") {
      const product = products.find(p => p.id === value);
      newItems[index] = { ...newItems[index], productId: value, unitCost: product?.cost || 0 };
    } else {
      newItems[index] = { ...newItems[index], [field]: value };
    }
    setItems(newItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!warehouseId || !offsetAccountId || items.some(i => !i.productId || i.qty <= 0)) {
      alert("Please fill all required fields and ensure quantities are > 0.");
      return;
    }
    setIsSubmitting(true);
    try {
      await createStockAdjustment({ warehouseId, type, date, adjustNumber, offsetAccountId, notes, items });
      router.push("/inventory");
    } catch (err: any) {
      alert(err.message || "Failed to adjust stock.");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-[#E2E8F0] space-y-6 bg-slate-50">
        <div className="flex gap-6 items-center">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" checked={type === "DEDUCTION"} onChange={() => setType("DEDUCTION")} className="w-4 h-4 text-rose-600 focus:ring-rose-500" />
            <span className="font-semibold text-rose-700">Deduct Stock (Shrinkage/Damage)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" checked={type === "ADDITION"} onChange={() => setType("ADDITION")} className="w-4 h-4 text-teal-600 focus:ring-teal-500" />
            <span className="font-semibold text-teal-700">Add Stock (Found/Initial)</span>
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#0F172A]">Warehouse</label>
            <select value={warehouseId} onChange={e => setWarehouseId(e.target.value)} required className="px-3 py-2 border border-[#E2E8F0] rounded-md text-sm">
              <option value="">Select...</option>
              {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#0F172A]">GL Account ({type === "DEDUCTION" ? "Expense" : "Income"})</label>
            <select value={offsetAccountId} onChange={e => setOffsetAccountId(e.target.value)} required className="px-3 py-2 border border-[#E2E8F0] rounded-md text-sm">
              <option value="">Select Account...</option>
              {accounts.map(a => <option key={a.id} value={a.id}>{a.code} - {a.name}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#0F172A]">Adjustment #</label>
            <input value={adjustNumber} onChange={e => setAdjustNumber(e.target.value)} type="text" required className="px-3 py-2 border border-[#E2E8F0] rounded-md font-mono text-sm" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#0F172A]">Date</label>
            <input value={date} onChange={e => setDate(e.target.value)} type="date" required className="px-3 py-2 border border-[#E2E8F0] rounded-md text-sm" />
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-[#0F172A]">Items to Adjust</h2>
          <button type="button" onClick={addItem} className="text-sm font-medium text-teal-600 hover:text-teal-800 bg-teal-50 px-3 py-1.5 rounded-md">+ Add Item</button>
        </div>
        
        <table className="w-full text-left text-sm mb-6 border-collapse">
          <thead className="bg-[#F8FAFC] border border-[#E2E8F0]">
            <tr>
              <th className="px-4 py-3 font-semibold w-1/2">Product</th>
              <th className="px-4 py-3 font-semibold w-32">Qty ({type === "DEDUCTION" ? "-" : "+"})</th>
              <th className="px-4 py-3 font-semibold w-32">Unit Cost (Rs)</th>
              <th className="px-4 py-3 font-semibold w-32 text-right">Total Value</th>
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
                  <input type="number" min="0" step="0.01" value={item.unitCost} onChange={e => updateItem(index, 'unitCost', parseFloat(e.target.value) || 0)} required className="w-full px-2 py-1.5 border border-[#E2E8F0] rounded font-mono text-sm text-right" />
                </td>
                <td className="p-2 border-x border-[#E2E8F0] text-right font-mono font-medium">
                  {(item.qty * item.unitCost).toFixed(2)}
                </td>
                <td className="p-2 border-r border-[#E2E8F0] text-center">
                  <button type="button" onClick={() => removeItem(index)} className="text-red-500 hover:text-red-700">✕</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div className="w-1/2">
          <label className="text-sm font-semibold text-[#0F172A] block mb-1">Reason / Notes</label>
          <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} placeholder="e.g. Stock damaged by water, found in audit..." className="w-full px-3 py-2 border border-[#E2E8F0] rounded-md text-sm" />
        </div>
      </div>

      <div className="p-4 border-t border-[#E2E8F0] bg-gray-50 flex justify-end gap-4">
        <button type="submit" disabled={isSubmitting} className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2 rounded-md text-sm font-semibold transition-all disabled:opacity-70">
          {isSubmitting ? "Processing..." : "Confirm Adjustment"}
        </button>
      </div>
    </form>
  );
}
