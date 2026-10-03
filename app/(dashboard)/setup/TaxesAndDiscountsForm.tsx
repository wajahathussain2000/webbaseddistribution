"use client";

import { useState } from "react";
import { saveSystemSettings } from "@/app/actions/setup";

export default function TaxesAndDiscountsForm({ settings }: { settings: Record<string, string> }) {
  const [defaultTaxPct, setDefaultTaxPct] = useState(settings["DEFAULT_TAX_PCT"] || "0");
  const [defaultDiscountPct, setDefaultDiscountPct] = useState(settings["DEFAULT_DISCOUNT_PCT"] || "0");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await saveSystemSettings([
        { key: "DEFAULT_TAX_PCT", value: defaultTaxPct },
        { key: "DEFAULT_DISCOUNT_PCT", value: defaultDiscountPct },
      ]);
      alert("Tax & Discount master settings saved successfully! They will now auto-apply on POS and Invoices.");
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden flex flex-col mb-6">
      <div className="p-4 border-b border-[#E2E8F0] flex gap-4 bg-gray-50/50 items-center justify-between">
        <div className="flex items-center gap-2">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-rose-600"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          <h2 className="font-bold text-[#0F172A]">Master Tax & Discount Defaults</h2>
        </div>
        <button disabled={isSubmitting} type="submit" className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-1.5 rounded-md text-sm font-semibold transition-colors">
          {isSubmitting ? "Saving..." : "Save Defaults"}
        </button>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-sm font-semibold text-slate-700 block mb-1">Global Default Tax (%)</label>
          <input 
            value={defaultTaxPct} 
            onChange={e => setDefaultTaxPct(e.target.value)} 
            type="number" 
            step="0.01"
            className="w-full px-3 py-2 border rounded-md focus:ring-rose-500 focus:border-rose-500" 
            required 
          />
          <p className="text-xs text-slate-500 mt-1">This tax % will auto-load on POS screens and Invoices.</p>
        </div>
        <div>
          <label className="text-sm font-semibold text-slate-700 block mb-1">Global Default Discount (%)</label>
          <input 
            value={defaultDiscountPct} 
            onChange={e => setDefaultDiscountPct(e.target.value)} 
            type="number" 
            step="0.01"
            className="w-full px-3 py-2 border rounded-md focus:ring-rose-500 focus:border-rose-500" 
            required 
          />
          <p className="text-xs text-slate-500 mt-1">This discount % will automatically apply on checkout unless changed by Cashier.</p>
        </div>
      </div>
    </form>
  );
}
