"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddCustomerModal() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    shopName: "",
    phone: "",
    category: "RETAILER",
    creditLimit: 0,
    creditDays: 30,
    status: "ACTIVE"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setIsOpen(false);
        router.refresh();
      } else {
        alert("Failed to add customer");
      }
    } catch (err) {
      console.error(err);
      alert("Error adding customer");
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
        + Add Customer
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
            <h2 className="text-xl font-bold text-[#0F172A] mb-4">Add New Customer</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#64748B] mb-1">Customer Name</label>
                  <input required type="text" className="w-full border p-2 rounded text-sm text-[#0F172A]" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#64748B] mb-1">Shop Name</label>
                  <input type="text" className="w-full border p-2 rounded text-sm text-[#0F172A]" value={formData.shopName} onChange={e => setFormData({...formData, shopName: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#64748B] mb-1">Phone</label>
                  <input type="text" className="w-full border p-2 rounded text-sm text-[#0F172A]" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#64748B] mb-1">Category</label>
                  <select className="w-full border p-2 rounded text-sm text-[#0F172A]" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                    <option value="RETAILER">Retailer</option>
                    <option value="PHARMACY">Pharmacy</option>
                    <option value="HOSPITAL">Hospital</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#64748B] mb-1">Credit Limit (Rs)</label>
                  <input required type="number" min="0" className="w-full border p-2 rounded text-sm text-[#0F172A]" value={formData.creditLimit} onChange={e => setFormData({...formData, creditLimit: Number(e.target.value)})} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#64748B] mb-1">Credit Days</label>
                  <input required type="number" min="0" className="w-full border p-2 rounded text-sm text-[#0F172A]" value={formData.creditDays} onChange={e => setFormData({...formData, creditDays: Number(e.target.value)})} />
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 text-sm text-[#64748B] font-semibold hover:bg-gray-100 rounded">
                  Cancel
                </button>
                <button disabled={loading} type="submit" className="px-4 py-2 text-sm text-white font-semibold bg-teal-600 hover:bg-teal-700 rounded disabled:opacity-50">
                  {loading ? 'Saving...' : 'Save Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
