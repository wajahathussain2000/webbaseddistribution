"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddReceiptModal() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    customerId: "", // In a real app this would be a dropdown/search of customers
    amount: 0,
    paymentMethod: "CASH",
    reference: "",
    status: "CLEARED"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Fallback if no customer ID is provided (for demo purposes)
    const finalData = {
      ...formData,
      customerId: formData.customerId || "demo-customer" // Dummy fallback
    };

    try {
      const res = await fetch("/api/receipts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalData)
      });
      if (res.ok) {
        setIsOpen(false);
        router.refresh();
      } else {
        alert("Failed to add receipt");
      }
    } catch (err) {
      console.error(err);
      alert("Error adding receipt");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-700 hover:to-emerald-600 text-white px-4 py-2 rounded-md text-sm font-semibold shadow-md transition-all active:scale-[0.98]"
      >
        + New Receipt
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
            <h2 className="text-xl font-bold text-[#0F172A] mb-4">Create Collection Receipt</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-[#64748B] mb-1">Customer ID (Demo: Leave empty for default)</label>
                  <input type="text" placeholder="CUST-1234" className="w-full border p-2 rounded text-sm text-[#0F172A]" value={formData.customerId} onChange={e => setFormData({...formData, customerId: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#64748B] mb-1">Amount Received (Rs)</label>
                  <input required type="number" min="1" className="w-full border p-2 rounded text-sm text-[#0F172A]" value={formData.amount} onChange={e => setFormData({...formData, amount: Number(e.target.value)})} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#64748B] mb-1">Payment Method</label>
                  <select className="w-full border p-2 rounded text-sm text-[#0F172A]" value={formData.paymentMethod} onChange={e => setFormData({...formData, paymentMethod: e.target.value})}>
                    <option value="CASH">Cash</option>
                    <option value="CHEQUE">Cheque (PDC)</option>
                    <option value="TRANSFER">Bank Transfer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#64748B] mb-1">Reference (Cheque #)</label>
                  <input type="text" className="w-full border p-2 rounded text-sm text-[#0F172A]" value={formData.reference} onChange={e => setFormData({...formData, reference: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#64748B] mb-1">Status</label>
                  <select className="w-full border p-2 rounded text-sm text-[#0F172A]" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                    <option value="CLEARED">Cleared / Cash</option>
                    <option value="PENDING">Pending (PDC)</option>
                    <option value="BOUNCED">Bounced</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 text-sm text-[#64748B] font-semibold hover:bg-gray-100 rounded">
                  Cancel
                </button>
                <button disabled={loading} type="submit" className="px-4 py-2 text-sm text-white font-semibold bg-teal-600 hover:bg-teal-700 rounded disabled:opacity-50">
                  {loading ? 'Processing...' : 'Generate Receipt'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
