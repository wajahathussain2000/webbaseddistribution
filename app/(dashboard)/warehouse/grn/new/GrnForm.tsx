"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createGRN } from "@/app/actions/warehouse";
import AiScannerButton from "@/app/components/AiScannerButton";

export default function GrnForm({ pendingPOs, warehouses }: { pendingPOs: any[], warehouses: any[] }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [selectedPoId, setSelectedPoId] = useState("");
  const [warehouseId, setWarehouseId] = useState(warehouses[0]?.id || "");
  const [grnNumber, setGrnNumber] = useState(`GRN-${Math.floor(Math.random() * 10000)}`);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [notes, setNotes] = useState("");
  
  const selectedPO = pendingPOs.find(po => po.id === selectedPoId);

  // Default receive quantities to the PO quantities
  const [receiveData, setReceiveData] = useState<Record<string, number>>({});

  const handlePoSelect = (poId: string) => {
    setSelectedPoId(poId);
    const po = pendingPOs.find(p => p.id === poId);
    if (po) {
      const initialData: Record<string, number> = {};
      po.items.forEach((item: any) => {
        initialData[item.productId] = item.qty;
      });
      setReceiveData(initialData);
    } else {
      setReceiveData({});
    }
  };

  const handleReceiveQtyChange = (productId: string, qty: number) => {
    setReceiveData(prev => ({ ...prev, [productId]: qty }));
  };

  const handleScanData = (data: any) => {
    if (!selectedPO) {
      alert("Please select a PO first before scanning the supplier invoice/GRN.");
      return;
    }
    
    if (data.notes) setNotes(data.notes);
    if (data.expectedDate) setDate(data.expectedDate);

    if (data.items && data.items.length > 0) {
      const newReceiveData = { ...receiveData };
      let matchedCount = 0;

      data.items.forEach((aiItem: any) => {
        // Find matching product in the selected PO
        const matchedPoItem = selectedPO.items.find((poItem: any) => 
          poItem.product.nameEn.toLowerCase().includes(aiItem.name.toLowerCase()) || 
          aiItem.name.toLowerCase().includes(poItem.product.nameEn.toLowerCase())
        );

        if (matchedPoItem) {
          newReceiveData[matchedPoItem.productId] = aiItem.qty;
          matchedCount++;
        }
      });

      setReceiveData(newReceiveData);
      alert(`AI matched and filled ${matchedCount} items from the scanned document!`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPoId || !warehouseId) {
      alert("Please select a PO and a warehouse.");
      return;
    }

    if (!selectedPO) return;

    const items = selectedPO.items.map((item: any) => ({
      productId: item.productId,
      uomId: item.uomId,
      qtyReceived: receiveData[item.productId] || 0,
      unitCost: item.rate
    })).filter((i: any) => i.qtyReceived > 0);

    if (items.length === 0) {
      alert("Please receive at least one item.");
      return;
    }

    setIsSubmitting(true);
    try {
      await createGRN({
        poId: selectedPoId,
        grnNumber,
        date,
        notes,
        warehouseId,
        items
      });
      router.push("/warehouse"); // Or wherever GRN list is
    } catch (err: any) {
      alert(err.message || "Failed to create GRN.");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-[#E2E8F0] space-y-6 bg-slate-50">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#0F172A]">Select Pending PO</label>
            <select value={selectedPoId} onChange={e => handlePoSelect(e.target.value)} required className="px-3 py-2 border border-[#E2E8F0] rounded-md text-sm shadow-sm focus:ring-teal-500">
              <option value="">-- Choose a Purchase Order --</option>
              {pendingPOs.map(po => (
                <option key={po.id} value={po.id}>{po.poNumber} - {po.supplier.name} (Items: {po.items.length})</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#0F172A]">Receive to Warehouse</label>
            <select value={warehouseId} onChange={e => setWarehouseId(e.target.value)} required className="px-3 py-2 border border-[#E2E8F0] rounded-md text-sm shadow-sm">
              <option value="">Select Warehouse...</option>
              {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#0F172A]">GRN Number</label>
            <input value={grnNumber} onChange={e => setGrnNumber(e.target.value)} type="text" required className="px-3 py-2 border border-[#E2E8F0] rounded-md font-mono text-sm bg-white" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#0F172A]">Date</label>
            <input value={date} onChange={e => setDate(e.target.value)} type="date" required className="px-3 py-2 border border-[#E2E8F0] rounded-md text-sm bg-white" />
          </div>
        </div>
      </div>

      {selectedPO && (
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-[#0F172A]">Items in PO {selectedPO.poNumber}</h2>
            <AiScannerButton onScanComplete={handleScanData} buttonText="Scan Supplier Bill/Challan" />
          </div>
          
          <table className="w-full text-left text-sm mb-6 border-collapse">
            <thead className="bg-[#F8FAFC] border border-[#E2E8F0]">
              <tr>
                <th className="px-4 py-3 font-semibold">Product Name</th>
                <th className="px-4 py-3 font-semibold text-right w-32">PO Qty</th>
                <th className="px-4 py-3 font-semibold text-center w-40">Qty Received</th>
                <th className="px-4 py-3 font-semibold text-right w-32">Unit Cost</th>
              </tr>
            </thead>
            <tbody>
              {selectedPO.items.map((item: any) => (
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
                      max={item.qty} // Basic validation to prevent over-receiving
                      value={receiveData[item.productId] ?? 0} 
                      onChange={e => handleReceiveQtyChange(item.productId, parseFloat(e.target.value) || 0)} 
                      className="w-full px-3 py-2 border border-[#E2E8F0] rounded text-sm text-center font-bold text-teal-700 bg-teal-50 focus:ring-teal-500" 
                    />
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-slate-500 border-x border-[#E2E8F0]">
                    Rs {item.rate.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div className="w-1/2">
            <label className="text-sm font-semibold text-[#0F172A] block mb-1">Receiving Notes / Truck Info</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} placeholder="e.g. Truck number, driver name, condition..." className="w-full px-3 py-2 border border-[#E2E8F0] rounded-md text-sm" />
          </div>
        </div>
      )}

      {selectedPO && (
        <div className="p-4 border-t border-[#E2E8F0] bg-gray-50 flex justify-end gap-4">
          <button type="submit" disabled={isSubmitting} className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2 rounded-md text-sm font-semibold transition-all disabled:opacity-70">
            {isSubmitting ? "Generating GRN..." : "Generate GRN & Update Stock"}
          </button>
        </div>
      )}
      
      {!selectedPO && (
        <div className="p-12 text-center text-slate-500 bg-white">
          <svg className="w-12 h-12 mx-auto text-slate-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p>Select a pending Purchase Order from the dropdown to start receiving items.</p>
        </div>
      )}
    </form>
  );
}
