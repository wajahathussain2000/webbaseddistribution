"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createPurchaseOrder } from "@/app/actions/purchase";

export default function PurchaseOrderForm({ suppliers, products }: { suppliers: any[], products: any[] }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form State
  const [supplierId, setSupplierId] = useState(suppliers[0]?.id || "");
  const [poNumber, setPoNumber] = useState(`PO-${Math.floor(Math.random() * 10000)}`);
  const [expectedDate, setExpectedDate] = useState("");
  const [notes, setNotes] = useState("");
  
  // Dynamic Line Items State
  const [items, setItems] = useState([
    { productId: "", qty: 1, rate: 0, uomId: "", barcode: "" }
  ]);

  const addItem = () => {
    setItems([...items, { productId: "", qty: 1, rate: 0, uomId: "", barcode: "" }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items];
    if (field === "productId") {
      const product = products.find(p => p.id === value);
      newItems[index] = { 
        ...newItems[index], 
        productId: value, 
        rate: product ? product.cost || product.tradePrice : 0,
        uomId: product ? product.baseUomId : "",
        barcode: product && product.barcode ? product.barcode : ""
      };
    } else {
      newItems[index] = { ...newItems[index], [field]: value };
    }
    setItems(newItems);
  };

  const subtotal = items.reduce((sum, item) => sum + (item.qty * item.rate), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplierId || items.some(i => !i.productId)) {
      alert("Please select a supplier and ensure all items have a product selected.");
      return;
    }
    setIsSubmitting(true);
    await createPurchaseOrder({
      supplierId,
      poNumber,
      expectedDate,
      notes,
      items
    });
    router.push("/purchase");
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden">
      {/* Header Info */}
      <div className="p-6 border-b border-[#E2E8F0] space-y-6">
        <h2 className="text-lg font-semibold text-[#0F172A]">Order Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#0F172A]">Supplier</label>
            <select 
              value={supplierId} onChange={e => setSupplierId(e.target.value)} required
              className="px-3 py-2 border border-[#E2E8F0] rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
            >
              <option value="">Select Supplier...</option>
              {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#0F172A]">PO Number</label>
            <input value={poNumber} onChange={e => setPoNumber(e.target.value)} type="text" required className="px-3 py-2 border border-[#E2E8F0] rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono text-sm bg-gray-50" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#0F172A]">Expected Delivery</label>
            <input value={expectedDate} onChange={e => setExpectedDate(e.target.value)} type="date" className="px-3 py-2 border border-[#E2E8F0] rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm" />
          </div>
        </div>
      </div>

      {/* Line Items */}
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-[#0F172A]">Line Items</h2>
          <button type="button" onClick={addItem} className="text-sm font-medium text-teal-600 hover:text-teal-800 bg-teal-50 px-3 py-1.5 rounded-md">
            + Add Row
          </button>
        </div>
        
        <table className="w-full text-left text-sm mb-6 border-collapse">
          <thead className="bg-[#F8FAFC] border border-[#E2E8F0] text-[#64748B]">
            <tr>
              <th className="px-4 py-3 font-semibold w-1/3">Product</th>
              <th className="px-4 py-3 font-semibold w-32">Barcode</th>
              <th className="px-4 py-3 font-semibold w-24">Qty</th>
              <th className="px-4 py-3 font-semibold w-24">Rate (Rs)</th>
              <th className="px-4 py-3 font-semibold w-24 text-right">Total</th>
              <th className="px-4 py-3 font-semibold w-12 text-center"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index} className="border-b border-[#E2E8F0]">
                <td className="p-2 border-x border-[#E2E8F0]">
                  <select 
                    value={item.productId} onChange={e => updateItem(index, 'productId', e.target.value)} required
                    className="w-full px-2 py-1.5 border border-[#E2E8F0] rounded focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                  >
                    <option value="">Select Product...</option>
                    {products.map(p => <option key={p.id} value={p.id}>{p.code} - {p.nameEn}</option>)}
                  </select>
                </td>
                <td className="p-2 border-x border-[#E2E8F0]">
                  <input type="text" placeholder="Scan/Enter" value={item.barcode || ""} onChange={e => updateItem(index, 'barcode', e.target.value)} className="w-full px-2 py-1.5 border border-[#E2E8F0] rounded focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm font-mono" />
                </td>
                <td className="p-2 border-x border-[#E2E8F0]">
                  <input type="number" min="1" value={item.qty} onChange={e => updateItem(index, 'qty', parseFloat(e.target.value) || 0)} required className="w-full px-2 py-1.5 border border-[#E2E8F0] rounded focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm text-center" />
                </td>
                <td className="p-2 border-x border-[#E2E8F0]">
                  <input type="number" min="0" step="0.01" value={item.rate} onChange={e => updateItem(index, 'rate', parseFloat(e.target.value) || 0)} required className="w-full px-2 py-1.5 border border-[#E2E8F0] rounded focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono text-sm text-right" />
                </td>
                <td className="p-2 border-x border-[#E2E8F0] text-right font-mono font-medium text-[#0F172A] bg-gray-50">
                  {(item.qty * item.rate).toFixed(2)}
                </td>
                <td className="p-2 border-r border-[#E2E8F0] text-center">
                  <button type="button" onClick={() => removeItem(index)} className="text-red-500 hover:text-red-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div className="flex justify-between items-start">
          <div className="w-1/2">
            <label className="text-sm font-semibold text-[#0F172A] block mb-1">Notes</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} placeholder="Add any special instructions for the supplier..." className="w-full px-3 py-2 border border-[#E2E8F0] rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm" />
          </div>
          <div className="w-1/3 bg-[#F8FAFC] p-4 rounded-lg border border-[#E2E8F0]">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[#64748B] text-sm">Subtotal</span>
              <span className="font-mono text-[#0F172A]">Rs {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center border-t border-[#E2E8F0] pt-2 mt-2">
              <span className="font-semibold text-[#0F172A]">Total Amount</span>
              <span className="font-bold font-mono text-xl text-teal-700">Rs {subtotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-[#E2E8F0] bg-gray-50 flex justify-end gap-4">
        <Link href="/purchase" className="px-4 py-2 text-sm font-medium text-[#64748B] hover:text-[#0F172A]">
          Cancel
        </Link>
        <button type="submit" disabled={isSubmitting} className="bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-700 hover:to-emerald-600 text-white px-6 py-2 rounded-md text-sm font-semibold shadow-md transition-all active:scale-[0.98] disabled:opacity-70">
          {isSubmitting ? "Creating PO..." : "Save Purchase Order"}
        </button>
      </div>
    </form>
  );
}
