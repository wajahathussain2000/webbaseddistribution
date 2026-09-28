"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createRoute, updateRoute } from "@/app/actions/routes";

export default function RouteForm({ territories, initialData }: { territories: any[], initialData?: any }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [name, setName] = useState(initialData?.name || "");
  const [code, setCode] = useState(initialData?.code || "");
  const [territoryId, setTerritoryId] = useState(initialData?.territoryId || "");
  const [visitDays, setVisitDays] = useState(initialData?.visitDays || "[]");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (initialData) {
        await updateRoute(initialData.id, { name, code, territoryId, visitDays });
      } else {
        await createRoute({ name, code, territoryId, visitDays });
      }
      router.push("/routes");
    } catch (err) {
      console.error(err);
      alert(`Failed to ${initialData ? 'update' : 'create'} route.`);
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden p-6 space-y-4">
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-[#0F172A]">Route Name</label>
        <input 
          value={name} onChange={e => setName(e.target.value)} 
          type="text" required 
          className="px-3 py-2 border border-[#E2E8F0] rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm" 
          placeholder="e.g. Downtown Sector A"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-[#0F172A]">Route Code</label>
        <input 
          value={code} onChange={e => setCode(e.target.value)} 
          type="text" required 
          className="px-3 py-2 border border-[#E2E8F0] rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm font-mono" 
          placeholder="e.g. RT-DTA-01"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-[#0F172A]">Territory</label>
        <select 
          value={territoryId} onChange={e => setTerritoryId(e.target.value)} 
          className="px-3 py-2 border border-[#E2E8F0] rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
        >
          <option value="">None (Unassigned)</option>
          {territories.map(t => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-[#0F172A]">Visit Days (JSON format for now)</label>
        <input 
          value={visitDays} onChange={e => setVisitDays(e.target.value)} 
          type="text" 
          className="px-3 py-2 border border-[#E2E8F0] rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm font-mono" 
          placeholder='e.g. ["Mon", "Wed", "Fri"]'
        />
      </div>

      <div className="pt-4 flex justify-end gap-3 border-t border-[#E2E8F0] mt-6">
        <Link href="/routes" className="px-4 py-2 text-sm font-medium text-[#64748B] hover:text-[#0F172A]">
          Cancel
        </Link>
        <button 
          type="submit" 
          disabled={isSubmitting} 
          className="bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-700 hover:to-emerald-600 text-white px-6 py-2 rounded-md text-sm font-semibold shadow-md transition-all active:scale-[0.98] disabled:opacity-70"
        >
          {isSubmitting ? "Saving..." : initialData ? "Update Route" : "Save Route"}
        </button>
      </div>
    </form>
  );
}
